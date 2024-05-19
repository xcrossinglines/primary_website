import React from "react";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { Link } from "react-router-dom";
import { NOTIFICATION_TYPE } from "../utils/strings";
import { NOTIFICATIONS } from "../utils/notifications";

import { ROUTE_LINKS } from "../utils/strings";
// icons
import { FcGoogle as GoogleIcon } from "react-icons/fc";

// import { AiOutlineGoogle } from "react-icons/ai";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// modals
import { TERMS_AND_CONDITIONS } from "../modals/app-modals";

// Google
import { useGoogleLogin } from "@react-oauth/google";

//import TsnCs from "../../pdf/TsnCs.pdf";
import TermsAndConditions from "../../pdf/TermsAndConditions.pdf";

// context
import {
  REQUEST_GOOGLE_SIGNIN_CONTEXT,
  JOB_NOTIFICATION_CONTEXT,
} from "../utils/contexts";
// api
import api from "../utils/api";
// import { Divider } from "../sub-components/divider";
import { JOB_NOTIFICATION_MODAL } from "../modals/job-notification-modal";
import { GET_VERIFIED_JWT_JOB } from "../utils/jwt-encode-job";
import axios from "axios";
import { Divider } from "../sub-components/divider";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

// import
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";

// exort
export default function SignIn() {
  //variable
  const reloadDocument = false;
  const navigate = useNavigate();
  // refs
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  //
  const [showJobNotification, setShowJobNotification] = React.useState(false);
  const [showGoogleSigninTsnCs, setShowGoogleSigninTsnCs] =
    React.useState(false);
  const [googleCustomerPhoneNumber, setGoogleCustomerPhoneNumber] =
    React.useState("");
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [passwordBorderColor, setPasswordBorderColor] = React.useState("");
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

  // testing
  const googleLogin = useGoogleLogin({
    onSuccess: async (r) => await getGoogleProfileInfo(r),
    onError: (e) =>
      setNotification(NOTIFICATION_TYPE.error, "Oops! error. ", `${e}`),
  });

  // get full google profile information
  const getGoogleProfileInfo = async (response) => {
    //
    setNotification(NOTIFICATION_TYPE.loading, "Fetching Info ...", "");

    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`;
    await axios
      .get(url)
      .then(async (r) => {
        // check status code
        if (r.status === 200) {
          setNotification(NOTIFICATION_TYPE.success, "Awesome.", "success");
          // sleep
          await AwaitCallBack(
            async () =>
              await signinGoogleUser({
                f_name: r.data.given_name,
                s_name: r.data.family_name,
                m_number: googleCustomerPhoneNumber,
                email: r.data.email,
                password: r.data.sub,
                customer: true,
              }),
            2000
          );
        }
      })
      .catch((e) => {
        setNotification(NOTIFICATION_TYPE.error, "Oops! error. ", `${e}`);
      });
  };

  // function to register new user
  const signinGoogleUser = async (payload) => {
    // set notification
    setNotification(NOTIFICATION_TYPE.loading, "Signing in ...", "");

    //
    const url = "accounts/api/account/signin/google/";
    await api
      .post(url, payload)
      .then(async (r) => {
        // check status
        if (r.status === 200) {
          // set notification
          setNotification(NOTIFICATION_TYPE.success, "Awesome.", "success");
          // retrieve tokens
          const signedin_tokens = {
            access: r.data.access,
            refresh: r.data.refresh[0],
          };
          // save to local storage
          saveLocalStorage(signedin_tokens);
          await AwaitCallBack(() => {
            const [verify, __] = GET_VERIFIED_JWT_JOB();
            if (verify) {
              setShowJobNotification((_) => true);
              return;
            }
            // otherwise
            window.location.href = ROUTE_LINKS.home;
          }, 2000);
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      });
  };

  // handle color change
  const handleVisibilityBorderColor = (form) => {
    // select all wrong
    const list = form.querySelectorAll(":invalid");
    for (let item of list) {
      if (passwordRef.current.id === item.id) {
        setPasswordBorderColor("danger");
        return;
      }
    }
    // otherwise
    setPasswordBorderColor("success");
  };
  // function
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
    setPasswordBorderColor((_) => "success");
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    // sigin
    await signin({
      email: `${emailRef.current.value}`.toLowerCase(),
      password: passwordRef.current.value,
    });
  };

  // save to local storage
  const saveLocalStorage = (payload) => {
    localStorage.setItem("xcrossinglines_tokens", JSON.stringify(payload));
  };

  // login
  const signin = React.useCallback(async (payload) => {
    // set notification
    setNotification(NOTIFICATION_TYPE.loading, "Signing in ...", "");

    // set url
    const url = "accounts/api/account/signin/";
    await api
      .post(url, payload)
      .then(async (r) => {
        if (r.status === 200) {
          // notify
          setNotification(NOTIFICATION_TYPE.success, "Awesome.", "Success");
          //tokens
          saveLocalStorage({
            access: r.data.access,
            refresh: r.data.refresh,
          });
          // get job
          await AwaitCallBack(() => {
            const [verify, _] = GET_VERIFIED_JWT_JOB();
            if (verify) {
              setShowJobNotification((_) => true);
              return;
            }
            // otherwise
            window.location.href = ROUTE_LINKS.home;
          }, 2000);
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      });
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [notificationType]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
          {/*Form*/}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card.Header
              as={"h3"}
              className=" pb-0 border-0 rounded-0 text-center bg-transparent"
              style={{ fontWeight: "900" }}
            >
              Sign In
            </Card.Header>
            <Card.Body>
              {/*NOTIFICATIONS*/}
              {NOTIFICATIONS(notificationType, leadingText, trailingText)}
              {/*NOTIFICATIONS*/}
              {/*CONTINUE WITH GOOGLE BUTTON*/}
              <div
                className={`mb-3 mt-${
                  notificationType === NOTIFICATION_TYPE.none ? "0" : "3"
                }`}
              >
                <Button
                  variant="light"
                  className="fw-bold w-100 rounded-0 d-flex flex-row justify-content-center align-items-center gap-2"
                  disabled={disableUI}
                  onClick={() => setShowGoogleSigninTsnCs((_) => true)}
                >
                  Continue with google
                  <GoogleIcon size={20} />
                </Button>
              </div>
              {/*CONTINUE WITH GOOGLE BUTTON*/}
              {/*DIVIDER*/}
              <div className="d-flex flex-row justify-content-center align-items-center gap-2 my-3">
                <Divider />
                <span className="text-muted px-2" style={{ fontWeight: 900 }}>
                  Or
                </span>
                <Divider />
              </div>
              {/*DIVIDER*/}
              {/*Email*/}
              <Form.Group className="my-3">
                <Form.FloatingLabel
                  label="Email"
                  className="fw-bold"
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    id="EmailFormField"
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
                  <Form.Control.Feedback>Awesome</Form.Control.Feedback>
                </Form.FloatingLabel>
              </Form.Group>
              {/*Email*/}
              {/*password*/}
              <Form.Group>
                <InputGroup className="form-outline" hasValidation={true}>
                  <Form.FloatingLabel
                    label="Password"
                    className="fw-bold "
                    style={{ color: "grey" }}
                  >
                    <Form.Control
                      id="PasswordFormControl"
                      className="rounded-0 fw-bold border-end-0 "
                      placeholder="xcrossinglines@example.co.za"
                      disabled={disableUI}
                      ref={passwordRef}
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
                    className={`rounded-0 bg-transparent border-start-0 border-${passwordBorderColor}`}
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
                  <Form.Control.Feedback type="invalid">
                    Please enter correct email address to continue
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              {/*password*/}
              {/*Forgot password*/}
              <div className="mt-3 d-flex justify-content-end align-items-center">
                {disableUI ? (
                  <span className="sign__in__links">Forgot password?</span>
                ) : (
                  <Link
                    className="sign__in__links"
                    to={ROUTE_LINKS.reset_account}
                    reloadDocument={reloadDocument}
                  >
                    Forgot password ?
                  </Link>
                )}
              </div>
              {/*Forgot password*/}
            </Card.Body>
            <Card.Footer className="bg-white pt-0 px-0 mx-3 border-0">
              {/*Divider*/}
              <Divider />
              {/*Divider*/}
              {/*sigin button*/}
              <div className="py-3" style={{ fontWeight: `${14 / 16}rem` }}>
                <span>
                  By signing in you accept our{" "}
                  <a
                    className="text-dark fw-bold"
                    href={TermsAndConditions}
                    target="_blank"
                    rel="noreferrer"
                  >
                    terms
                  </a>{" "}
                  and{" "}
                  <a
                    className="text-dark fw-bold"
                    href={TermsAndConditions}
                    target="_blank"
                    rel="noreferrer"
                  >
                    conditions
                  </a>
                </span>
              </div>
              <Button
                className="w-100 rounded-0 text-white fw-bold"
                variant="primary"
                type="submit"
                disabled={disableUI}
              >
                Submit
              </Button>
              {/*sigin button*/}
              {/*Sign up page*/}
              <Button
                className="w-100 rounded-0 border-0 bg-transparent fw-bold mt-2"
                variant="outline-primary"
                disabled={disableUI}
                onClick={() => navigate(ROUTE_LINKS.signup)}
              >
                <span className="text-muted fw-normal">or </span>
                Create an account
              </Button>
              {/*Sign up page*/}
            </Card.Footer>
          </Form>
          {/*Form*/}
        </Card>
        {/*Google Sign in Accept Terms and conditions*/}
        <REQUEST_GOOGLE_SIGNIN_CONTEXT.Provider
          value={{
            show: showGoogleSigninTsnCs,
            setShow: setShowGoogleSigninTsnCs,
            setShowGoogle: googleLogin,
            setCustomerPhonenumber: (phoneNumber) =>
              setGoogleCustomerPhoneNumber(() => phoneNumber),
          }}
        >
          <TERMS_AND_CONDITIONS />
        </REQUEST_GOOGLE_SIGNIN_CONTEXT.Provider>
        {/*Google Sign in Accept Terms and conditions*/}
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
      </Container>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.section>
  );
}
