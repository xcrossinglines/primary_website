import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";

import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { ENCODE_CREATE_JOB_JWT } from "../utils/jwt-encode-job";
// utils
import { COMPLETE_JOB_CONTEXT } from "../utils/contexts";
import { NOTIFICATIONS } from "../utils/notifications";
import {
  NOTIFICATION_TYPE,
  ROUTE_DESCRIPTION,
  ROUTE_LINKS,
  // SHUTTLE_SERVICE,
} from "../utils/strings";
import api from "../utils/api";
import { IS_LOGGED_IN } from "../utils/loggedin";

// icons
import { FiEdit } from "react-icons/fi";
// import { TbLocationFilled } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";

//modals
import { COMPLETE_VEHICLE_SIZE_MODAL } from "../modals/complete-vehicle-size-modal";
import { COMPLETE_ADD_INFO_MODAL } from "../modals/complete-add-info-modal";
import { COMPLETE_ROUTES_MODAL } from "../modals/complete-routes-modal";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

//
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";
import { AnimatedButton } from "../sub-components/animated-button";
import {
  DATE_FORMATER,
  TIME_FORMATER,
  CURRENCY_FORMATER,
} from "../utils/formats";
import { JOB_INVOICE_SLIP } from "../sub-components/quote-invoice-slip";
//
//
export default function CustomerCompleteJob() {
  //
  const { pk } = useParams();

  // navigate
  const navigate = useNavigate();

  // React UseState Hook
  const [job, setJob] = React.useState({
    return_customer_discount: 0,
    hear_about_us: "Referral",
  });
  const [jobLoaded, setJobLoaded] = React.useState(false);
  const [showAdditionalInfoSection, setShowAdditionalInfoSection] =
    React.useState(false);
  const [showRouteSection, setShowRouteSection] = React.useState(false);
  const [showVehicleSizeSection, setShowVehicleSizeSection] =
    React.useState(false);
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");
  const [disableUI, setDisableUI] = React.useState(false);
  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);

    //
    const isDisabled =
      type === NOTIFICATION_TYPE.loading ||
      type === NOTIFICATION_TYPE.info ||
      type === NOTIFICATION_TYPE.success;
    // set
    setDisableUI((_) => isDisabled);
  };

  // display routes new
  const DisplayRoutes = ({ vJob }) => {
    return (
      <div className="mx-3 my-2">
        {/*routes*/}
        <table className="table table-secondary table-striped table-bordered m-0">
          <thead>
            <tr>
              <th scope="col">Routes</th>
            </tr>
          </thead>
          <tbody>
            {vJob.routes.map((route, index) => {
              return (
                <tr key={index}>
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
        {/*routes*/}
        {/*table*/}
        <table
          className={`table table-striped table-bordered table-secondary m-0 mt-2`}
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
              <td>{`${job.distance} km`}</td>
            </tr>
          </tbody>
        </table>
        {/*table*/}
      </div>
    );
  };

  const DisplayAdditionalInformation = ({ vJob }) => {
    // check if loaded first
    if (vJob.job_date && vJob.job_time) {
      return (
        <React.Fragment>
          <div className="pt-2">
            {/* <DriverNote leading={"Driver note"} trailing={vJob.driver_note} /> */}
          </div>

          {/*driver note */}
          <div className="px-3 pt-2 pb-2">
            <table
              className={`table table-striped table-bordered table-secondary m-0`}
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
                  <td>{DATE_FORMATER.format(new Date(`${vJob.job_date}`))}</td>
                </tr>
                <tr>
                  <td>Job time</td>
                  <td>
                    {TIME_FORMATER.format(
                      new Date(`${vJob.job_date} ${vJob.job_time}`)
                    )}
                  </td>
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
                  <td>Driver note</td>
                  <td>{`${job.driver_note}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </React.Fragment>
      );
    }
  };
  // section vehicle size
  const JobSection = ({
    leading,
    onClick,
    showIcon = true,
    disableButton = false,
  }) => {
    return (
      <React.Fragment>
        <AnimatedButton
          onClick={disableButton ? null : () => onClick((_) => true)}
        >
          <div className="bg-secondary bg-opacity-75 px-3 py-2 d-flex flex-row justify-content-between align-items-start gap-1">
            <span
              className={`text-white`}
              style={{ fontWeight: "900", fontSize: `${18 / 16}rem` }}
            >
              {leading}
            </span>
            {showIcon ? (
              <div>
                <FiEdit color="white" />
              </div>
            ) : null}
          </div>
        </AnimatedButton>
      </React.Fragment>
    );
  };

  // loadJob
  const LoadJob = ({ job_quote, loaded }) => {
    // console.log(verifiedJob);
    if (loaded) {
      return (
        <React.Fragment>
          {/*section vehicle Size*/}
          <JobSection
            leading={"Job vehicle type"}
            onClick={setShowVehicleSizeSection}
            disableButton={disableUI}
          />
          {/*section vehicle Size*/}
          {/* 
          {jobSection(true, disableUI)} */}
          <div className="my-2 px-3">
            <table
              className={`table table-striped table-bordered table-secondary m-0`}
            >
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vehicle size</td>
                  <td>{`${job_quote.vehicle_size} Ton`}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/*section vehicle Size*/}
          {/*section Routes */}
          <JobSection
            leading={"Job routes"}
            onClick={setShowRouteSection}
            disableButton={disableUI}
          />

          <DisplayRoutes vJob={job_quote} />
          {/* <DisplayJobRoutes job={job} /> */}
          {/* {displayRoutes(verifiedJob.routes)} */}
          {/*section Routes */}
          {/*additional information*/}

          <div className="mb-3">
            <JobSection
              leading={"Job add-info "}
              onClick={setShowAdditionalInfoSection}
              disableButton={disableUI}
            />
            <DisplayAdditionalInformation vJob={job_quote} />
          </div>
          {/*additional information*/}
          {/*Quote*/}
          <JOB_INVOICE_SLIP job={job_quote} />
          {/*Quote*/}
          {/*BUtton*/}
          <div className="w-100 mt-3 pb-3 pe-3 d-flex flex-row justify-content-end align-items-center">
            <Button
              variant="outline-primary"
              className="fw-bold border-0 rounded-0 d-flex flex-row justify-content-center align-items-center gap-2"
              disabled={disableUI}
              onClick={async () => createJobFunction(job_quote)}
            >
              Book
              <FaCheck />
            </Button>
          </div>
          {/*BUtton*/}
        </React.Fragment>
      );
    }

    return <></>;
  };

  // load modals
  const loadModals = (loaded, pk) => {
    if (loaded) {
      return (
        <React.Fragment>
          {/*Additional Info*/}
          <COMPLETE_JOB_CONTEXT.Provider
            value={{
              primaryKey: pk,
              show: showAdditionalInfoSection,
              setShow: setShowAdditionalInfoSection,
            }}
          >
            <COMPLETE_ADD_INFO_MODAL />
          </COMPLETE_JOB_CONTEXT.Provider>
          {/*Additional Info
          {/*Vehicle size*/}
          <COMPLETE_JOB_CONTEXT.Provider
            value={{
              primaryKey: pk,
              show: showVehicleSizeSection,
              setShow: setShowVehicleSizeSection,
            }}
          >
            <COMPLETE_VEHICLE_SIZE_MODAL />
          </COMPLETE_JOB_CONTEXT.Provider>
          {/*Vehicle size*/}
          {/*edit routes*/}
          <COMPLETE_JOB_CONTEXT.Provider
            value={{
              primaryKey: pk,
              show: showRouteSection,
              setShow: setShowRouteSection,
            }}
          >
            <COMPLETE_ROUTES_MODAL />
          </COMPLETE_JOB_CONTEXT.Provider>
          {/*edit routes*/}
        </React.Fragment>
      );
    }
  };

  // create Job
  const createJobFunction = React.useCallback(async (payload) => {
    // set notification
    setNotification(NOTIFICATION_TYPE.loading, "Creating ...", "");
    // check if you are logged in
    const [isLoggedin, _] = IS_LOGGED_IN();
    // check if this person is logged in
    if (isLoggedin) {
      // const url
      const url = "jobs/api/job/create/";
      await api
        .post(url, payload)
        .then(async (r) => {
          setNotification(NOTIFICATION_TYPE.success, "Awesome.", "Created");
          await AwaitCallBack(() => {
            let anchor = window.document.createElement("a");
            anchor.href = ROUTE_LINKS.jobs;
            anchor.target = "_self";
            anchor.click();
          }, 2000);
        })
        .catch((e) => ErrorHandling(e, setNotification));
    } else {
      // otherwise
      const message =
        "To complete this job, you must be signed in. we'll navigate you to the sign-in page.";
      setNotification(
        NOTIFICATION_TYPE.info,
        "Dear valued customer. ",
        message
      );
      // sleep
      await AwaitCallBack(() => navigate(ROUTE_LINKS.signin), 6000);
    }
  }, []);
  // retrieve
  const saveAndRetrieveJobComplete = React.useCallback(async (primary_key) => {
    // fetching
    setJobLoaded((_) => false);
    setNotification(NOTIFICATION_TYPE.loading, "Loading ...", "");

    // set url
    const url = `quote/job/api/get/${primary_key}/`;
    await api
      .get(url)
      .then(async (r) => {
        // verify status
        if (r.status === 200) {
          // resolve to respective components
          const v_size = Number(r.data.vehicle_size).toFixed(1);
          const payload = { ...r.data, vehicle_size: v_size };
          //set
          setJob((_) => {
            return { ...job, ...payload };
          });
          ENCODE_CREATE_JOB_JWT(payload);
          setNotification(NOTIFICATION_TYPE.none, "", "");
          setJobLoaded((_) => true);
        }
      })
      .catch((e) => ErrorHandling(e, setNotification));
  }, []);

  //
  React.useEffect(() => {
    // save locally
    saveAndRetrieveJobComplete(pk);
    //
  }, [pk]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [notificationType]);
  //
  return (
    <motion.section
      className="pb-3 px-3"
      variants={PAGES_VARIANT}
      animate="visible"
      initial="hidden"
      exit="exit"
      transition={{
        duration: SECTION_ANIMATION_DURATION,
        delay: SECTION_ANIMATION_DELAY,
      }}
    >
      <Container className="p-0 d-flex flex-column justify-content-center align-items-center">
        <Card className="dropdown__shadow card__section border-0 rounded-0 ">
          <Card.Header className="text-white bg-secondary rounded-0 border-0 py-2">
            <div className="d-flex flex-column justify-content-center align-items-start">
              <span style={{ fontWeight: "900" }}>CREATE JOB</span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {/*NOTIFICATIONS*/}
            {NOTIFICATIONS(notificationType, leadingText, trailingText)}
            {/*NOTIFICATIONS*/}
            {/*Load Job*/}
            <LoadJob job_quote={job} loaded={jobLoaded} />
            {/*LOad Job*/}
          </Card.Body>
        </Card>
        {/*Modals*/}
        {loadModals(jobLoaded, pk)}
        {/*Modals*/}
      </Container>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.section>
  );
}
