import React from "react";
import { Button, Card, Carousel, Form, Modal } from "react-bootstrap";
import { NOTIFICATION_TYPE, ROUTE_LINKS, VEHICLE_TYPE } from "../utils/strings";
import { COMPLETE_JOB_CONTEXT } from "../utils/contexts";
import { NOTIFICATIONS } from "../utils/notifications";
import { AwaitCallBack } from "../utils/await-callback";
import api from "../utils/api";
import { ErrorHandling } from "../utils/error-handling";
import { AnimatedButton } from "../sub-components/animated-button";

// export
export function COMPLETE_VEHICLE_SIZE_MODAL() {
  // context
  const context = React.useContext(COMPLETE_JOB_CONTEXT);

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
    setDisableUI(
      (_) =>
        type === NOTIFICATION_TYPE.loading || type === NOTIFICATION_TYPE.success
    );
  };

  //
  const updateVehicleSize = async (vType) => {
    //
    modalRef.current?.scrollIntoView({ block: "nearest" });
    setNotification(NOTIFICATION_TYPE.loading, "Updating ...", "");

    // const
    const url = `quote/job/api/update/${context.primaryKey}/`;
    await api
      .put(url, { vehicle_size: vType })
      .then(async (r) => {
        // if
        if (r.status === 200) {
          setNotification(NOTIFICATION_TYPE.success, "Awesome.", "Updated");
          await AwaitCallBack(() => context.setShow((_) => false), 2000);
          await AwaitCallBack(
            () =>
              (window.location.href = `/jobs/job/${context.primaryKey}/create`)
          );
        }
      })
      .catch((e) => ErrorHandling(e, setNotification));
  };

  //
  const fetchQuoteJob = React.useCallback(async (pk) => {
    // #.... fetching
    modalRef.current?.scrollIntoView({ block: "nearest" });
    setNotification(NOTIFICATION_TYPE.loading, "Loading ...", "");
    // # ... url
    const url = `quote/job/api/get/${pk}/`;
    await api
      .get(url)
      .then((r) => {
        setNotification(NOTIFICATION_TYPE.none, "", "");
        if (r.status === 200) setVehicleType(r.data);
      })
      .catch((e) => ErrorHandling(e, setNotification));
  }, []);

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
  const setVehicleType = (payload) => {
    //find
    const index = VEHICLE_TYPE.findIndex((item) => {
      const jobVSize = Number(payload.vehicle_size).toFixed(1);
      const itemSize = Number(`${item.size}`).toFixed(1);
      return itemSize === jobVSize;
    });
    // select current vehicle size
    setSelectedVehicle((_) => index);
  };
  //
  React.useEffect(() => {
    fetchQuoteJob(context.primaryKey);
  }, [context.show]);

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
        // closeVariant="dark"
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
                <Form.Group>
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
                      onClick={(e) => setSelectedVehicle((_) => vSize(vsize))}
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
      <Modal.Footer className="rounded-0 border-0">
        <Button
          variant="outline-primary"
          className="border-0 rounded-0 fw-bold"
          disabled={disableUI}
          onClick={async () =>
            await updateVehicleSize(
              VEHICLE_TYPE[selectedVehicle].size.toFixed(1)
            )
          }
        >
          Select & update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
