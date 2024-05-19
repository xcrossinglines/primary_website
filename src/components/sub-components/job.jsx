import React from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { NOTIFICATIONS } from "../utils/notifications";
import { JOB_INVOICE_SLIP } from "../sub-components/quote-invoice-slip";

import {
  NOTIFICATION_TYPE,
  ROUTE_LINKS,
  ROUTE_DESCRIPTION,
} from "../utils/strings";

import { IS_LOGGED_IN } from "../utils/loggedin";
import { useNavigate } from "react-router";
import api from "../utils/api";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";
import { DATE_FORMATER, TIME_FORMATER } from "../utils/formats";

export function Job({ job }) {
  // React useStates
  const [notificationType, setNotificationType] = new React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = new React.useState("");
  const [trailingText, setTrailingText] = new React.useState("");
  const [disableUI, setDisableUI] = React.useState(false);

  // navigate
  const navigate = useNavigate();
  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);

    // disable
    const disable = type === NOTIFICATION_TYPE.loading;
    setDisableUI((_) => disable);
  };

  // const
  const cancelJob = async () => {
    // check if logged in
    const [verify, _] = IS_LOGGED_IN();
    //verify
    if (verify) {
      //return
      setNotification(NOTIFICATION_TYPE.loading, "Cancelling Job...", "");

      // const url
      const url = `jobs/api/job/update/${job.id}/`;
      await api
        .patch(url, { job_canceled: true })
        .then(async (r) => {
          //return
          if (r.status === 200) {
            const leading = "Success";
            const trailing = "Job cancelled";
            setNotification(NOTIFICATION_TYPE.success, leading, trailing);
            await AwaitCallBack(
              () => (window.location.href = ROUTE_LINKS.jobs),
              2000
            );
          }
        })
        .catch((e) => {
          ErrorHandling(e, setNotification);
        });
      return;
    }
    const message =
      "To cancel a job you must be signed in. we'll navigate you to the sign-in page.";
    setNotification(NOTIFICATION_TYPE.info, "Dear valued customer. ", message);
    await AwaitCallBack(() => navigate(ROUTE_LINKS.signin), 6000);
  };

  const DisplayRoutes = ({ job }) => {
    return (
      <div className="px-3">
        <table
          className={`table table-${setJobHeaderColor(
            job
          )} table-striped table-bordered`}
        >
          <thead>
            <tr>
              <th scope="col">Routes</th>
            </tr>
          </thead>
          <tbody>
            {job.routes.map((route, index) => {
              // console.log(value.route_name);
              return (
                <tr>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="form-text fw-bold">
                        {index + 1} - {ROUTE_DESCRIPTION[route.description]}
                      </span>
                      <span>{route.route_name}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // pick job text
  const setJobHeaderText = (job) => {
    if (job.job_completed) return "COMPLETED";
    else if (job.job_canceled) return "CANCELLED";
    else return "ACTIVE";
  };
  // pick job color
  const setJobHeaderColor = (job) => {
    if (job.job_completed) return "secondary";
    else if (job.job_canceled) return "danger";
    else return "success";
  };

  console.log(job);
  //
  return (
    <Card
      id={`Invoice-${job.id}`}
      className="dropdown__shadow card__section mb-3 border-0 rounded-0"
    >
      <Card.Header
        className={`fw-bold border-0 rounded-0 bg-${setJobHeaderColor(
          job
        )} text-white`}
      >
        <div className="d-flex flex-row justify-content-between align-items-center">
          <span style={{ fontWeight: 900 }}>INVOICE {job.id}</span>
          <span className="text-white fw-bold">{setJobHeaderText(job)}</span>
        </div>
      </Card.Header>
      <Card.Body className="pb-0 px-0 pt-0">
        {/*NOTIFICATION*/}
        {NOTIFICATIONS(notificationType, leadingText, trailingText)}
        {/*NOTIFICATION*/}

        {/*Variables*/}
        <div className="px-3 mt-3">
          <table
            className={`table table-${setJobHeaderColor(
              job
            )} table-striped table-bordered`}
          >
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
                <td>Date time</td>
                <td>{`${TIME_FORMATER.format(
                  new Date(`${job.job_date} ${job.job_time}`)
                )}`}</td>
              </tr>
              <tr>
                <td>Vehicle size</td>
                <td>{`${job.vehicle_size} ton`}</td>
              </tr>
              <tr>
                <td>Payment option</td>
                <td>{`${job.payment_option}`}</td>
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
                <td>{`${job.distance} km`}</td>
              </tr>

              <tr>
                <td>Driver note</td>
                <td>{`${job.driver_note}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*Variables*/}
        {/*Display routes*/}
        <DisplayRoutes job={job} />
        {/*Display routes*/}
        {/*Job Invoice Slip*/}
        <div className="mt-2">
          <JOB_INVOICE_SLIP job={job} />
        </div>
        {/*Job Invoice Slip*/}
      </Card.Body>
      {/*items*/}
      <Card.Footer className="pb-3 px-0 mx-3 border-0 bg-transparent d-flex flex-row justify-content-end align-items-center">
        <ButtonGroup>
          <Button
            disabled={job.job_canceled || disableUI || job.job_completed}
            variant="outline-primary"
            className="rounded-0 border-0 fw-bold"
            onClick={() => {
              let anchor = window.document.createElement("a");
              anchor.href = `/jobs/job/${job.id}/update`;
              anchor.target = "_blank";
              anchor.rel = "noreferrer";
              anchor.click();
            }}
          >
            Update
          </Button>
          <Button
            variant="outline-danger"
            disabled={job.job_canceled || disableUI || job.job_completed}
            className="border-0 rounded-0 fw-bold"
            onClick={async () => {
              const title = document.getElementById("JOBS_TITLE");
              const jobRef = document.getElementById(`Invoice-${job.id}`);
              window.scrollTo(0, jobRef.offsetTop - title.offsetTop);
              // run
              await AwaitCallBack(async () => await cancelJob());
            }}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Card.Footer>
    </Card>
  );
}
