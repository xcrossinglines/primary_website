import React from "react";
import { Card, Container } from "react-bootstrap";
import { NOTIFICATION_TYPE } from "../utils/strings";
import api from "../utils/api";
import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { NOTIFICATIONS } from "../utils/notifications";
import { ErrorHandling } from "../utils/error-handling";

// motion
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";

// faqs
export default function FAQ() {
  //
  const [faqs, setFaqs] = React.useState([]);
  const [faqsLoaded, setFaqsLoaded] = React.useState(false);
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
  };
  // item
  const questionAndAnswerItem = (question, answer, key) => {
    return (
      <li key={key}>
        <div className="d-flex flex-column justify-content-start align-items-start gap-2">
          <div className="d-flex flex-row gap-2">
            <span style={{ fontWeight: "900" }}>{"Q:"}</span>
            <span className="ms-2" style={{ fontWeight: "800" }}>
              {question} ?
            </span>
          </div>
          <div
            className="d-flex flex-row gap-2"
            style={{ fontSize: `${14 / 16}rem` }}
          >
            <span style={{ fontWeight: "900" }}>{"A:"}</span>
            <span className="ms-2">{answer}</span>
          </div>
        </div>
      </li>
    );
  };

  // const
  const loadedSuccess = (loaded) => {
    if (loaded) {
      if (faqs.length <= 0) {
        return <div className="p">No Frequently asked questions</div>;
      }

      return faqs.map((v, i) => questionAndAnswerItem(v.question, v.answer, i));
    }
  };

  // fetchFAQs
  const fetchFAQs = React.useCallback(async () => {
    // set notification
    setNotification(NOTIFICATION_TYPE.loading, "Fetching FAQs ...", "");
    setFaqsLoaded((_) => false);

    // url
    const url = "fqa/api/get";
    await api
      .get(url)
      .then((r) => {
        //check status
        if (r.status === 200) {
          // set notification
          setNotification(NOTIFICATION_TYPE.none, "", "");
          setFaqs((_) => [...r.data]);
          setFaqsLoaded((_) => true);
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      });

    return;
  }, []);

  //
  React.useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  //
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
          <Card.Header
            as="h3"
            className="py-2 text-center bg-transparent border-0"
            style={{ fontWeight: "900" }}
          >
            FAQ's
          </Card.Header>
          <Card.Body>
            {/*NOTIFICATIONS*/}
            {NOTIFICATIONS(notificationType, leadingText, trailingText)}
            {/*NOTIFICATIONS*/}
            {/*list*/}
            <ul className="d-flex flex-column justify-content-start align-items-start gap-4 px-3">
              {loadedSuccess(faqsLoaded)}
            </ul>
            {/*list*/}
          </Card.Body>
        </Card>
      </Container>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.section>
  );
}
