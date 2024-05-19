// widgets
import React from "react";
import { Button, Modal } from "react-bootstrap";

// utils
import { JOB_NOTIFICATION_CONTEXT } from "../utils/contexts";
import { NOTIFICATION_TYPE, ROUTE_LINKS } from "../utils/strings";
import { NOTIFICATIONS } from "../utils/notifications";
import { GET_JWT_JOB } from "../utils/jwt-encode-job";
import api from "../utils/api";
import { JOB_INVOICE_SLIP } from "../sub-components/quote-invoice-slip";
import { IS_LOGGED_IN } from "../utils/loggedin";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

// icons
import { FaCheck } from "react-icons/fa";
import { DATE_FORMATER, TIME_FORMATER } from "../utils/formats";

// export
export function JOB_NOTIFICATION_MODAL() {
  // fetch context
  const context = React.useContext(JOB_NOTIFICATION_CONTEXT);
  // reference to the modal header
  const modalRef = React.useRef();
  // hooks
  const [disableUI, setDisableUI] = React.useState(false);
  const [job, setJob] = React.useState({});
  const [quote, setQuote] = React.useState({
    mid_discount: 0,
    referal_discount: 0,
    base_fee: 0,
    amount_due: 0,
  });
  const [quoteLoaded, setQuoteLoaded] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.warning
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);

    // disable
    const disable =
      type === NOTIFICATION_TYPE.loading || type === NOTIFICATION_TYPE.success;
    setDisableUI((_) => disable);
  };

  // generate Quote
  const generateQuote = React.useCallback(async () => {
    // try retrieve job
    const [verify, payload] = GET_JWT_JOB();
    // verify if booking exists
    if (verify) {
      // set the payload to job
      setJob(() => payload);
      // set notification loading
      setQuoteLoaded((_) => false);
      setNotification(NOTIFICATION_TYPE.loading, "Loading ...", "");

      // url
      const url = "jobs/api/job/generate-quote/";
      await api
        .post(url, payload)
        .then((r) => {
          // check status
          if (r.status === 200) {
            // set notification loading
            setQuoteLoaded((_) => true);
            setQuote((_) => r.data);
            // resend the message
            setNotification(
              NOTIFICATION_TYPE.warning,
              "Dear valued customer. ",
              "We have detected an existing job that's uncomplete, click the BOOK button to complete."
            );
          }
        })
        .catch((e) => {
          setQuoteLoaded((_) => true);
          ErrorHandling(e, setNotification);
        });
    }
    return;
  }, []);

  // createJob
  const createJob = async (payload) => {
    // check if you are logged in
    const [verify, tokens] = IS_LOGGED_IN();

    // check verification
    if (verify) {
      //loading
      setNotification(NOTIFICATION_TYPE.loading, "Creating Job ...", "");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
      };
      // const set url
      const url = "jobs/api/job/create/";
      await api
        .post(url, payload, config)
        .then(async (r) => {
          //
          if (r.status === 200) {
            const msg = "Job successfully created";
            setNotification(NOTIFICATION_TYPE.success, "Awesome. ", msg);
            // remove the job
            localStorage.removeItem("create-job");
            // sleep
            await AwaitCallBack(() => context.setShow((_) => false), 2000);
            await AwaitCallBack(
              () => (window.location.href = ROUTE_LINKS.jobs)
            );
            return;
          }
        })
        .catch((e) => {
          ErrorHandling(e, setNotification);
        });
      return;
    }

    // otherwise
    setDisableUI((_) => true);
    const message =
      "to complete your Job kindly please sign-in, a popup will show to confirm your job.";
    setNotification(
      NOTIFICATION_TYPE.info,
      "Dear valued customer. ",
      `${message}`
    );

    // sleep 3 seconds
    await AwaitCallBack(
      () => (window.location.href = ROUTE_LINKS.signin),
      3000
    );
    return;
  };

  // ui item
  const InvoiceItem = ({ leading, trailing }) => {
    //
    return (
      <div className="d-flex flex-row justify-content-start align-items-center">
        <span className="fw-bold text-dark me-2">{leading}:</span>
        <span className="fw-normal text-dark">{trailing}</span>
      </div>
    );
  };

  const DriverNoteItem = ({ leading, trailing }) => {
    //
    return (
      <div className="d-flex flex-column justify-content-start align-items-start">
        <span className="text-dark fw-bold me-2">{leading}:</span>
        <span className="fw-normal text-dark">{trailing}</span>
      </div>
    );
  };

  //
  const quoteGeneratedSuccessfully = (isGenerated, gJob, quote) => {
    // check if generated
    if (isGenerated) {
      return (
        <div>
          <div className="d-flex flex-column px-3 mb-3">
            <InvoiceItem
              leading={"Job date"}
              trailing={`${DATE_FORMATER.format(new Date(gJob.job_date))}`}
            />
            <InvoiceItem
              leading={"Job time"}
              trailing={`${TIME_FORMATER.format(
                new Date(`${gJob.job_date} ${gJob.job_time} `)
              )}`}
            />
            <InvoiceItem
              leading={"Payment option"}
              trailing={`${
                `${gJob.payment_option}`.toUpperCase().charAt(0) +
                `${gJob.payment_option}`.slice(1).toLowerCase()
              }`}
            />
            <DriverNoteItem
              leading={"Driver Note"}
              trailing={`${gJob.driver_note}`}
            />
          </div>
          {/*Table*/}
          <div className="px-3">
            <table
              className={`table table-success table-striped table-bordered`}
            >
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Distance</td>
                  <td>{`${gJob.distance} km`}</td>
                </tr>
                <tr>
                  <td>Vehicle size</td>
                  <td>{`${gJob.vehicle_size} ton`}</td>
                </tr>
                <tr>
                  <td>Helpers</td>
                  <td>{`${gJob.helpers}`}</td>
                </tr>
                <tr>
                  <td>Floors</td>
                  <td>{`${gJob.floors}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/*Table*/}
          <div className="mt-2">
            <JOB_INVOICE_SLIP job={quote} />
          </div>
        </div>
      );
    }
  };

  // React.useEffect()
  React.useEffect(() => {
    if (context.show) {
      generateQuote();
    }
  }, [generateQuote, context.show]);
  //
  return (
    <Modal
      centered={true}
      show={context.show}
      contentClassName="rounded-0"
      onHide={
        disableUI
          ? null
          : async () => {
              setNotification(NOTIFICATION_TYPE.none, "", "");
              context.setShow((_) => false);
              await AwaitCallBack(
                () => (window.location.href = ROUTE_LINKS.home),
                2000
              );
            }
      }
    >
      <Modal.Header
        ref={modalRef}
        closeButton={true}
        className="rounded-0 bg-white text-dark pb-0 border-0"
      >
        <Modal.Title style={{ fontWeight: "900" }}>
          Job notification
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-0">
        {/*NOTIFICATIONS*/}
        <div className="mb-3 px-3">
          {NOTIFICATIONS(notificationType, leadingText, trailingText)}
        </div>
        {/*NOTIFICATIONS*/}
        {/*Quote*/}
        {quoteGeneratedSuccessfully(quoteLoaded, job, quote)}
        {/*Quote*/}
      </Modal.Body>
      <Modal.Footer className="bg-white border-0">
        <Button
          variant="outline-primary"
          className="rounded-0 border-0 fw-bold d-flex flex-row justify-content-center align-items-center gap-2"
          disabled={disableUI}
          onClick={() => createJob(job)}
        >
          Book
          <FaCheck />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
