import React from "react";
import { Card, Col, OverlayTrigger, Popover, Row } from "react-bootstrap";
// import { VerticalSpacer } from "./vertical-spacer";

// utils
import { OUR_SERVICES } from "../utils/strings";

// animation
import { motion, useAnimation, useInView } from "framer-motion";
import { SECTION_VARIANT } from "../utils/animation-variants";
//import { useScrollDirection } from "../utils/scroll-direction-hook";
import { useScrollY } from "../utils/y-scroll-offset";

// // icons
// import { IoArrowForward } from "react-icons/io5";

// export ourservices
export function OurServices() {
  // react states management
  const servicesRef = React.useRef(null);
  const sectionInView = useInView(servicesRef);
  const servicesAnimationController = useAnimation();
  // scroll direction
  const y = useScrollY();

  // style for difference card
  const borderColors = ["secondary", "primary", "danger"];

  // popover function
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

  const ServicesDescription = ({ description, caption }) => {
    // min length
    const minLength = 150;
    if (`${description}`.length > minLength) {
      return (
        <OverlayTrigger
          trigger="click"
          placement="top"
          rootClose={true}
          overlay={popOver(`${description}`, `${caption}`)}
        >
          <div>
            <Card.Text as="p" style={{ cursor: "pointer" }} className="mb-3">
              {`${description.substring(0, minLength)}... `}
              <span role="button" className="fw-bold text-primary">
                read more
              </span>
            </Card.Text>
          </div>
        </OverlayTrigger>
      );
    }
    // otherwise
    return <p style={{ fontStyle: "normal" }}>{description}</p>;
  };

  //
  React.useEffect(() => {
    // variable
    let current = servicesRef.current;
    let yHeight = y + window.innerHeight;

    // conditional operator
    if (sectionInView) servicesAnimationController.start("visible");
    else if (yHeight < current.offsetTop && !sectionInView)
      servicesAnimationController.start("hidden");
  }, [sectionInView]);

  //
  return (
    <section id="services_section" ref={servicesRef}>
      {/* <VerticalSpacer height={"20px"} /> */}
      <Card className="border-0 rounded-0 shadow-0 p-2 bg-transparent mt-4">
        <Card.Body>
          {/*Header and sub Header*/}
          <Card.Title
            as="h2"
            className="text-center mb-4"
            style={{ fontWeight: "900", lineHeight: "20px" }}
          >
            Our services
          </Card.Title>
          {/*Header and sub Header*/}
          {/*Row*/}
          <motion.div
            // ref={servicesRef}
            variants={SECTION_VARIANT}
            animate={servicesAnimationController}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Row xs={1} sm={1} md={2} lg={3}>
              {OUR_SERVICES.map((v, i) => {
                return (
                  <Col className="py-2" key={i}>
                    <Card
                      className={`dropdown__shadow text-center w-100 h-100 rounded-0 border-0 border-top border-5 border-${borderColors[i]} m-0 px-1`}
                      style={{ backgroundColor: "#fafafa" }}
                    >
                      <Card.Body className="d-flex flex-column justify-content-start align-items-center px-3 py-5">
                        <div
                          className={`border-0 p-3 mb-3 bg-${borderColors[i]} text-dark bg-opacity-10`}
                          style={{ borderRadius: "50%" }}
                        >
                          <img
                            src={v.image}
                            alt={v.caption}
                            style={{
                              width: `${40 / 16}rem`,
                              height: `${40 / 16}rem`,
                            }}
                          />
                        </div>
                        <Card.Title
                          className={`mb-2 text-${borderColors[i]}`}
                          as="h4"
                          style={{ fontWeight: "800" }}
                        >
                          {v.caption}
                        </Card.Title>
                        <ServicesDescription
                          caption={v.caption}
                          description={v.description}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </motion.div>
          {/*Row*/}
        </Card.Body>
      </Card>
    </section>
  );
}
