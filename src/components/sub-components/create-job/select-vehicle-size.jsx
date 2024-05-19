import React from "react";
import { Button, Card, Carousel, Form } from "react-bootstrap";

//
import { ENCODE_CREATE_JOB_JWT } from "../../utils/jwt-encode-job";
import { VEHICLE_TYPE } from "../../utils/strings";
import { CREATE_JOB_VIEW } from "../../utils/strings";
import { CREATE_JOB_CONTEXT } from "../../utils/contexts";
import { GET_JWT_JOB } from "../../utils/jwt-encode-job";

// animation
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../../utils/animation-variants";
import { AnimatedButton } from "../animated-button";
//
export function SelectVehicleSize() {
  //contexts
  const context = React.useContext(CREATE_JOB_CONTEXT);
  //
  const [selectedVehicle, setSelectedVehicle] = React.useState(0);

  // vsize
  const vSize = (vsize) => {
    //find
    const index = VEHICLE_TYPE.findIndex((item) => {
      return item.size === vsize.size;
    });
    // return
    return index;
  };

  const VChecked = (selected, vsize) =>
    VEHICLE_TYPE[selected].size === vsize.size;
  //
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedVehicle]);

  React.useEffect(() => {
    // get job
    const [verify, payload] = GET_JWT_JOB();
    // verify ...
    if (verify) {
      const index = VEHICLE_TYPE.findIndex((item) => {
        // vehicle size
        const jobVSize = Number(payload.vehicle_size).toFixed(1);
        const itemSize = Number(`${item.size}`).toFixed(1);
        // return
        return itemSize === jobVSize;
      });
      // set current car
      setSelectedVehicle((_) => index);
    }
  }, []);
  //
  return (
    <motion.div
      variants={PAGES_VARIANT}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 1,
      }}
    >
      <div
        className="mx-2 bg-warning bg-opacity-25 border border-warning border-opacity-25 p-3 mb-3"
        style={{ fontSize: `${14 / 16}rem` }}
      >
        <span className="text-danger fw-bolder">Please note !</span>{" "}
        <span className="text-dark fw-bolder">1.5 ton vehicle</span> comes in
        two variants;
        <ul className="mb-0">
          <li>
            1.5 ton bakkie (e.g H-100) <strong>variation</strong>.
          </li>
          <li>
            1 ton bakkie with a trailer <strong>variation</strong>.
          </li>
        </ul>
      </div>
      <Carousel
        activeIndex={selectedVehicle}
        controls={false}
        indicators={false}
      >
        {VEHICLE_TYPE.map((v, i) => {
          //return
          return (
            <Carousel.Item className="px-4 pt-2 bg-transparent" key={i}>
              <div className="w-100 d-flex justify-content-center align-items-center">
                <img className="d-block w-75" src={v.img} alt={`${v.size}`} />
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>

      {/*Buttons*/}
      <div className="py-3 d-flex flex-column justify-content-start align-items-start gap-2">
        {VEHICLE_TYPE.map((vsize, i) => {
          return (
            <AnimatedButton key={i} className="p-1">
              <Form.Group
                id={`Group-${i}`}
                className="border border-0 border-end border-3 pe-1"
              >
                <Form.Check
                  type="checkbox"
                  value={vsize.size}
                  id={`VehicleType-${i}`}
                  onClick={(e) => setSelectedVehicle((_) => vSize(vsize))}
                  checked={VChecked(selectedVehicle, vsize)}
                >
                  <Form.Check.Label
                    role="button"
                    className="text-dark"
                    style={{
                      fontSize: `${14 / 16}rem`,
                      fontWeight: VChecked(selectedVehicle, vsize) ? 600 : "",
                    }}
                  >
                    <span
                      className={`text-${
                        VChecked(selectedVehicle, vsize) ? "primary" : "dark"
                      }`}
                      style={{ fontWeight: "900" }}
                      role="button"
                      onClick={() => setSelectedVehicle((_) => vSize(vsize))}
                    >
                      {vsize.size} Ton
                    </span>{" "}
                    {vsize.description}
                  </Form.Check.Label>
                  <Form.Check.Input
                    type="checkbox"
                    value={vsize.size}
                    onChange={(e) => {}}
                    onClick={(e) => setSelectedVehicle((_) => vSize(vsize))}
                    checked={VChecked(selectedVehicle, vsize)}
                  />
                </Form.Check>
              </Form.Group>
            </AnimatedButton>
          );
        })}
        {/*Buttons*/}
      </div>
      <Card.Footer className="border-top border-3 border-light rounded-0 bg-transparent d-flex flex-row justify-content-end align-items-center">
        <Button
          variant="outline-primary"
          className="rounded-0 border-0"
          style={{ fontWeight: "800" }}
          onClick={() => {
            // check if exists
            const [verify, payload] = GET_JWT_JOB();
            if (verify) {
              // create data
              const data = {
                ...payload,
                vehicle_size: VEHICLE_TYPE[selectedVehicle].size.toFixed(1),
              };
              // save locally
              ENCODE_CREATE_JOB_JWT(data);
              context.selectNext(CREATE_JOB_VIEW.vehicle_size);
              return;
            }
            // create data
            const data = {
              vehicle_size: VEHICLE_TYPE[selectedVehicle].size.toFixed(1),
            };
            // save locally
            ENCODE_CREATE_JOB_JWT(data);
            context.selectNext(CREATE_JOB_VIEW.vehicle_size);
          }}
        >
          Select & proceed
        </Button>
      </Card.Footer>
    </motion.div>
  );
}
