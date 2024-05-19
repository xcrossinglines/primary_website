import React from "react";
import { Button, Card, Container, Form, FormGroup } from "react-bootstrap";
import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { EmojiRating } from "emoji-rating-component";
import { NOTIFICATION_TYPE, ROUTE_LINKS } from "../utils/strings";
import { NOTIFICATIONS } from "../utils/notifications";
import api from "../utils/api";
import { GET_USER_NAME } from "../utils/decode-jwt-user";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

//
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";

// export feedbacks
export default function FeedBack() {
  // refs
  const cNameRef = React.useRef();
  const serviceCommentryRef = React.useRef();
  const websiteCommentryRef = React.useRef();

  //variables
  const subtitleFS = 14 / 16;
  //
  const [disableCustomerName, setDisableCustomerName] = React.useState(false);
  const [disableUI, setDisableUI] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");

  // ratings
  const [serviceRating, setServiceRating] = React.useState(5);
  const [websiteRating, setWebsiteRating] = React.useState(5);

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

  // rating
  const submitFeedBack = async (payload) => {
    //setNotification
    setNotification(NOTIFICATION_TYPE.loading, "Submiting ...", "");

    // urls
    const url = "feedbacks/api/post/feedback/";
    await api
      .post(url, payload)
      .then(async (r) => {
        // check status
        if (r.status === 200) {
          setNotification(NOTIFICATION_TYPE.success, "Awesome.", r.data.msg);
          await AwaitCallBack(
            () => (window.location.href = ROUTE_LINKS.home),
            2000
          );
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      });
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

    // payload
    const payload = {
      customer_id: `${cNameRef.current.value}`,
      service_commentry: `${serviceCommentryRef.current.value}`.toLowerCase(),
      website_commentry: `${websiteCommentryRef.current.value}`.toLowerCase(),
      service_rating: serviceRating,
      website_rating: websiteRating,
    };
    submitFeedBack(payload);
  };
  // react state to scroll
  React.useEffect(() => {
    window.scrollTo(0, 0); // scroll to top
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [notificationType]);

  React.useEffect(() => {
    // verify that customer logged in
    const [isLoggedin, decodedInfo] = GET_USER_NAME();
    if (isLoggedin) {
      // customer name
      const fullName =
        `${decodedInfo.f_name}`.toUpperCase().charAt(0) +
        `${decodedInfo.f_name}`.toLowerCase().slice(1);

      const surname =
        `${decodedInfo.s_name}`.toUpperCase().charAt(0) +
        `${decodedInfo.s_name}`.toLocaleLowerCase().slice(1);

      // complete name
      const completeName = `${fullName} ${surname}`;
      // set customer name and disable the username field
      setDisableCustomerName((_) => isLoggedin);
      cNameRef.current.value = completeName;
    } else {
      setDisableCustomerName((_) => false);
    }
  }, []);

  // return section
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
            className="text-center py-2 bg-transparent border-0"
            style={{ fontWeight: "900" }}
          >
            Feed Back
          </Card.Header>
          <Card.Body>
            {/* Subtitle */}
            <Card.Subtitle
              className="mb-4"
              style={{ fontSize: `${subtitleFS}rem` }}
            >
              Dear valued customer, thank you for taking this quick but valuble
              questionair, please answer the questions below, when finished
              click submit.
            </Card.Subtitle>
            {/* Subtitle */}
            {/*NOTIFICATIONS*/}
            {NOTIFICATIONS(notificationType, leadingText, trailingText)}
            {/*NOTIFICATIONS*/}

            {/*Feed Back Form*/}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Customer Name */}
              <FormGroup className="my-3">
                <Form.FloatingLabel
                  label="Full name"
                  className="fw-bold"
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    className="rounded-0 fw-bold"
                    placeholder="Freddy Smith"
                    disabled={disableCustomerName || disableUI}
                    required={!disableCustomerName}
                    ref={cNameRef}
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your full name.
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Awesome</Form.Control.Feedback>
                </Form.FloatingLabel>
              </FormGroup>
              {/* Customer Name */}
              {/* Service Rating */}
              <FormGroup className="my-4">
                <div className="mb-2 d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Service rating </span>
                    <span>{serviceRating}</span>
                  </div>
                  <EmojiRating
                    selected={serviceRating}
                    onSelected={
                      disableUI
                        ? (__) => {}
                        : (selected) => setServiceRating((prev) => selected)
                    }
                    iconSize={30}
                  />
                </div>
                <Form.FloatingLabel
                  label="Comment on our services"
                  className="fw-bold"
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    className="rounded-0 fw-bold"
                    placeholder="Perfect service, best ive ever had"
                    disabled={disableUI}
                    required={true}
                    ref={serviceCommentryRef}
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please share your thoughts with us.
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Awesome</Form.Control.Feedback>
                </Form.FloatingLabel>
              </FormGroup>
              {/* Service Rating */}
              {/* Website Rating */}
              <FormGroup className="my-4">
                <div className="mb-2 d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Website rating </span>
                    <span>{websiteRating}</span>
                  </div>
                  <EmojiRating
                    selected={websiteRating}
                    onSelected={
                      disableUI
                        ? (__) => {}
                        : (selected) => setWebsiteRating((prev) => selected)
                    }
                    iconSize={30}
                  />
                </div>
                <Form.FloatingLabel
                  label="Comment on our website"
                  className="fw-bold"
                  style={{ color: "grey" }}
                >
                  <Form.Control
                    className="rounded-0 fw-bold"
                    placeholder="Awesome website"
                    disabled={disableUI}
                    required={true}
                    ref={websiteCommentryRef}
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please share your thoughts with us.
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Awesome</Form.Control.Feedback>
                </Form.FloatingLabel>
              </FormGroup>
              {/* Website Rating */}
              <div className="w-100 d-flex justify-content-end align-items-center">
                <Button
                  disabled={disableUI}
                  variant="outline-primary"
                  className="border-0 rounded-0 fw-bold"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
            {/*Feed Back Form*/}
          </Card.Body>
        </Card>
      </Container>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.section>
  );
}
