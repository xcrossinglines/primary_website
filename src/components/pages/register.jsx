import React from "react";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router";

import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { NOTIFICATION_TYPE } from "../utils/strings";
import { NOTIFICATIONS } from "../utils/notifications";

// context
import { REQUEST_SIGNIN_MODAL } from "../modals/app-modals";
import {
  JOB_NOTIFICATION_CONTEXT,
  REQUEST_SIGNIN_CONTEXT,
} from "../utils/contexts";

// icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
//
import api from "../utils/api";
import { ROUTE_LINKS } from "../utils/strings";

// pdf
import TermsAndConditions from "../../pdf/TermsAndConditions.pdf";
import { JOB_NOTIFICATION_MODAL } from "../modals/job-notification-modal";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";
import { Divider } from "../sub-components/divider";
//
// export
export default function Register() {
  //navigator
  const navigate = useNavigate();
  // refs
  const emailRef = React.useRef();
  const fullNameRef = React.useRef();
  const familyNameRef = React.useRef();
  const phoneNumberRef = React.useRef();
  const passwordRef = React.useRef();
  const tsAndCsRef = React.useRef();

  // variable
  // const reloadDocument = false;
  const [termsAndConditionColor, setTermsAndConditionColor] =
    React.useState("dark");
  const [siginCredentials, setSigninCredentials] = React.useState({
    email: "",
    password: "",
  });
  const [showJobNotification, setShowJobNotification] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [passwordBorderColor, setPasswordBorderColor] = React.useState("");
  const [showSigninModal, setShowSigninModal] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
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
    setPasswordBorderColor((_) => (disable ? "" : "success"));
  };
  //
  // handle color change
  const handleVisibilityBorderColor = (form) => {
    // select all wrong
    // variable
    let passwordBorderChanged = false;
    let termsAndConditionsColorChanged = false;
    //
    const list = form.querySelectorAll(":invalid");
    for (let item of list) {
      if (passwordRef.current.id === item.id) {
        setPasswordBorderColor("danger");
        passwordBorderChanged = true;
      } else if (tsAndCsRef.current.id === item.id) {
        setTermsAndConditionColor("danger");
        termsAndConditionsColorChanged = true;
      }
    }
    // evaludate
    if (!passwordBorderChanged) setPasswordBorderColor((_) => "success");
    if (!termsAndConditionsColorChanged)
      setTermsAndConditionColor((_) => "success");
  };
  //
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      handleVisibilityBorderColor(form);
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // once everything is cools
    setPasswordBorderColor((_) => "success");
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    //
    const payload = {
      email: `${emailRef.current.value}`.toLowerCase(),
      f_name: fullNameRef.current.value,
      s_name: familyNameRef.current.value,
      m_number: phoneNumberRef.current.value,
      password: passwordRef.current.value,
      customer: true,
      driver: false,
      is_staff: false,
    };
    //
    await signup(payload);
  };

  // signup
  const signup = React.useCallback(async (payload) => {
    //
    setNotification(NOTIFICATION_TYPE.loading, "Registering ...", "");

    //
    const url = "accounts/api/account/signup/";
    await api
      .post(url, payload)
      .then(async (r) => {
        //check status
        if (r.status === 201) {
          setNotification(NOTIFICATION_TYPE.success, "Awesome.", "Success");
          await AwaitCallBack(() => {
            setSigninCredentials((_) => payload);
            setShowSigninModal((_) => true);
          }, 2000);
        }
      })
      .catch((e) => ErrorHandling(e, setNotification));
  }, []);

  //
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [notificationType]);
  //
  return (
    <motion.section
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
            className="pb-0 border-0 rounded-0 text-center bg-transparent"
            style={{ fontWeight: "900" }}
          >
            Register
          </Card.Header>
          {/*Form*/}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card.Body>
              {/*NOTIFICATIONS*/}
              {NOTIFICATIONS(notificationType, leadingText, trailingText)}
              {/*NOTIFICATIONS*/}

              {/*email*/}
              <Form.Group
                className={`mb-3 mt-${
                  notificationType === NOTIFICATION_TYPE.none ? "0" : "3"
                }`}
              >
                {/* <Form.Label>Email</Form.Label> */}
                <Form.FloatingLabel
                  label="Email"
                  className="fw-bold"
                  style={{
                    color: "grey",
                  }}
                >
                  <Form.Control
                    className="rounded-0 fw-bold"
                    placeholder="xcrossinglines@example.co.za"
                    disabled={disableUI}
                    required={true}
                    ref={emailRef}
                    type="email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter correct email address to continue
                  </Form.Control.Feedback>
                  <Form.Control.Feedback> Awesome </Form.Control.Feedback>
                </Form.FloatingLabel>
              </Form.Group>
              {/*email*/}
              {/*Password*/}
              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.FloatingLabel
                    label="Password"
                    className="fw-bold"
                    style={{ color: "grey" }}
                  >
                    <Form.Control
                      id="PasswordFormControl"
                      className="fw-bold rounded-0 border-end-0"
                      placeholder="Enter password"
                      disabled={disableUI}
                      ref={passwordRef}
                      minLength={6}
                      maxLength={18}
                      required={true}
                      type={isPasswordVisible ? "text" : "password"}
                      onChange={(r) => {
                        const fieldValidity = r.currentTarget.checkValidity();
                        if (validated)
                          setPasswordBorderColor((_) =>
                            fieldValidity ? "success" : "danger"
                          );
                      }}
                    />
                  </Form.FloatingLabel>
                  <InputGroup.Text
                    className={`bg-transparent rounded-0 border-start-0 border-${passwordBorderColor}`}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    <div>
                      {isPasswordVisible ? (
                        <AiOutlineEye size={22} color="var(--primary-color)" />
                      ) : (
                        <AiOutlineEyeInvisible
                          size={22}
                          color="var(--primary-color)"
                        />
                      )}
                    </div>
                  </InputGroup.Text>
                </InputGroup>
                <Form.Text>
                  Password entered must atleast be 6 characters long
                </Form.Text>
              </Form.Group>
              {/*Password*/}
              {/*Full Name*/}
              <Form.Group className="mb-3">
                {/* <Form.Label>Full name</Form.Label> */}
                <Form.FloatingLabel
                  label="Full name"
                  className="fw-bold"
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    className="fw-bold rounded-0"
                    placeholder="Freddy"
                    disabled={disableUI}
                    ref={fullNameRef}
                    required={true}
                    type="text"
                  />

                  <Form.Control.Feedback type="invalid">
                    Please enter correct full name to continue
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Awesome</Form.Control.Feedback>
                </Form.FloatingLabel>
              </Form.Group>
              {/*Full Name*/}
              {/*Family Name*/}
              <Form.Group className="mb-3">
                {/* <Form.Label>Family name</Form.Label> */}
                <Form.FloatingLabel
                  label="Family name"
                  className="fw-bold"
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    className="fw-bold rounded-0"
                    disabled={disableUI}
                    placeholder="Smith"
                    ref={familyNameRef}
                    required={true}
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter correct family name to continue
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Awesome</Form.Control.Feedback>
                </Form.FloatingLabel>
              </Form.Group>
              {/*Family Name*/}
              {/*Phone Number*/}
              <Form.Group className="mb-3">
                <Form.FloatingLabel
                  label="Phone number"
                  className="fw-bold"
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    className="fw-bold rounded-0"
                    placeholder="084 000 0000"
                    disabled={disableUI}
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
              {/*Phone Number*/}
              {/*Accept Our Terms and conditions*/}
              <Form.Group className="mt-3">
                <Form.Check
                  required={true}
                  type="checkbox"
                  disabled={disableUI}
                >
                  <Form.Check.Input
                    id="TermsAndCondition"
                    type="checkbox"
                    required={true}
                    ref={tsAndCsRef}
                    disabled={disableUI}
                    onChange={(e) => {
                      if (validated && e.target.checked)
                        setTermsAndConditionColor((_) => "success");
                      else if (validated && !e.target.checked)
                        setTermsAndConditionColor((_) => "danger");
                    }}
                  />
                  <Form.Check.Label>
                    Accept our{" "}
                    <a
                      href={TermsAndConditions}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-${termsAndConditionColor} fw-bold`}
                    >
                      terms
                    </a>{" "}
                    and{" "}
                    <a
                      href={TermsAndConditions}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-${termsAndConditionColor} fw-bold`}
                    >
                      conditions
                    </a>
                  </Form.Check.Label>
                  <Form.Control.Feedback type="invalid">
                    Please accept our terms and conditions to continue with
                    registration
                  </Form.Control.Feedback>
                </Form.Check>
              </Form.Group>
              {/*Accept Our Terms and conditions*/}
            </Card.Body>

            {/*Footer*/}
            <Card.Footer className="p-0 pb-3 mx-3 bg-white border-0">
              {/*Divider*/}
              <div className="pb-3">
                <Divider />
              </div>
              {/*Divider*/}
              {/*button*/}
              <Button
                className="rounded-0 w-100 text-white fw-bold"
                disabled={disableUI}
                variant="primary"
                type="submit"
              >
                Submit
              </Button>
              {/*button*/}
              {/*Navigate to Signin page*/}

              <Button
                disabled={disableUI}
                variant="outline-primary"
                className="w-100 border-0 rounded-0 mt-2 fw-bold bg-transparent"
                onClick={() => navigate(ROUTE_LINKS.signin)}
              >
                <span className="text-muted fw-normal">Have an account ? </span>
                Sign in
              </Button>
              {/*Navigate to Signin page*/}
            </Card.Footer>
            {/*Footer*/}
          </Form>
          {/*Form*/}
        </Card>
        {/*Job Notification Modal*/}
        <JOB_NOTIFICATION_CONTEXT.Provider
          value={{
            show: showJobNotification,
            setShow: setShowJobNotification,
          }}
        >
          <JOB_NOTIFICATION_MODAL />
        </JOB_NOTIFICATION_CONTEXT.Provider>
        {/*Job Notification Modal*/}
        {/*Request Customer Sigin Modal*/}
        <REQUEST_SIGNIN_CONTEXT.Provider
          value={{
            show: showSigninModal,
            setShow: setShowSigninModal,
            setShowJobNotification: setShowJobNotification,
            payload: siginCredentials,
          }}
        >
          <REQUEST_SIGNIN_MODAL />
        </REQUEST_SIGNIN_CONTEXT.Provider>
        {/*Request Customer Sigin Modal*/}
      </Container>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.section>
  );
}
