import React from "react";
import { JOB_INVOICE_SLIP } from "../quote-invoice-slip";
import { Button, ButtonGroup, Card, Dropdown, Form } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { DATE_FORMATER, TIME_FORMATER } from "../../utils/formats";

// icons
// import { FaChevronRight } from "react-icons/fa";
import { IoArrowForward as Icon } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

// utils
import { ENCODE_CREATE_JOB_JWT, GET_JWT_JOB } from "../../utils/jwt-encode-job";
import api from "../../utils/api";
import { CREATE_JOB_VIEW, NOTIFICATION_TYPE } from "../../utils/strings";
import { ROUTE_LINKS } from "../../utils/strings";
import { CREATE_JOB_CONTEXT } from "../../utils/contexts";
import { HEAR_ABOUT_US } from "../../utils/strings";
import { IS_LOGGED_IN } from "../../utils/loggedin";
import { ErrorHandling } from "../../utils/error-handling";
import { NOTIFICATIONS } from "../../utils/notifications";
import { AwaitCallBack } from "../../utils/await-callback";
import { DEBUG_MODE } from "../../utils/debug-mode";

// animation
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../../utils/animation-variants";

//
export function Quote() {
  //variables
  const HEAR_ABOUT_US_LIST = [
    HEAR_ABOUT_US.none,
    HEAR_ABOUT_US.referral,
    HEAR_ABOUT_US.facebook,
    HEAR_ABOUT_US.gumtree,
  ];
  //
  const context = React.useContext(CREATE_JOB_CONTEXT);

  // react.useState
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");
  const [disableUI, setDisableUI] = React.useState(false);

  // header about us
  const [hearAboutUs, setHearAboutUs] = React.useState(HEAR_ABOUT_US.none);
  const [loadingCopyJob, setLoadingCopyJob] = React.useState(false);
  const [generatedLink, setGeneratedLink] = React.useState("");
  //
  const [quoteLoaded, setQuoteLoaded] = React.useState(false);
  const [quote, setQuote] = React.useState({
    mid_discount: 0,
    referal_discount: 0,
    base_fee: 0,
    amount_due: 0,
  });

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);

    // disable here
    const disable =
      type === NOTIFICATION_TYPE.loading ||
      type === NOTIFICATION_TYPE.success ||
      type === NOTIFICATION_TYPE.info;
    setDisableUI((_) => disable);
  };

  // createJob
  const createJob = async (payload) => {
    // check if you are logged in
    const [verify, _] = IS_LOGGED_IN();
    // check verification
    if (verify) {
      //loading
      setNotification(NOTIFICATION_TYPE.loading, "Creating Job ...", "");

      // const set url
      const url = "jobs/api/job/create/";
      await api
        .post(url, payload)
        .then(async (r) => {
          // variables
          const leading = "Awesome. ";
          const trailing = "Success, job created";
          setNotification(NOTIFICATION_TYPE.success, leading, trailing);
          localStorage.removeItem("create-job"); // remove from local storage
          // sleep
          await AwaitCallBack(
            () => (window.location.href = ROUTE_LINKS.jobs),
            2000
          );

          return;
        })
        .catch((e) => {
          console.log(e);
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
      2000
    );

    return;
  };

  // finisheCreatingJob
  const createJobComplete = async () => {
    //get the payliad
    const [verify, payload] = GET_JWT_JOB();
    // verify
    if (verify) {
      // encode this data
      ENCODE_CREATE_JOB_JWT({
        ...payload,
        hear_about_us: hearAboutUs,
      });

      // fetch encoded data
      const [verify, pLoad] = GET_JWT_JOB();
      if (verify) await createJob(pLoad);
    }
  };

  // generate Quote
  const generateQuote = React.useCallback(async () => {
    // try retrieve job
    const [verify, payload] = GET_JWT_JOB();

    // verify if booking exists
    if (verify) {
      console.log(payload, "This is the payload ");

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
            setNotification(NOTIFICATION_TYPE.none, "", "");

            console.log(r.data);

            setQuote((_) => {
              return {
                ...payload,
                ...r.data,
                // ...,
              };
            });
            console.log(quote);
          }
        })
        .catch((e) => {
          setQuoteLoaded((_) => true);
          ErrorHandling(e, setNotification);
        });
      return;
    }
    return;
  }, []);

  const pickupDropOff = (list, current) => {
    if (current <= 0) return "Pickup";
    else if (current > 0 && current < list.length - 1) return "Both";
    return "Dropoff";
  };

  // generate Job link
  const generateJobLink = async () => {
    // setNotification
    setLoadingCopyJob((_) => false);
    setNotification(NOTIFICATION_TYPE.loading, "Generating job link...", "");

    // retrieve decoded jwt link
    const [verify, payload] = GET_JWT_JOB();
    if (verify) {
      // const
      const url = "quote/job/api/post/";
      await api
        .post(url, payload)
        .then((r) => {
          // check status
          if (r.status === 201) {
            const link =
              (DEBUG_MODE ? "localhost:3000" : "https://xcrossinglines.co.za") +
              `/jobs/job/${r.data.jpk}/create`;
            // set link
            setGeneratedLink((_) => link);
            setLoadingCopyJob((_) => true);
            setNotification(NOTIFICATION_TYPE.none, "", "");
          }
        })
        .catch((e) => {
          setGeneratedLink((_) => "");
          setLoadingCopyJob((_) => false);
          ErrorHandling(e, setNotification);
        });
    }
  };

  const copyToClipBoard = async () => {
    setNotification(NOTIFICATION_TYPE.success, "Awesome. ", "copied");
    // sleep for a few seconds
    await AwaitCallBack(
      () => setNotification(NOTIFICATION_TYPE.none, "", ""),
      2000
    );
  };

  const CopyJob = ({ is_superuser, loaded, link }) => {
    if (is_superuser && loaded)
      return (
        <Form.Group>
          <CopyToClipboard text={link} onCopy={copyToClipBoard}>
            <motion.div
              variants={PAGES_VARIANT}
              transition={{ duration: 1 }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-100 px-3 py-2 mb-2 border border-primary border-opacity-50 d-flex flex-row justify-content-between align-items-center"
              style={{ backgroundColor: "rgba(39, 36, 96, 0.04)" }}
            >
              <span
                className="text-dark text-truncate"
                style={{ fontSize: `${14 / 16}rem` }}
              >
                {`${link}`.replace("https://", "www.")}
              </span>
              <Button
                variant="outline-primary"
                disabled={disableUI}
                className="rounded-5 text-center mx-2 py-1"
                style={{ fontSize: `${12 / 16}rem`, fontWeight: 800 }}
              >
                Copy
              </Button>
            </motion.div>
          </CopyToClipboard>
        </Form.Group>
      );

    // otherwise return nonsense
    return <></>;
  };

  // function to load job
  const wasQuoteLoaded = (loaded, job) => {
    if (loaded) {
      return (
        <div className="mt-3">
          {/*table*/}
          <table className="table table-striped table-bordered table-dark">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Job date</td>
                <td>{`${DATE_FORMATER.format(
                  new Date(`${job.job_date}`)
                )}`}</td>
              </tr>
              <tr>
                <td>Job time</td>
                <td>{`${TIME_FORMATER.format(
                  new Date(`${job.job_date} ${job.job_time}`)
                )}`}</td>
              </tr>
              <tr>
                <td>Vehicle size</td>
                <td>{`${job.vehicle_size} ton`}</td>
              </tr>
              <tr>
                <td>Helpers</td>
                <td>{`${job.helpers}`}</td>
              </tr>
              <tr>
                <td>Floors</td>
                <td>{`${job.floors}`}</td>
              </tr>
              <tr>
                <td>Distance</td>
                <td>{job.distance} km</td>
              </tr>
            </tbody>
          </table>
          {/*table*/}
          {/*table routes and distance*/}
          <table className="table table-striped table-bordered table-dark">
            <thead>
              <tr>
                <th scope="col">Routes</th>
              </tr>
            </thead>
            <tbody>
              {job.routes.map((route, index) => {
                return (
                  <tr>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="form-text fw-bold text-warning">
                          {index + 1} - {pickupDropOff(job.routes, index)}
                        </span>
                        <span style={{ fontSize: `${14 / 16}rem` }}>
                          {route.route_name}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/*table routes and distance*/}
          {/*Invoice slip*/}
          <JOB_INVOICE_SLIP job={job} padding="p-0" />
          {/*Invoice slip*/}

          {/*Copy Job*/}
          <CopyJob
            is_superuser={job.user_details.is_superuser}
            loaded={loadingCopyJob}
            link={generatedLink}
          />
          {/*Copy Job*/}
          {/*Generate Quote Job*/}
          {job.user_details.is_superuser ? (
            <Form.Group>
              <Button
                variant="primary"
                disabled={loadingCopyJob || disableUI}
                className="btn-sm w-100 rounded-0 border-0 text-center text-white fw-bold"
                onClick={generateJobLink}
              >
                Generate job link <Icon />
              </Button>
            </Form.Group>
          ) : (
            <></>
          )}

          {/*Generate Quote Job*/}
          {/*footer*/}
          <Card.Footer className="mt-3 border-top border-light border-3 rounded-0 bg-transparent d-flex flex-row justify-content-end align-items-center">
            <ButtonGroup>
              <Button
                className="rounded-0 border-0 fw-bold"
                variant="outline-secondary"
                disabled={disableUI}
                onClick={() => context.selectPrevious(CREATE_JOB_VIEW.quote)}
              >
                Previous
              </Button>
              <Button
                className="rounded-0 border-0 fw-bold d-flex flex-row justify-content-center align-items-center gap-2"
                variant="outline-primary"
                disabled={disableUI}
                onClick={async () => await createJobComplete()}
              >
                Book <FaCheck />
              </Button>
            </ButtonGroup>
          </Card.Footer>
          {/*footer*/}
        </div>
      );
    }

    // otherwise
    return <></>;
  };

  // useEffect
  React.useEffect(() => {
    generateQuote();
  }, [generateQuote]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [notificationType]);

  // reset
  React.useEffect(() => {
    //
    const [verify, payload] = GET_JWT_JOB();
    // verify
    if (verify)
      ENCODE_CREATE_JOB_JWT({ ...payload, hear_about_us: hearAboutUs });
  }, []);

  // return div
  return (
    <motion.div
      variants={PAGES_VARIANT}
      transition={{ duration: 1 }}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/*NOTIFICATIONS*/}
      {NOTIFICATIONS(notificationType, leadingText, trailingText)}
      {/*NOTIFICATIONS*/}
      {/*Quote Successfuly Loaded*/}
      {wasQuoteLoaded(quoteLoaded, quote)}
      {/*Quote Successfuly Loaded*/}
    </motion.div>
  );
}
