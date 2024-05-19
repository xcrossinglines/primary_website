import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import { Job } from "../sub-components/job";
import { VerticalSpacer } from "../sub-components/vertical-spacer";

// utils
import { IS_LOGGED_IN } from "../utils/loggedin";
import { NOTIFICATIONS } from "../utils/notifications";
import { NOTIFICATION_TYPE, ROUTE_LINKS } from "../utils/strings";
import api from "../utils/api";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

// animation
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";

//
export default function Jobs() {
  // React useStates
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");

  // const
  const [jobs, setJobs] = React.useState([]);
  const [jobsLoaded, setJobsLoaded] = React.useState(false);

  // navigate
  const navigate = useNavigate();

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);
  };

  // const
  const LoadedSuccess = (loaded) => {
    if (loaded) {
      if (jobs.length <= 0) {
        return (
          <div className="p-1">
            <span className="fw-bold">Make your first Job. </span>
            <Link className="sign__in__links" to={ROUTE_LINKS.create_job}>
              Create Job.
            </Link>
          </div>
        );
      }
      return jobs.map((job, i) => <Job key={i} job={job} />);
    }
  };

  //
  const fetchJobs = React.useCallback(async () => {
    // check if logged in
    const [verify, _] = IS_LOGGED_IN();
    //check verification
    if (verify) {
      //setloading
      setJobsLoaded((_) => false);
      setNotification(NOTIFICATION_TYPE.loading, "Fetching Jobs ...", "");

      await api
        .get("jobs/api/get/")
        .then((r) => {
          setJobsLoaded((_) => true);
          setJobs((_) => [...r.data.results]);
          setNotification(NOTIFICATION_TYPE.none, "", "");
        })
        .catch((e) => {
          setJobsLoaded((_) => false);
          ErrorHandling(e, setNotification);
        });

      //return;
      return;
    }

    // otherwise
    const message =
      "To view this section you must be signed in. we'll navigate you to the sign-in page.";
    setNotification(NOTIFICATION_TYPE.info, "Dear valued customer. ", message);
    // sleep
    await AwaitCallBack(() => navigate(ROUTE_LINKS.signin), 6000);
  }, []);

  //
  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  //
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //return
  return (
    <motion.section
      variants={PAGES_VARIANT}
      animate="visible"
      initial="hidden"
      exit="exit"
      transition={{
        duration: SECTION_ANIMATION_DURATION,
        delay: SECTION_ANIMATION_DELAY,
      }}
    >
      <Container className="px-3 d-flex flex-column justify-content-center align-items-center px-0">
        <div className="card__section pt-3">
          <div
            id="JOBS_TITLE"
            className="h3 p-0 m-0 mb-4 text-center"
            style={{ fontWeight: "900" }}
          >
            Jobs
          </div>
          {/*NOTIFICATIONS*/}
          {NOTIFICATIONS(notificationType, leadingText, trailingText)}
          {/*NOTIFICATIONS*/}
        </div>

        {/*JOBs*/}
        {LoadedSuccess(jobsLoaded)}
        {/*JOBs*/}
        <VerticalSpacer height={`${window.innerHeight / 2}px`} />
      </Container>
    </motion.section>
  );
}
