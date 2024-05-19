import React from "react";
import { Card, Container } from "react-bootstrap";
import { SelectVehicleSize } from "../sub-components/create-job/select-vehicle-size";
import { VerticalSpacer } from "../sub-components/vertical-spacer";

import {
  CREATE_JOB_VIEW,
  CREATE_JOB_VIEW_DESCRIPTION,
  CREATE_JOB_VIEW_INDEX,
} from "../utils/strings";

// context
import { CREATE_JOB_CONTEXT } from "../utils/contexts";

// views
import { SelectRoutes } from "../sub-components/create-job/select-routes";
import { SelectAddInfo } from "../sub-components/create-job/select-add-info";
import { Quote } from "../sub-components/create-job/quote";
// import { StepIndicator } from "../sub-components/step-indicator";

// animation
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";

// export

export default function CreateJob() {
  // variables
  const descriptionFS = 14 / 16;
  //
  const [cView, setCView] = React.useState(CREATE_JOB_VIEW.vehicle_size);
  const [stepTitle, setStepTitle] = React.useState("Vehicle Size");

  // select view
  const selectView = (currentView) => {
    switch (currentView) {
      case CREATE_JOB_VIEW.vehicle_size:
        return <SelectVehicleSize />;
      case CREATE_JOB_VIEW.route:
        return <SelectRoutes />;
      case CREATE_JOB_VIEW.add_info:
        return <SelectAddInfo />;
      case CREATE_JOB_VIEW.quote:
        return <Quote />;
      default:
        return;
    }
  };

  // select next view
  const selectNext = (currentView) => {
    switch (currentView) {
      case CREATE_JOB_VIEW.vehicle_size:
        setStepTitle((_) => "Routes");
        return setCView((_) => CREATE_JOB_VIEW.route);
      case CREATE_JOB_VIEW.route:
        setStepTitle((_) => "Additional Information");
        return setCView((_) => CREATE_JOB_VIEW.add_info);
      case CREATE_JOB_VIEW.add_info:
        setStepTitle((_) => "Quote");
        return setCView((_) => CREATE_JOB_VIEW.quote);
      default:
        return;
    }
  };

  // select previous view
  const selectPrevious = (currentView) => {
    switch (currentView) {
      case CREATE_JOB_VIEW.quote:
        setStepTitle((_) => "Additional Information");
        return setCView((_) => CREATE_JOB_VIEW.add_info);
      case CREATE_JOB_VIEW.add_info:
        setStepTitle((_) => "Routes");
        return setCView((_) => CREATE_JOB_VIEW.route);
      case CREATE_JOB_VIEW.route:
        setStepTitle((_) => "Vehicle Size");
        return setCView((_) => CREATE_JOB_VIEW.vehicle_size);
      default:
        return;
    }
  };

  //
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //
  //save
  return (
    <motion.section
      id="CREATE-JOB-SECTION"
      className="pb-3"
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
            as="h3"
            className="text-center bg-transparent pb-0 border-0 rounded-0"
            style={{ fontWeight: "900" }}
          >
            Create Job
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <Card.Subtitle
                className="text-center text-dark fw-normal"
                style={{ fontSize: `${descriptionFS}rem` }}
              >
                <span className="text-muted" style={{ fontWeight: "900" }}>
                  {CREATE_JOB_VIEW_INDEX[cView]} of 4 <span>{stepTitle}.</span>
                </span>{" "}
                {`${CREATE_JOB_VIEW_DESCRIPTION[cView]}`}
              </Card.Subtitle>
            </div>
            {/*steps*/}
            <CREATE_JOB_CONTEXT.Provider
              value={{
                selectNext: selectNext,
                selectPrevious: selectPrevious,
              }}
            >
              {selectView(cView)}
            </CREATE_JOB_CONTEXT.Provider>
            {/*steps*/}
          </Card.Body>
        </Card>
      </Container>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.section>
  );
}
