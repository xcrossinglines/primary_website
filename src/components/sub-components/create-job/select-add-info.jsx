import React from "react";
import { Button, ButtonGroup, Card, Dropdown, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";

// utils
import {
  CREATE_JOB_VIEW,
  DATETIME_ERROR_MESSAGE,
  NOTIFICATION_TYPE,
} from "../../utils/strings";
import { ENCODE_CREATE_JOB_JWT, GET_JWT_JOB } from "../../utils/jwt-encode-job";
import { CREATE_JOB_CONTEXT } from "../../utils/contexts";
import "./date_time.css";
import { NOTIFICATIONS } from "../../utils/notifications";
import { GET_VERIFIED_JWT_JOB } from "../../utils/jwt-encode-job";
import { VEHICLE_TYPE } from "../../utils/strings";

// animation
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../../utils/animation-variants";

export function SelectAddInfo() {
  //variables

  const helperArray = Array(3).fill(0);
  const carryFloorsArray = Array(11).fill(0);
  //refs
  const driverNoteRef = React.useRef();
  // context
  const context = React.useContext(CREATE_JOB_CONTEXT);
  // react hooks
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");
  const [startDateTime, setStartDateTime] = React.useState(new Date());
  const [addHelpers, setAddHelpers] = React.useState(1);
  const [carryFloors, setCarryFloors] = React.useState(0);
  const [shuttle, setShuttle] = React.useState(0);
  // const [disableShuttling, setDisableShuttling] = React.useState(false);
  const [paymentOption, setPaymentOption] = React.useState("CASH");
  const [driverNote, setDriverNote] = React.useState("");
  const [loadPayload, setLoadPayload] = React.useState(true);
  const [dateBorderColor, setDateBorderColor] =
    React.useState("border-0 text-dark");

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);
  };

  const plurify = (value, singular, plural) => {
    if (value > 1) return `${value} ${plural}`;
    return `${value} ${singular}`;
  };

  // validate Date
  const validateDateTime = React.useCallback((dateTime) => {
    // desired hour   (hours*60 + min)*seconds*milli
    const desiredTime = (1 * 60 + 30) * 60 * 1000;
    // validate
    const verify = dateTime - Date.now() < desiredTime;
    // raise and erro
    if (verify) {
      // scroll up
      setDateBorderColor((_) => "border border-danger border-1 text-danger");
      window.scrollTo(0, 0);
      setNotification(
        NOTIFICATION_TYPE.error,
        "Oops! error. ",
        `${DATETIME_ERROR_MESSAGE}`
      );
      return;
    }
    setDateBorderColor((_) => "border-0 text-dark");
    setNotification(NOTIFICATION_TYPE.none, "", "");
    context.selectNext(CREATE_JOB_VIEW.add_info);
  }, []);

  // function
  const retrieveDateTime = React.useCallback((dateTime) => {
    // constuct variables
    const dateYear = dateTime.getFullYear();
    const dateMonth = dateTime.getMonth() + 1;
    const dateDay = dateTime.getDate();
    const timeHour = dateTime.getHours();
    const timeMinute = dateTime.getMinutes();
    const timeSeconds = dateTime.getSeconds();

    // join
    const jobDate = `${dateYear}-${dateMonth}-${dateDay}`;
    const jobTime = `${timeHour}:${timeMinute}:${timeSeconds}`;
    // return
    return [jobDate, jobTime];
  }, []);

  // disable shuttling
  const verifyDisabledShuttlingField = (vType, sType) => {
    if (vType <= VEHICLE_TYPE[1].size) {
      // setDisableShuttling((_) => true);
      setShuttle((_) => 0);
      return;
    }
    // otherwise enable it
    // setDisableShuttling((_) => false);
    setShuttle((_) => sType);
  };

  //
  React.useLayoutEffect(() => {
    // get
    const [verify, payload] = GET_VERIFIED_JWT_JOB();
    if (verify && loadPayload) {
      setAddHelpers((_) => payload.helpers);
      setCarryFloors((_) => payload.floors);
      setPaymentOption((_) => payload.payment_option);
      setStartDateTime(new Date(`${payload.job_date} ${payload.job_time}`));
      verifyDisabledShuttlingField(payload.vehicle_size, payload.shuttle);
      driverNoteRef.current.value = payload.driver_note;
      return;
    }
  }, []);
  //
  React.useEffect(() => window.scrollTo(0, 0), []);

  // save to local storage
  React.useEffect(() => {
    // check job exists
    const [verify, payload] = GET_JWT_JOB();
    // verify existance
    if (verify && !loadPayload) {
      // first check date
      const [date, time] = retrieveDateTime(startDateTime);
      // create json
      const addInfodata = {
        job_date: date,
        job_time: time,
        helpers: addHelpers,
        floors: carryFloors,
        shuttle: shuttle,
        payment_option: paymentOption,
        driver_note: driverNoteRef.current.value,
      };
      //encode the job
      ENCODE_CREATE_JOB_JWT({
        ...payload,
        ...addInfodata,
      });
      return;
    }
    // return
    return;
  }, [
    addHelpers,
    carryFloors,
    paymentOption,
    shuttle,
    startDateTime,
    driverNote,
  ]);

  //
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
      {/*Choose Date Time */}
      <Form.Group className="my-3">
        <DatePicker
          startDate={startDateTime}
          minDate={Date.now()}
          showTimeSelect={true}
          className={`form-control w-auto py-1 rounded-0 border-0 bg-white text-start border-primary date__time fw-bold`}
          dateFormat="yyyy-MMM-dd HH:mm"
          timeFormat="HH:mm"
          calendarClassName="rounded-0 w-100 d-flex flex-row"
          selected={startDateTime}
          showPopperArrow={false}
          onFocus={(e) => (e.target.readOnly = true)}
          onChange={(dateTime) => {
            setLoadPayload((_) => false);
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
          >
            Additional helpers : {addHelpers}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-0">
            {helperArray.map((_, value) => {
              return (
                <Dropdown.Item
                  className="fw-bold"
                  key={`add-helper-${value}`}
                  onClick={(e) => {
                    setLoadPayload((_) => false);
                    setAddHelpers((_) => helperArray.length - value);
                  }}
                >
                  {plurify(helperArray.length - value, "Helper", "Helpers")}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <div className="text-start ps-3">
          <Form.Text>
            Driver + {plurify(addHelpers, "helper", "helpers")}
          </Form.Text>
        </div>
      </Form.Group>
      {/*Additional information*/}
      {/*Floors to Carry*/}
      <Form.Group className="mb-3">
        <Dropdown className="border-0">
          <Dropdown.Toggle
            variant="outline-light"
            className="rounded-0 py-1 border-0 text-dark fw-bold d-flex justify-content-between align-items-center"
          >
            Carry floors : {carryFloors}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-0">
            {carryFloorsArray.map((_, value) => {
              return (
                <Dropdown.Item
                  className="fw-bold"
                  key={`carry-floors-${value}`}
                  onClick={(e) => {
                    setLoadPayload((_) => false);
                    setCarryFloors((_) => carryFloorsArray.length - 1 - value);
                  }}
                >
                  {plurify(
                    carryFloorsArray.length - 1 - value,
                    "Floor",
                    "Floors"
                  )}
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
      {/*Floors to Carry*/}
      {/*Payment Option*/}
      <Form.Group className="mb-3">
        <Dropdown className="border-0">
          <Dropdown.Toggle
            variant="outline-light"
            className="rounded-0 py-1 border-0 text-dark fw-bold d-flex justify-content-between align-items-center"
          >
            Payment method : {`${paymentOption}`.toLowerCase()}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-0">
            {["Cash", "Eft"].map((value, i) => (
              <Dropdown.Item
                key={i}
                id={value}
                className="fw-bold"
                onClick={(e) => {
                  console.log(e.currentTarget.id);
                  setLoadPayload((_) => false);
                  setPaymentOption(() => `${value}`.toUpperCase());
                }}
              >
                {value}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className="text-start ps-3">
          <Form.Text>
            <span className="text-danger fw-bold">Please note !</span> pay{" "}
            {`${paymentOption}`.toLowerCase()} at delivery point
          </Form.Text>
        </div>
      </Form.Group>
      {/*Payment Option*/}
      {/*Shuttle Service*/}
      {/* <Form.Group className="mb-3">
        <Dropdown className="border-0 w-100">
          <Dropdown.Toggle
            // disabled={disableShuttling}
            disabled={true}
            variant="outline-light"
            className="dropdown__shadow w-100 rounded-0 border-0 text-dark fw-bold d-flex justify-content-between align-items-center"
          >
            Shuttling : {`${SHUTTLE_SERVICE[shuttle].caption}`.toLowerCase()}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-0">
            {SHUTTLE_SERVICE.map((v, i) => {
              return (
                <Dropdown.Item
                  key={i}
                  id={v.value}
                  className="fw-bold"
                  onClick={(e) => {
                    setLoadPayload((_) => false);
                    setShuttle(e.currentTarget.id);
                    return;
                  }}
                >
                  {v.caption}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <div className="text-end">
          <Form.Text className="text-muted">Coming soon!</Form.Text>
        </div>
      </Form.Group> */}
      {/*Shuttle Service*/}
      {/*Driver Note*/}
      <Form.Group className="mb-3 px-3">
        <Form.Label className="fw-normal">Driver note</Form.Label>
        <Form.Control
          // as="textarea"   rows={4}
          required={false}
          ref={driverNoteRef}
          className="w-100 rounded-0 fw-bold"
          placeholder="Optional"
          onChange={(e) => {
            setLoadPayload((_) => false);
            setDriverNote(e.currentTarget.value);
          }}
        />
        <Form.Text>
          Leave a note for the driver, this can be any information you'd like to
          convey or any special requests.
        </Form.Text>
      </Form.Group>
      {/*Driver Note*/}
      <Card.Footer className="border-top border-3 border-light rounded-0 bg-transparent d-flex flex-row justify-content-end align-items-center">
        <ButtonGroup>
          <Button
            className="rounded-0 border-0 fw-bold"
            variant="outline-secondary"
            onClick={() => {
              setDateBorderColor((_) => "border-0 text-dark");
              context.selectPrevious(CREATE_JOB_VIEW.add_info);
            }}
          >
            Previous
          </Button>
          <Button
            className="rounded-0 border-0 fw-bold"
            variant="outline-primary"
            onClick={() => validateDateTime(startDateTime)}
          >
            Select & proceed
          </Button>
        </ButtonGroup>
      </Card.Footer>
      {/*footer*/}
    </motion.div>
  );
}
