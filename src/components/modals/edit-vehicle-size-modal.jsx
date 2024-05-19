import React from "react";
import { Button, Carousel, Form, Modal } from "react-bootstrap";
import { NOTIFICATION_TYPE, VEHICLE_TYPE } from "../utils/strings";
import { UPDATE_JOB_CONTEXT } from "../utils/contexts";
import { NOTIFICATIONS } from "../utils/notifications";
import { IS_LOGGED_IN } from "../utils/loggedin";
import { ROUTE_LINKS } from "../utils/strings";
import api from "../utils/api";
import { useNavigate } from "react-router";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";
import { AnimatedButton } from "../sub-components/animated-button";

// export
export function EDIT_VEHICLE_SIZE_MODAL() {
  // context
  const context = React.useContext(UPDATE_JOB_CONTEXT);
  // navigate
  const navigate = useNavigate();

  // ref
  const modalRef = React.useRef();

  // React Hook useState
  const [selectedVehicle, setSelectedVehicle] = React.useState(0);
  const [disableUI, setDisableUI] = React.useState(false);
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

    // disable
    const disable =
      type === NOTIFICATION_TYPE.loading || type === NOTIFICATION_TYPE.success;
    setDisableUI((_) => disable);
  };

  // updateVehicle SIze
  const updateVSize = async () => {
    // check if logged in
    const [verify, __] = IS_LOGGED_IN();
    //
    if (verify) {
      // set notification
      modalRef.current?.scrollIntoView({ block: "nearest" });
      setNotification(NOTIFICATION_TYPE.loading, "Updating ...", "");

      // const
      const url = `jobs/api/job/update/${context.job.id}/`;
      await api
        .patch(url, {
          vehicle_size: VEHICLE_TYPE[selectedVehicle].size.toFixed(1),
        })
        .then(async (r) => {
          //
          const msg = "Vehicle size updated successfully";
          setNotification(NOTIFICATION_TYPE.success, "Awesome.", msg);

          // then wait for 3 seconds
          const updateUrl = `/jobs/job/${context.job.id}/update`;
          await AwaitCallBack(() => context.setShow((_) => false), 2000);
          await AwaitCallBack(() => (window.location.href = updateUrl), 2000);
        })
        .catch((e) => {
          ErrorHandling(e, setNotification);
        });

      return;
    }

    // otherwise
    // otherwise
    const message =
      "To view this section you must be signed in. we'll navigate you to the sign-in page.";
    setNotification(NOTIFICATION_TYPE.info, "Dear valued customer. ", message);
    // pause
    await AwaitCallBack(() => {
      context.setShow((_) => false);
      navigate(ROUTE_LINKS.signin);
    }, 6000);
  };

  //
  // vsize
  const vSize = (vsize) => {
    //find
    const index = VEHICLE_TYPE.findIndex((item) => {
      return item.size === vsize.size;
    });
    // return
    return index;
  };

  // function
  const VChecked = (selected, vSize) =>
    VEHICLE_TYPE[selected].size === vSize.size;
  //
  React.useEffect(() => {
    setSelectedVehicle((_) =>
      VEHICLE_TYPE.findIndex((item) => {
        return item.size === context.job.vehicle_size;
      })
    );
  }, [context]);

  //
  return (
    <Modal
      centered={true}
      show={context.show}
      contentClassName="rounded-0"
      onHide={
        disableUI
          ? null
          : () => {
              setNotification(NOTIFICATION_TYPE.none, "", "");
              context.setShow((_) => false);
            }
      }
    >
      <Modal.Header
        ref={modalRef}
        closeButton={true}
        className="rounded-0 text-dark border-0"
      >
        <Modal.Title style={{ fontWeight: "900" }}>
          Edit vehicle size
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*NOTIFICATIONS*/}
        {NOTIFICATIONS(notificationType, leadingText, trailingText)}
        {/*NOTIFICATIONS*/}
        {/*Carousel*/}
        <Carousel
          activeIndex={selectedVehicle}
          controls={false}
          indicators={false}
        >
          {VEHICLE_TYPE.map((v, i) => {
            //return
            return (
              <Carousel.Item className="px-4 pt-2" key={i}>
                <div className="w-100 d-flex justify-content-center align-items-center">
                  <img className="d-block w-75" src={v.img} alt={`${v.size}`} />
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
        {/*Carousel*/}
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
                    disabled={disableUI}
                    value={vsize.size}
                    checked={VChecked(selectedVehicle, vsize)}
                    onClick={(e) => setSelectedVehicle((_) => vSize(vsize))}
                  >
                    <Form.Check.Label
                      style={{
                        fontSize: `${14 / 16}rem`,
                        fontWeight: VChecked(selectedVehicle, vsize) ? 600 : "",
                      }}
                      onClick={() => setSelectedVehicle((_) => vSize(vsize))}
                    >
                      <span
                        className={`text-${
                          VChecked(selectedVehicle, vsize) ? "primary" : "dark"
                        }`}
                        style={{ fontWeight: "900" }}
                      >
                        {vsize.size} Ton
                      </span>{" "}
                      {vsize.description}
                    </Form.Check.Label>
                    <Form.Check.Input
                      type="checkbox"
                      value={vsize.size}
                      disabled={disableUI}
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
      </Modal.Body>
      <Modal.Footer className="rounded-0 border-0 m-0">
        <Button
          variant="outline-primary"
          className="border-0 rounded-0 fw-bold"
          disabled={disableUI}
          onClick={async () => await updateVSize()}
        >
          Select & update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
