import React from "react";

import { Button, Form, Modal } from "react-bootstrap";
import { NOTIFICATION_TYPE, ROUTE_LINKS } from "../utils/strings";
import api from "../utils/api";
import { NOTIFICATIONS } from "../utils/notifications";

// context
import { REQUEST_SIGNIN_CONTEXT } from "../utils/contexts";
import { REQUEST_GOOGLE_SIGNIN_CONTEXT } from "../utils/contexts";

// pdf
import TermsAndConditions from "../../pdf/TermsAndConditions.pdf";
import { GET_VERIFIED_JWT_JOB } from "../utils/jwt-encode-job";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

// Request Sign in Modal
export function REQUEST_SIGNIN_MODAL() {
  // use context
  const context = React.useContext(REQUEST_SIGNIN_CONTEXT);

  const [validated, setValidated] = React.useState(false);
  const [disableUI, setDisableUI] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.info
  );
  const [leadingText, setLeadingText] = React.useState("Thank you!");
  const [trailingText, setTrailingText] = React.useState(
    "for registering with xcrossing lines, please procceed to signin"
  );

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

  // function
  const handleSubmit = async (event) => {
    //
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // once everything is cools
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    // sigin
    await signin(context.payload);
  };

  // save to local storage
  const saveToLocalStorage = (payload) =>
    localStorage.setItem("xcrossinglines_tokens", JSON.stringify(payload));

  //setShowJobNotification
  // login
  const signin = async (payload) => {
    // set notification
    setNotification(NOTIFICATION_TYPE.loading, "Signing In ...", "");

    // set url
    const url = "accounts/api/account/signin/";
    await api
      .post(url, payload)
      .then(async (r) => {
        if (r.status === 200) {
          // notify
          setNotification(
            NOTIFICATION_TYPE.success,
            "Awesome.",
            "Signin success"
          );

          //tokens
          const xcrossinglines_tokens = {
            access: r.data.access,
            refresh: r.data.refresh,
          };

          // save to local storage
          saveToLocalStorage(xcrossinglines_tokens);
          // save
          await AwaitCallBack(() => context.setShow((_) => false), 2000);
          const [verify, _] = GET_VERIFIED_JWT_JOB();
          if (verify) {
            await AwaitCallBack(() =>
              context.setShowJobNotification((_) => true)
            );
            return;
          }
          await AwaitCallBack(() => (window.location.href = ROUTE_LINKS.home));
          return;
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      });
  };

  //return
  return (
    <Modal
      centered={true}
      show={context.show}
      onHide={
        disableUI
          ? null
          : () => {
              setNotification(NOTIFICATION_TYPE.none, "", "");
              context.setShow((_) => false);
            }
      }
      contentClassName="rounded-0"
    >
      <Modal.Header
        className="rounded-0 bg-white text-dark border-0"
        closeButton={true}
      >
        <Modal.Title style={{ fontWeight: "900" }}>Continue Signin</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {/*NOTIFICATION*/}
          {NOTIFICATIONS(notificationType, leadingText, trailingText)}
          {/*NOTIFICATION*/}
          {/*Email*/}
          <Form.Group className="mb-3">
            <Form.FloatingLabel label="Email">
              <Form.Control
                className="rounded-0 fw-bold"
                placeholder="xcrossinglines@example.co.za"
                disabled={disableUI}
                required={true}
                onChange={(value) => {}}
                value={context.payload.email}
                type="email"
              />
              <Form.Control.Feedback type="invalid">
                Please enter correct email address to continue
              </Form.Control.Feedback>
            </Form.FloatingLabel>
          </Form.Group>
          {/*Email*/}
          {/*password*/}
          <Form.Group className="my-3">
            <Form.FloatingLabel label="Password">
              <Form.Control
                className="rounded-0 fw-bold"
                placeholder="Enter Password"
                value={context.payload.password}
                onChange={(value) => {}}
                disabled={disableUI}
                required={true}
                type="password"
              />
              <Form.Control.Feedback type="invalid">
                Please enter correct password to continue
              </Form.Control.Feedback>
            </Form.FloatingLabel>
          </Form.Group>
          {/*password*/}
        </Modal.Body>
        <Modal.Footer className="rounded-0 border-0">
          <Button
            type="submit"
            variant="outline-primary"
            className="rounded-0 border-0"
            style={{ fontWeight: "800" }}
            disabled={disableUI}
          >
            Sign In
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

// Accept Terms and conditions modal
export function TERMS_AND_CONDITIONS() {
  // customer phone numner
  const phoneNumberRef = React.useRef();
  const tsAndCsRef = React.useRef();
  //
  const context = React.useContext(REQUEST_GOOGLE_SIGNIN_CONTEXT);
  //
  const [termsAndConditionsColor, setTermsAndConditionsColor] =
    React.useState("dark");
  const [validated, setValidated] = React.useState(false);

  //handleVisibilityBorderColor
  const handleVisibilityBorderColor = (form) => {
    let termsAndConditionsColorChanged = false;
    const list = form.querySelectorAll(":invalid");
    //
    for (let item of list) {
      if (tsAndCsRef.current.id === item.id) {
        termsAndConditionsColorChanged = true;
        setTermsAndConditionsColor((_) => "danger");
      }
    }
    // otherwise
    if (!termsAndConditionsColorChanged)
      setTermsAndConditionsColor((_) => "success");
  };
  //
  const handleSubmit = async (event) => {
    //
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      handleVisibilityBorderColor(form);
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // once everything is cools
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    // google
    context.setShow((_) => false);
    context.setCustomerPhonenumber(phoneNumberRef.current.value);
    AwaitCallBack(() => {
      // phoneNumberRef
      setValidated((_) => false);
      context.setShowGoogle();
    }, 2000);
  };
  return (
    <Modal
      centered={true}
      show={context.show}
      contentClassName="rounded-0 border-0"
    >
      <Modal.Header
        closeButton={true}
        className="rounded-0 bg-white border-0 text-dark pb-0"
        onHide={() => {
          setValidated((_) => false);
          context.setShow((_) => false);
          setTermsAndConditionsColor((_) => "dark");
        }}
      >
        <Modal.Title style={{ fontWeight: "900" }}>
          <span className="text-danger">Google</span> Signin
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Customer phone number  */}
          <Form.Group className="mb-3">
            <Form.FloatingLabel
              label="Phone number"
              className="fw-bold"
              style={{ color: "grey" }}
            >
              <Form.Control
                className="fw-bold rounded-0"
                placeholder="084 000 0000"
                ref={phoneNumberRef}
                required={true}
                maxLength={10}
                minLength={10}
                type="tel"
              />
              <Form.Control.Feedback type="invalid">
                Please enter correct phone number to continue
              </Form.Control.Feedback>
              <Form.Control.Feedback>Awesome</Form.Control.Feedback>
            </Form.FloatingLabel>
          </Form.Group>
          {/* Customer phone number  */}
          {/*Accept Our Terms and Conditions*/}
          <Form.Group>
            <Form.Check
              required={true}
              type="checkbox"
              id="terms-and-conditions"
            >
              <Form.Check.Input
                id="GoogleTermsAndConditions"
                type="checkbox"
                required={true}
                ref={tsAndCsRef}
                onChange={(e) => {
                  if (validated && e.target.checked)
                    setTermsAndConditionsColor((_) => "success");
                  else if (validated && !e.target.checked)
                    setTermsAndConditionsColor((_) => "danger");
                }}
              />
              <Form.Check.Label>
                Accept our{" "}
                <a
                  href={TermsAndConditions}
                  className={`text-${termsAndConditionsColor} fw-bold`}
                  target="_blank"
                  rel="noreferrer"
                >
                  terms
                </a>{" "}
                and{" "}
                <a
                  className={`text-${termsAndConditionsColor} fw-bold`}
                  href={TermsAndConditions}
                  target="_blank"
                  rel="noreferrer"
                >
                  conditions
                </a>
              </Form.Check.Label>
              <Form.Control.Feedback type="invalid">
                Please accept our terms and conditions to continue with Google
                Sign In
              </Form.Control.Feedback>
            </Form.Check>
          </Form.Group>
          {/*Accept Our Terms and Conditions*/}
          {/*button*/}
          <div className="w-100 d-flex justify-content-end align-items-center my-2">
            <Button
              variant="outline-primary"
              className="rounded-0 fw-bold border-0 align-end"
              type="submit"
            >
              Proceed
            </Button>
          </div>
          {/*button*/}
        </Modal.Body>
      </Form>
    </Modal>
  );
}
