import React from "react";
import { useNavigate } from "react-router";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";

// utils
import {
  DATETIME_ERROR_MESSAGE,
  NOTIFICATION_TYPE,
  SHUTTLE_SERVICE,
  VEHICLE_TYPE,
} from "../utils/strings";
import { UPDATE_JOB_CONTEXT } from "../utils/contexts";
import { NOTIFICATIONS } from "../utils/notifications";
import { IS_LOGGED_IN } from "../utils/loggedin";
import { ROUTE_LINKS } from "../utils/strings";
import api from "../utils/api";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

//
import "./date_time.css";
//
// export
export function EDIT_ADDITIONAL_INFO_MODAL() {
  // context
  const context = React.useContext(UPDATE_JOB_CONTEXT);
  // navigate
  const navigate = useNavigate();

  // ref
  const driverNoteRef = React.useRef();
  const modalRef = React.useRef();
  //
  const [startDateTime, setStartDateTime] = React.useState(new Date());
  const [additionalHelpers, setAdditionalHelpers] = React.useState(1);
  const [floorsToCarry, setFloorsToCarry] = React.useState(0);
  const [shuttle, setShuttle] = React.useState(0);
  const [disableShuttling, setDisableShuttling] = React.useState(false);
  const [paymentOption, setPaymentOption] = React.useState("CASH");
  const [disableUI, setDisableUI] = React.useState(false);
  //
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");
  const [dateBorderColor, setDateBorderColor] =
    React.useState("border-0 text-dark");
  // const
  const addHelpers = Array(3).fill(0);
  const carryFloors = Array(11).fill(0);

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);

    // disable
    const disableUserInterface =
      type === NOTIFICATION_TYPE.loading || type === NOTIFICATION_TYPE.success;
    setDisableUI(() => disableUserInterface);
  };

  //
  const plurify = (value, singular, plural) => {
    if (value > 1) return `${value} ${plural}`;
    return `${value} ${singular}`;
  };
  //
  // validate Date
  const validateDateTime = async (dateTime) => {
    // scroll
    modalRef.current?.scrollIntoView({ block: "nearest" });
    //Desired time
    const desiredTime = (1 * 60 + 30) * 60 * 1000;
    // validate
    const verify = dateTime - Date.now() < desiredTime;

    // raise and erro
    if (verify) {
      const msg = `${DATETIME_ERROR_MESSAGE}`;
      setNotification(NOTIFICATION_TYPE.error, "Oops! error. ", msg);
      setDateBorderColor((_) => "border border-danger border-1 text-danger");
      return;
    }

    setNotification(NOTIFICATION_TYPE.none, "", "");
    setDateBorderColor((_) => "border-0 text-dark");

    // resolve date time values
    const dateYear = startDateTime.getFullYear();
    const dateMonth = startDateTime.getMonth() + 1;
    const dateDay = startDateTime.getDate();
    const timeHour = startDateTime.getHours();
    const timeMinute = startDateTime.getMinutes();
    const timeSeconds = startDateTime.getSeconds();

    // otherwise everything is good
    const jobDate = `${dateYear}-${dateMonth}-${dateDay}`;
    const jobTime = `${timeHour}:${timeMinute}:${timeSeconds}`;

    //
    await updateAdditionalInfo({
      job_date: jobDate,
      job_time: jobTime,
      helpers: additionalHelpers,
      floors: floorsToCarry,
      shuttle: shuttle,
      payment_option: paymentOption,
      driver_note: driverNoteRef.current.value,
    });
  };

  // updateVehicle SIze
  const updateAdditionalInfo = async (payload) => {
    // check if logged in
    const [verify, __] = IS_LOGGED_IN();
    if (verify) {
      // set notification
      setNotification(NOTIFICATION_TYPE.loading, "Updating ...", "");
      // const
      const url = `jobs/api/job/update/${context.job.id}/`;
      await api
        .patch(url, payload)
        .then(async (r) => {
          if (r.status === 200) {
            // notification
            const msg = "Update success";
            const leadMsg = "Awesome.";
            setNotification(NOTIFICATION_TYPE.success, leadMsg, msg);
            //
            await AwaitCallBack(() => context.setShow((_) => false), 2000);
            await AwaitCallBack(() => {
              const updateUrl = `/jobs/job/${context.job.id}/update`;
              window.location.href = updateUrl;
            });
          }
        })
        .catch((e) => ErrorHandling(e, setNotification));

      return;
    }

    // otherwise
    const message =
      "To view this section you must be signed in. we'll navigate you to the sign-in page.";
    setNotification(NOTIFICATION_TYPE.info, "Dear valued customer. ", message);
    // sleep
    await AwaitCallBack(() => {
      context.setShow((_) => false);
      navigate(ROUTE_LINKS.signin);
    }, 6000);
  };

  // disable shuttling
  const verifyDisabledShuttlingField = (vType, sType) => {
    if (vType <= VEHICLE_TYPE[1].size) {
      setDisableShuttling((_) => true);
      setShuttle((_) => 0);
      return;
    }
    // otherwise enable it
    setDisableShuttling((_) => false);
    setShuttle((_) => sType);
  };

  // const set variables
  const setValues = async (e) => {
    driverNoteRef.current.value = context.job.driver_note;
    setFloorsToCarry((_) => context.job.floors);
    setAdditionalHelpers((_) => context.job.helpers);
    verifyDisabledShuttlingField(context.job.vehicle_size, context.job.shuttle);
    setPaymentOption(context.job.payment_option);
    setStartDateTime(
      new Date(`${context.job.job_date} ${context.job.job_time}`)
    );
  };

  //
  return (
    <Modal
      centered={true}
      show={context.show}
      contentClassName="rounded-0"
      onEntered={setValues}
      onHide={() => {
        context.setShow((_) => false);
        setNotification(NOTIFICATION_TYPE.none, "", "");
        setDateBorderColor((_) => "border-0 text-dark");
      }}
    >
      <Modal.Header
        ref={modalRef}
        closeButton={true}
        // closeVariant="dark"
        className="rounded-0 text-dark border-0"
      >
        <Modal.Title style={{ fontWeight: "900" }}>
          Edit additional information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*NOTIFICATIONS*/}
        {NOTIFICATIONS(notificationType, leadingText, trailingText)}
        {/*NOTIFICATIONS*/}
        {/*Choose Date Time */}
        <Form.Group
          className={`position-relative mb-3 mt-${
            notificationType === NOTIFICATION_TYPE.none ? "0" : "3"
          }`}
        >
          <DatePicker
            disabled={disableUI}
            startDate={startDateTime}
            minDate={Date.now()}
            className={`form-control w-auto py-1 rounded-0 border-0 bg-white fw-bold text-start border-primary date__time`}
            dateFormat="yyyy-MMM-dd HH:mm"
            timeFormat="HH:mm"
            selected={startDateTime}
            calendarClassName="rounded-0 w-100 d-flex flex-row"
            showTimeSelect={true}
            showPopperArrow={false}
            onFocus={(e) => (e.target.readOnly = true)}
            onChange={(dateTime) => {
              setStartDateTime((_) => dateTime);
            }}
          />
          <div className="text-start ps-3">
            <Form.Text>Job date and time</Form.Text>
          </div>
        </Form.Group>
        {/*Choose Date Time */}
        {/*Additional information*/}
        <Form.Group className="mb-3">
          <Dropdown className="border-0">
            <Dropdown.Toggle
              variant="outline-light"
              className="rounded-0 py-1 border-0 text-dark fw-bold d-flex justify-content-between align-items-center"
              disabled={disableUI}
            >
              Additional helpers : {additionalHelpers}
            </Dropdown.Toggle>
            <Dropdown.Menu className="rounded-0">
              {addHelpers.map((_, value) => {
                return (
                  <Dropdown.Item
                    className="fw-bold"
                    key={value + 1}
                    id={addHelpers.length - value}
                    onClick={(e) =>
                      setAdditionalHelpers((_) => Number(e.currentTarget.id))
                    }
                  >
                    {plurify(addHelpers.length - value, "Helper", "Helpers")}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <div className="text-start ps-3">
            <Form.Text>
              Driver + {plurify(additionalHelpers, "helper", "helpers")}
            </Form.Text>
          </div>
        </Form.Group>
        {/*Additional information*/}
        {/*Carry Floors*/}
        <Form.Group className="mb-3">
          <Dropdown className="border-0">
            <Dropdown.Toggle
              variant="outline-light"
              className="rounded-0 py-1 border-0 text-dark fw-bold d-flex justify-content-between align-items-center"
              disabled={disableUI}
            >
              Floors to carry : {floorsToCarry}
            </Dropdown.Toggle>
            <Dropdown.Menu className="rounded-0">
              {carryFloors.map((_, value) => {
                return (
                  <Dropdown.Item
                    className="fw-bold"
                    key={value}
                    id={carryFloors.length - 1 - value}
                    onClick={(e) =>
                      setFloorsToCarry((_) => Number(e.currentTarget.id))
                    }
                  >
                    {plurify(carryFloors.length - 1 - value, "Floor", "Floors")}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <div className="text-start ps-3">
            <Form.Text>
              No. of floors to carry from and to pickup routes
            </Form.Text>
          </div>
        </Form.Group>
        {/*Carry Floors*/}
        {/*Payment Option*/}
        <Form.Group className="mb-3">
          <Dropdown className="border-0">
            <Dropdown.Toggle
              disabled={disableUI}
              variant="outline-light"
              className="py-1 rounded-0 border-0 text-dark fw-bold d-flex justify-content-between align-items-center"
            >
              Payment method : {`${paymentOption}`.toLowerCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu className="rounded-0">
              {["Cash", "Eft"].map((value, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    id={value}
                    className="fw-bold"
                    onClick={(e) =>
                      setPaymentOption((_) => `${value}`.toUpperCase())
                    }
                  >
                    {value}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <div className="text-start ps-3">
            <Form.Text>
              <span className="text-danger fw-bold">Please note! </span> pay{" "}
              {`${paymentOption}`.toLowerCase()} at delivery point
            </Form.Text>
          </div>
        </Form.Group>
        {/*Payment Option*/}
        {/*Driver Note*/}
        <Form.Group className="px-3">
          <Form.Label>Driver note</Form.Label>
          <Form.Control
            required={false}
            disabled={disableUI}
            ref={driverNoteRef}
            className="w-100 rounded-0 fw-bold"
            // placeholder={context.job.driver_note}
          />
          <Form.Text>
            Leave a note for the driver, this can be any information you'd like
            to convey or any special requests.
          </Form.Text>
        </Form.Group>
        {/*Driver Note*/}
      </Modal.Body>
      <Modal.Footer className="rounded-0 border-0">
        <Button
          disabled={disableUI}
          variant="outline-primary"
          className="border-0 rounded-0 fw-bold"
          onClick={async () => await validateDateTime(startDateTime)}
        >
          Select & update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
