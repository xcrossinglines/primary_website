import React from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { NOTIFICATION_TYPE, ROUTE_LINKS } from "../utils/strings";
import { NOTIFICATIONS } from "../utils/notifications";
import { IS_LOGGED_IN } from "../utils/loggedin";

//utils
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
// profile
export default function Profile() {
  // ref
  const emailRef = React.useRef();
  const fullNameRef = React.useRef();
  const familyNameRef = React.useRef();
  const phoneNumberRef = React.useRef();

  // React
  const [userAccount, setUserAccount] = React.useState({
    email: "",
    f_name: "",
    m_number: "",
    s_name: "",
  });
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

  // verify everythong
  // const verifyAndPopulate = () => {
  //   //
  //   if (fullNameRef.current.value) {
  //     familyNameRef.current.value = familyNameRef.current.value
  //       ? familyNameRef.current.value
  //       : userAccount.s_name;

  //     phoneNumberRef.current.value = phoneNumberRef.current.value
  //       ? phoneNumberRef.current.value
  //       : userAccount.m_number;
  //   } else if (familyNameRef.current.value) {
  //     fullNameRef.current.value = fullNameRef.current.value
  //       ? fullNameRef.current.value
  //       : userAccount.f_name;
  //     phoneNumberRef.current.value = phoneNumberRef.current.value
  //       ? phoneNumberRef.current.value
  //       : userAccount.m_number;
  //   } else if (phoneNumberRef.current.value) {
  //     fullNameRef.current.value = fullNameRef.current.value
  //       ? fullNameRef.current.value
  //       : userAccount.f_name;

  //     familyNameRef.current.value = familyNameRef.current.value
  //       ? familyNameRef.current.value
  //       : userAccount.s_name;
  //   }
  // };

  const handleSubmit = async (event) => {
    //
    // verifyAndPopulate();
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

    // setpayload
    const payload = {
      f_name: fullNameRef.current.value,
      s_name: familyNameRef.current.value,
      m_number: phoneNumberRef.current.value,
    };
    await updateProfile(payload);
  };

  // const update Profile
  const updateProfile = async (payload) => {
    //
    const [verify, __] = IS_LOGGED_IN();
    if (verify) {
      //setloading
      setNotification(NOTIFICATION_TYPE.loading, "Updating Profile ...", "");

      // url
      const url = "accounts/api/account/update/";
      await api
        .put(url, payload)
        .then(async (r) => {
          setNotification(
            NOTIFICATION_TYPE.success,
            "Awesome.",
            "Update success"
          );
          // sleep
          await AwaitCallBack(() => {
            let anchor = window.document.createElement("a");
            anchor.href = ROUTE_LINKS.profile;
            anchor.target = "_self";
            anchor.click();
          }, 2000);
        })
        .catch((e) => {
          ErrorHandling(e, setNotification);
        });
    }
  };

  //fetch profile
  const fetchingProfile = React.useCallback(async () => {
    //
    const [verify, tokens] = IS_LOGGED_IN();
    if (verify) {
      //setloading
      setNotification(NOTIFICATION_TYPE.loading, "Fetching Profile ...", "");

      // url
      const url = "accounts/api/account/get/";
      await api
        .get(url)
        .then((r) => {
          //ccheck status
          if (r.status === 200) {
            //
            setNotification(NOTIFICATION_TYPE.none, "", "");
            // set payloadW
            setProfileFields(r);
            setUserAccount((_) => {
              return {
                email: r.data.email,
                f_name: r.data.f_name,
                m_number: r.data.m_number,
                s_name: r.data.s_name,
              };
            });
          }
        })
        .catch((e) => {
          ErrorHandling(e, setNotification);
        });
      return;
    }
    // otherwise
    window.location.href = ROUTE_LINKS.home;
    return;
  }, []);

  // set also fields
  const setProfileFields = (response) => {
    // response
    if (response) {
      emailRef.current.value = response.data.email;
      fullNameRef.current.value = response.data.f_name;
      familyNameRef.current.value = response.data.s_name;
      phoneNumberRef.current.value = response.data.m_number;
      return;
    }
  };

  // React useEffect
  React.useEffect(
    (_) => {
      window.scrollTo(0, 0);
      fetchingProfile();
    },
    [fetchingProfile]
  );

  // to scroll up
  React.useEffect(
    (_) => {
      window.scrollTo(0, 0);
    },
    [notificationType]
  );
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
            className="text-center pb-0 bg-transparent border-0 "
            style={{ fontWeight: "900" }}
          >
            Your profile
          </Card.Header>
          {/*Form*/}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card.Body>
              {/*NOTIFICATIONS*/}
              {NOTIFICATIONS(notificationType, leadingText, trailingText)}
              {/*NOTIFICATIONS*/}

              {/*Email*/}
              <Form.Group
                className={`mb-3 mt-${
                  notificationType === NOTIFICATION_TYPE.none ? "0" : "3"
                }`}
              >
                <Form.FloatingLabel
                  label="Email"
                  className="fw-bold"
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    ref={emailRef}
                    className="rounded-0 border-0 fw-bold"
                    type="email"
                    disabled={true}
                    readOnly={true}
                    required={false}
                    placeholder={`${userAccount.email}`}
                  />
                </Form.FloatingLabel>
                <div className="text-end">
                  <Form.Text>Contact admin.</Form.Text>
                </div>
              </Form.Group>
              {/*Email*/}
              {/*Full Name*/}
              <Form.Group className="mb-3">
                <Form.FloatingLabel
                  className="fw-bold"
                  label={`Full name: ${userAccount.f_name}`}
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    className="fw-bold rounded-0"
                    placeholder={`${userAccount.f_name}`}
                    disabled={disableUI}
                    ref={fullNameRef}
                    required={true}
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter correct full name to continue
                  </Form.Control.Feedback>
                  <Form.Control.Feedback> Awesome</Form.Control.Feedback>
                </Form.FloatingLabel>
              </Form.Group>
              {/*Full Name*/}
              {/*Family Name*/}
              <Form.Group className="mb-3">
                <Form.FloatingLabel
                  className="fw-bold"
                  label={`Family name: ${userAccount.s_name}`}
                  style={{
                    color: "grey",
                  }}
                >
                  <Form.Control
                    className="fw-bold rounded-0"
                    disabled={disableUI}
                    placeholder={`${userAccount.s_name}`}
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
              <Form.Group>
                <Form.FloatingLabel
                  className="fw-bold"
                  label={`Phone number: ${userAccount.m_number}`}
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    className="fw-bold rounded-0"
                    placeholder={`${userAccount.m_number}`}
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
            </Card.Body>
            <Card.Footer className="px-0 mx-3 pt-1 pb-3 border-0 bg-transparent d-flex flex-row justify-content-end align-items-center p-3">
              {/*Button*/}
              <Button
                disabled={disableUI}
                variant="outline-primary"
                className="rounded-0 border-0 fw-bold"
                type="submit"
              >
                Update
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
