import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { VerticalSpacer } from "./vertical-spacer";

// import api
import api from "../utils/api";

// icons
import { BsFillPersonFill } from "react-icons/bs";
import { FaStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { DEVICE_TYPE, NOTIFICATION_TYPE } from "../utils/strings";
import { NOTIFICATIONS } from "../utils/notifications";
import { DeviceType } from "../utils/device-type";
import { ErrorHandling } from "../utils/error-handling";

// animation
import { motion, useAnimation, useInView } from "framer-motion";
import { SECTION_VARIANT } from "../utils/animation-variants";
import { useScrollY } from "../utils/y-scroll-offset";

//export testimonials
export function Testimonials() {
  // refs
  const testimonialRef = React.useRef(null);
  // animation hooks
  const sectionInView = useInView(testimonialRef);
  const tController = useAnimation();
  const y = useScrollY();
  // slides per view
  const [previous, setPrevious] = React.useState(true);
  const [next, setNext] = React.useState(false);
  const [swiper, setSwiper] = React.useState({});
  const [testimonials, setTestimonials] = React.useState([]);
  const [testimonialsLoaded, setTestimonialsLoaded] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");
  //
  const circleAvatarDimensions = 50;
  const cNameFontSize = 14;

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);
  };

  //function to fetch
  const getTestimonials = React.useCallback(async () => {
    // notify
    setNotification(NOTIFICATION_TYPE.loading, "loading...", "");
    setTestimonialsLoaded((_) => false);

    // url
    const url = "feedbacks/api/get/feedback/";
    await api
      .get(url)
      .then((r) => {
        // check status
        if (r.status === 200) {
          // notify
          setNotification(NOTIFICATION_TYPE.none, "", "");
          setTestimonials((_) => [...r.data.results]);
          setTestimonialsLoaded((_) => true);
          return;
        }
      })
      .catch((e) => {
        setTestimonialsLoaded((_) => false);
        ErrorHandling(e, setNotification);
        return;
      });
  }, []);

  const popOver = (description, caption) => {
    return (
      <Popover id="popover-basic" className="rounded-0 border-transparent">
        <Popover.Header
          as="h3"
          className="rounded-0 border-0 fw-bolder bg-secondary text-white"
        >
          {caption}
        </Popover.Header>
        <Popover.Body>{description}</Popover.Body>
      </Popover>
    );
  };

  // indaba
  const TestimonialDescription = ({ description, cName }) => {
    // min length
    const minLength = 80;
    //
    if (`${description}`.length > minLength) {
      return (
        <OverlayTrigger
          trigger="click"
          placement="top"
          rootClose={true}
          overlay={popOver(`${description}`, `${cName}`)}
        >
          <Card.Text style={{ cursor: "pointer", fontStyle: "italic" }}>
            <RiDoubleQuotesL className="mb-2 me-2 text-muted" />
            {`${description.substring(0, minLength)}... `}{" "}
            <span
              className="text-primary"
              style={{ fontWeight: "900", cursor: "pointer" }}
            >
              read more
            </span>
            <RiDoubleQuotesR className="mb-2 ms-2 text-muted" />
          </Card.Text>
        </OverlayTrigger>
      );
    }
    // otherwise
    return (
      <div>
        <p className="card-text testimonial__text">
          {" "}
          <RiDoubleQuotesL className="mb-2 me-2 text-muted" /> {description}
          <RiDoubleQuotesR className="mb-2 ms-2 text-muted" />
        </p>
      </div>
    );
  };

  // testimonial
  const testimonialCard = (key, test) => {
    //
    return (
      <SwiperSlide key={key} className="card rounded-0 h-100 border-0 bg-white">
        <div className="card-body">
          {/*Star rating*/}
          <div className="d-flex flex-row justify-content-start align-items-center gap-1 mb-2">
            {Array(6)
              .fill(0)
              .map((__, v) => (
                <FaStar
                  key={`${v}-star-rating`}
                  color={v - 1 < test.service_rating ? "#cc7722" : "grey"}
                />
              ))}
          </div>
          {/*Star rating*/}
          {/*Testimonials*/}
          <div className="mb-4" style={{ height: `${80 / 16}rem` }}>
            <TestimonialDescription
              description={test.service_commentry}
              cName={test.customer_id}
            />
          </div>
          {/*Testimonials*/}
          {/*Customer details*/}
          <div className="d-flex flex-row justify-content-end align-items-center gap-2">
            {/*names*/}
            <div className="d-flex flex-column justify-content-center align-items-end">
              <span
                className="p-0 m-0 text-dark"
                style={{
                  fontWeight: "900",
                  fontSize: `${cNameFontSize / 16}rem`,
                }}
              >
                {test.customer_id}
              </span>
              <span
                className="p-0 m-0"
                style={{ fontSize: `${(cNameFontSize - 2) / 16}rem` }}
              >
                Valued customer
              </span>
            </div>
            {/*names*/}
            {/*Imoji Icon*/}
            <div>
              <div
                className="p-0 m-0 text-white d-flex justify-content-center align-items-center bg-secondary bg-opacity-10"
                style={{
                  // backgroundColor: "rgba(39, 36, 96, 0.04)",
                  width: `${circleAvatarDimensions}px`,
                  height: `${circleAvatarDimensions}px`,
                  borderRadius: `${circleAvatarDimensions / 2}px`,
                }}
              >
                <BsFillPersonFill
                  color="var(--secondary-color)"
                  size={circleAvatarDimensions * (50 / 100)}
                />
              </div>
            </div>
            {/*Imoji Icon*/}
          </div>
          {/*Customer details*/}
        </div>
      </SwiperSlide>
    );
  };
  // load testimonials
  const loadTestimonials = (loaded, t) => {
    // check
    if (loaded && t.length > 0) {
      return t.map((v, key) => {
        return testimonialCard(key, v);
      });
    }
  };

  const setSlidesPerview = () => {
    // determine device type
    let dType = DeviceType();
    //switch case
    switch (dType) {
      case DEVICE_TYPE.mobile:
        return 1;
      case DEVICE_TYPE.tablet:
        return 2;
      default:
        return 3;
    }
  };

  //
  React.useEffect(() => {
    getTestimonials();
  }, [getTestimonials]);

  //
  React.useEffect(() => {
    // variables
    let c = testimonialRef.current;
    let yHeight = y + window.innerHeight;

    // condition
    if (sectionInView) tController.start("visible");
    else if (yHeight < c.offsetTop && !sectionInView)
      tController.start("hidden");
    //
  }, [sectionInView]);

  //
  return (
    <section id="testimonial_section" ref={testimonialRef}>
      <Card className="border-0 rounded-0 shadow-0 bg-transparent pb-4">
        <Card.Body className="px-3">
          {/*Header and sub Header*/}
          <Card.Title
            as="h2"
            className="text-center mb-3"
            style={{ fontWeight: "800" }}
          >
            Testimonials
          </Card.Title>

          {/*Header and sub Header*/}
          {/*NOTIFICATIONS*/}
          {NOTIFICATIONS(notificationType, leadingText, trailingText)}
          {/*NOTIFICATIONS*/}
          {/*Swipper*/}
          <motion.div
            animate={tController}
            variants={SECTION_VARIANT}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Swiper
              className="py-2 px-2"
              onInit={(ev) => setSwiper(ev)}
              spaceBetween={10}
              slidesPerView={setSlidesPerview()}
              onSlideChange={(s) => {
                setPrevious((_) => s.isBeginning);
                setNext((_) => s.isEnd);
              }}
            >
              {loadTestimonials(testimonialsLoaded, testimonials)}
            </Swiper>
          </motion.div>
          {/*Swipper*/}
        </Card.Body>
        <Card.Footer className="py-0 bg-transparent border-0 d-flex flex-row justify-content-end">
          <ButtonGroup>
            <Button
              disabled={previous}
              variant="outline-primary"
              className="rounded-0 border-0"
              onClick={() => swiper.slidePrev()}
            >
              <div>
                <FaChevronLeft size={25} color={previous ? "grey" : ""} />
              </div>
            </Button>
            <Button
              disabled={next}
              variant="outline-primary"
              className="rounded-0 border-0"
              onClick={() => swiper.slideNext()}
            >
              <div>
                <FaChevronRight size={25} color={next ? "grey" : ""} />
              </div>
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
      <VerticalSpacer height={"100px"} />
    </section>
  );
}
