import React from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { VerticalSpacer } from "../sub-components/vertical-spacer";

import { NOTIFICATION_TYPE } from "../utils/strings";
import api from "../utils/api";
import { NOTIFICATIONS } from "../utils/notifications";
import { ErrorHandling } from "../utils/error-handling";

//
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";

// export
export default function ResetAccount() {
  // ref
  const emailRef = React.useRef();
  //
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
  };
  //
  // function
  const handleSubmit = async (event) => {
    //
    window.scrollTo(0, 0);
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

    //
    await accountReset({
      email: emailRef.current.value,
    });
  };

  //
  const accountReset = React.useCallback(async (payload) => {
    // notify
    setNotification(NOTIFICATION_TYPE.loading, "Resetting ...", "");

    // url link
    const url = "accounts/api/account/password/reset/";
    await api
      .post(url, payload)
      .then((r) => {
        //
        if (r.status === 200) {
          setNotification(
            NOTIFICATION_TYPE.success,
            "Awesome.",
            "Success, a password reset link has been sent to your email, access to reset password."
          );
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      })
      .finally(() => {
        return;
      });
    //
  }, []);

  // react
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [accountReset]);

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
        <Card className="dropdown__shadow card__section border-0 rounded-0 ">
          {/*Form*/}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card.Header
              as="h3"
              className="text-center pb-0 border-0 bg-transparent"
              style={{ fontWeight: "900" }}
            >
              Recover Account
            </Card.Header>
            <Card.Body>
              {/*NOTIFICATIONS*/}
              {NOTIFICATIONS(notificationType, leadingText, trailingText)}
              {/*NOTIFICATIONS*/}

              {/*Email*/}
              <Form.Group
                className={`mb-2 mt-${
                  notificationType === NOTIFICATION_TYPE.none ? "0" : "3"
                }`}
              >
                <Form.FloatingLabel
                  label="Recovery email"
                  className="fw-bold"
                  style={{
                    color: "grey",
                  }}
                >
                  <Form.Control
                    placeholder="xcrossinglines@example.co.za"
                    className="rounded-0 fw-bold"
                    disabled={disableUI}
                    required={true}
                    ref={emailRef}
                    type="email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter correct recovery email address to continue.
                  </Form.Control.Feedback>
                </Form.FloatingLabel>
              </Form.Group>
              {/*Email*/}
            </Card.Body>
            <Card.Footer className="bg-white border-0 pt-0 pb-3">
              {/*Button*/}
              <Button
                variant="primary"
                className="w-100 text-white border-0 rounded-0 fw-bold border-0"
                disabled={disableUI}
                type="submit"
              >
                Submit
              </Button>
              {/*Button*/}
            </Card.Footer>
          </Form>
          {/*Form*/}
        </Card>
      </Container>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.section>
  );
}
