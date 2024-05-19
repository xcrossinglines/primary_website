import React from "react";
import { Card, Container, Form, FormGroup, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";

// widgets
import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { Divider } from "../sub-components/divider";
// icons
// import { AiFillEdit } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { TbLocationFilled } from "react-icons/tb";

// context
import { UPDATE_JOB_CONTEXT } from "../utils/contexts";

// utils
import api from "../utils/api";
import { IS_LOGGED_IN } from "../utils/loggedin";
import {
  NOTIFICATION_TYPE,
  ROUTE_DESCRIPTION,
  SHUTTLE_SERVICE,
} from "../utils/strings";
import { ROUTE_LINKS } from "../utils/strings";
import { NOTIFICATIONS } from "../utils/notifications";
import { EDIT_VEHICLE_SIZE_MODAL } from "../modals/edit-vehicle-size-modal";
import { EDIT_ROUTES_MODAL } from "../modals/edit-routes-modal";
import { EDIT_ADDITIONAL_INFO_MODAL } from "../modals/edit-additional-info-modal";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

// import
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";
import { AnimatedButton } from "../sub-components/animated-button";
import { DATE_FORMATER, TIME_FORMATER } from "../utils/formats";
import { JOB_INVOICE_SLIP } from "../sub-components/quote-invoice-slip";

// export
export default function UpdateJob() {
  // get url
  const { id } = useParams();
  // navigate
  const navigate = useNavigate();

  //  formaters
  const formater = Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "zar",
    minimumSignificantDigits: 1,
  });

  // react
  const [showAdditionalInfoSection, setShowAdditionalInfoSection] =
    React.useState(false);
  const [showRouteSection, setShowRouteSection] = React.useState(false);
  const [showVehicleSizeSection, setShowVehicleSizeSection] =
    React.useState(false);

  const [job, setJob] = React.useState({});
  const [jobLoaded, setJobLoaded] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);
  };

  // function to determin
  const pickupDropOff = (list, current) => {
    if (current <= 0) {
      return "Pickup";
    } else if (current > 0 && current < list.length - 1) {
      return "Pickup|Dropoff";
    }
    //
    return "Dropoff";
  };

  //
  const setHeaderStatus = (job_loaded) => {
    if (job_loaded) {
      if (job_loaded.job_completed) return [true, job_loaded];
      else if (job_loaded.job_canceled) return [true, job_loaded];
      else return [false, job_loaded];
    }
  };

  // set header text for job headings
  const setSectionHeaderTextColor = (loaded) => {
    if (loaded) {
      if (job.job_completed || job.job_canceled) return "muted";
      else return "white";
    }
  };

  //
  const setHeaderText = (loaded) => {
    if (loaded) {
      if (job.job_completed) return "COMPLETED";
      else if (job.job_canceled) return "CANCELLED";
      else return "ACTIVE";
    }
  };
  // pick job color
  const setHeaderColor = (loaded) => {
    if (loaded) {
      if (job.job_completed) return "secondary";
      else if (job.job_canceled) return "danger";
      else return "success";
    }
  };
  // section vehicle size
  const jobSection = (leading, onClick, job_details) => {
    // resolve them to their respective components
    const [disable, _job] = job_details;
    // headerClass
    const headerClassName =
      "px-3 py-2 d-flex flex-row justify-content-between align-items-center bg-opacity-75";
    // return
    return (
      <div>
        <AnimatedButton
          onClick={disable ? null : () => onClick(true)}
          className="w-100"
        >
          <div className={`bg-${setHeaderColor(_job)} ${headerClassName}`}>
            {/*header*/}
            <span
              className={`text-${setSectionHeaderTextColor(_job)}`}
              style={{ fontWeight: 900, fontSize: `${18 / 16}rem` }}
            >
              {leading}
            </span>
            {/*header*/}
            {/*Icon*/}
            <FiEdit className={`text-${setSectionHeaderTextColor(_job)}`} />
            {/*Icon*/}
          </div>
        </AnimatedButton>
      </div>
    );
  };

  const DriverNote = ({ leading, trailing }) => {
    return (
      <div className="px-3 d-flex flex-column justify-content-start align-items-start">
        <span className="text-dark fw-bold">{leading}:</span>
        <span className="fw-normal text-info">{trailing}</span>
      </div>
    );
  };

  // secondary display routes
  const DisplayRoutes = ({ job }) => {
    return (
      <div className="px-3 my-2">
        <table
          className={`table table-${setHeaderColor(
            job
          )} table-striped table-bordered m-0`}
        >
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
        {/*table*/}
        <table
          className={`table table-striped table-bordered table-${setHeaderColor(
            job
          )} m-0 mt-2`}
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

  // display routes
  const DisplayJobRoutes = ({ job }) => {
    return <Form.Group className="mx-3 my-2">{/*table*/}</Form.Group>;
  };

  // cannot edit completed job
  const editCompleted = (job_loaded) => {
    if (job_loaded.job_completed || job_loaded.job_canceled) {
      return (
        <div className="bg-warning bg-opacity-25 p-3 text-center">
          <span className="mb-2 text-dark">
            <span className="text-danger fw-bold">Please note!</span> a
            completed or cancelled job cannot be edited.
          </span>
        </div>
      );
    }
  };

  // displayAdditional information
  const DisplayAdditionalInformation = ({ job }) => {
    console.log(job);
    return (
      <React.Fragment>
        <div className="px-3 pt-2 pb-3">
          <table
            className={`table table-striped table-bordered table-${setHeaderColor(
              job
            )} m-0`}
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
                <td>{`${DATE_FORMATER.format(new Date(job.job_date))}`}</td>
              </tr>
              <tr>
                <td>Job time</td>
                <td>{`${TIME_FORMATER.format(
                  new Date(`${job.job_date} ${job.job_time}`)
                )}`}</td>
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
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  };

  // loadJob
  const loadJob = (isLoaded) => {
    if (isLoaded) {
      return (
        <React.Fragment>
          {/*section vehicle Size*/}
          {jobSection(
            "Job vehicle type",
            setShowVehicleSizeSection,
            setHeaderStatus(job)
          )}
          <div className="my-2 px-3">
            <table
              className={`table table-striped table-bordered table-${setHeaderColor(
                job
              )} m-0`}
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
                  <td>{`${job.vehicle_size} Ton`}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/*section vehicle Size*/}
          {/*section Routes */}
          {jobSection("Job routes", setShowRouteSection, setHeaderStatus(job))}
          <DisplayRoutes job={job} />
          {/* {displayRoutes(job.routes)} */}
          {/*section Routes */}
          {/*additional information*/}
          {jobSection(
            "Job add-info ",
            setShowAdditionalInfoSection,
            setHeaderStatus(job)
          )}
          <DisplayAdditionalInformation job={job} />
          {/* {displayAdditionalInfo(job)} */}
          {/*additional information*/}
          {/*Quote*/}

          <JOB_INVOICE_SLIP job={job} />
          {/*Quote*/}
        </React.Fragment>
      );
    }

    return <></>;
  };

  // function to getch
  const fetchUpdateJob = React.useCallback(async () => {
    // check if logged in
    const [verify, _] = IS_LOGGED_IN();
    // verify
    if (verify) {
      //
      setJobLoaded((_) => false);
      setNotification(NOTIFICATION_TYPE.loading, "Fetching Job...", "");

      //
      const url = `jobs/api/get/${id}/`;
      await api
        .get(url)
        .then((r) => {
          // check
          if (r.status === 200) {
            setJob((_) => r.data);
            setJobLoaded((_) => true);
            setNotification(NOTIFICATION_TYPE.none, "", "");
          }
        })
        .catch((e) => {
          // set
          setJobLoaded((_) => false);
          ErrorHandling(e, setNotification);
        });

      return;
    }

    // otherwise
    const message =
      "To view this section you must be signed in. we'll navigate you to the sign-in page.";
    setNotification(NOTIFICATION_TYPE.info, "Dear valued customer. ", message);
    // sleep
    await AwaitCallBack(() => navigate(ROUTE_LINKS.signin), 6000);
    // return
  }, []);

  // load modals
  const loadModals = (loaded, verifiedJob) => {
    if (loaded) {
      return (
        <React.Fragment>
          {/*Additional Info*/}
          <UPDATE_JOB_CONTEXT.Provider
            value={{
              show: showAdditionalInfoSection,
              setShow: setShowAdditionalInfoSection,
              job: verifiedJob,
            }}
          >
            <EDIT_ADDITIONAL_INFO_MODAL />
          </UPDATE_JOB_CONTEXT.Provider>
          {/*Additional Info*/}
          {/*Vehicle size*/}
          <UPDATE_JOB_CONTEXT.Provider
            value={{
              show: showVehicleSizeSection,
              setShow: setShowVehicleSizeSection,
              job: verifiedJob,
            }}
          >
            <EDIT_VEHICLE_SIZE_MODAL />
          </UPDATE_JOB_CONTEXT.Provider>
          {/*Vehicle size*/}
          {/*edit routes*/}
          <UPDATE_JOB_CONTEXT.Provider
            value={{
              show: showRouteSection,
              setShow: setShowRouteSection,
              job: verifiedJob,
            }}
          >
            <EDIT_ROUTES_MODAL />
          </UPDATE_JOB_CONTEXT.Provider>
          {/*edit routes*/}
        </React.Fragment>
      );
    }
  };

  // React hook
  React.useEffect(() => {
    window.scrollTo(0, 0);
    fetchUpdateJob();
  }, [fetchUpdateJob]);

  //safe
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
        <Card className="dropdown__shadow card__section border-0 rounded-0">
          <Card.Header
            className={`bg-${setHeaderColor(
              jobLoaded
            )} text-white rounded-0 border-0 mb-0`}
          >
            <div className="d-flex flex-row justify-content-between align-items-center">
              <span style={{ fontWeight: "900" }}>INVOICE {id}</span>
              <span className={`text-white fw-bold`}>
                {setHeaderText(jobLoaded)}
              </span>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {editCompleted(job)}
            {/*NOTIFICATIONS*/}
            {NOTIFICATIONS(notificationType, leadingText, trailingText)}
            {/*NOTIFICATIONS*/}
            {/*Load Job*/}
            {loadJob(jobLoaded)}
            {/*Load Job*/}
          </Card.Body>
        </Card>
        {/*Modals*/}
        {loadModals(jobLoaded, job)}
        {/*Modals*/}
      </Container>
      <VerticalSpacer height={"100px"} />
    </motion.section>
  );
}
