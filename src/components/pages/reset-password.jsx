import React from "react";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { useParams } from "react-router";

// utils
import { NOTIFICATION_TYPE, ROUTE_LINKS } from "../utils/strings";
import { NOTIFICATIONS } from "../utils/notifications";

// icons
import api from "../utils/api";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

// import
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";

// export
export default function ResetPassword() {
  //
  const { token } = useParams();
  // ref
  const passwordRef = React.useRef();
  const reEnterPassword = React.useRef();
  //

  const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  const [disableUI, setDisableUI] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
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

  // password match witdget
  const PasswordMatch = ({ password_match }) => {
    // check if password matchs
    if (!password_match)
      return (
        <Form.Text className="fw-bold text-danger">
          Oops! passwords do not match
        </Form.Text>
      );
    // otherwise
    return <></>;
  };

  //
  const verifyPasswordMatch = async (passwordOne, passwordTwo, callback) => {
    return new Promise(async (resolve, reject) => {
      if (`${passwordOne}` === `${passwordTwo}`) resolve("Passwords match");
      reject("Passwords do not match");
    })
      .then(async (r) => {
        setPasswordsMatch(() => true);
        await callback();
      })
      .catch((e) => {
        setNotification(NOTIFICATION_TYPE.none, "", "");
        setPasswordsMatch(() => false);
      });
  };

  // function
  const handleSubmit = async (event) => {
    // verify
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
    await verifyPasswordMatch(
      passwordRef.current.value,
      reEnterPassword.current.value,
      async () => {
        //accounts/api/account/password/reset/confirm/
        await resetPassword({
          token: token,
          password: passwordRef.current.value,
        });
      }
    );
  };

  //
  const resetPassword = React.useCallback(async (payload) => {
    // notify
    setNotification(NOTIFICATION_TYPE.loading, "Resetting Password ...", "");

    // url
    const url = "accounts/api/account/password/reset/confirm/";
    await api
      .post(url, payload)
      .then(async (r) => {
        // check status
        if (r.status === 200) {
          setNotification(
            NOTIFICATION_TYPE.success,
            "Awesome.",
            "Password successfully reset"
          );

          // sleep
          await AwaitCallBack(
            () => (window.location.href = ROUTE_LINKS.signin),
            2000
          );
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      });
  }, []);

  //
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [resetPassword]);

  // return
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
        <Card className="dropdown__shadow card__section border-0 rounded-0 ">
          {/*Form*/}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card.Header
              as="h3"
              className="text-center pb-0 bg-transparent border-0"
              style={{ fontWeight: "900" }}
            >
              Reset Password
            </Card.Header>
            <Card.Body>
              {/*NOTIFICATIONS*/}
              {NOTIFICATIONS(notificationType, leadingText, trailingText)}
              {/*NOTIFICATIONS*/}

              {/*New Password*/}
              <Form.Group
                className={`mb-2 mt-${
                  notificationType === NOTIFICATION_TYPE.none ? "0" : "3"
                }`}
              >
                <InputGroup>
                  <Form.FloatingLabel
                    label="New password"
                    className="fw-bold "
                    style={{ color: "grey" }}
                  >
                    <Form.Control
                      type="password"
                      required={true}
                      ref={passwordRef}
                      minLength={6}
                      maxLength={18}
                      disabled={disableUI}
                      className="rounded-0 fw-bold"
                      placeholder="New password"
                    />

                    <Form.Control.Feedback type="invalid">
                      Please enter correct new password.
                    </Form.Control.Feedback>
                    <PasswordMatch password_match={passwordsMatch} />
                  </Form.FloatingLabel>
                </InputGroup>
              </Form.Group>
              {/*New Password*/}
              {/*Re-enter new password*/}
              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.FloatingLabel
                    label="Re-enter new password"
                    className="fw-bold "
                    style={{ color: "grey" }}
                  >
                    <Form.Control
                      type="password"
                      required={true}
                      ref={reEnterPassword}
                      minLength={6}
                      maxLength={18}
                      disabled={disableUI}
                      className="rounded-0 fw-bold"
                      placeholder="Re-enter new password"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter correct re-enter password.
                    </Form.Control.Feedback>
                    <PasswordMatch password_match={passwordsMatch} />
                  </Form.FloatingLabel>
                </InputGroup>
              </Form.Group>
              {/*Re-enter new password*/}
            </Card.Body>
            <Card.Footer className="bg-white border-0 pt-0 pb-3">
              <Button
                variant="primary"
                disabled={disableUI}
                className="w-100 text-white border-0 rounded-0 border-0 fw-bold"
                type="submit"
              >
                Reset password
              </Button>
            </Card.Footer>
          </Form>
          {/*Form*/}
        </Card>
      </Container>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.section>
  );
}
