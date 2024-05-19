import React from "react";
import {
  ABOUTUS,
  COVERAGE_TEXT,
  OUR_SERVICES,
  PRIVACY_POLICY,
  ROUTE_LINKS,
  EMAIL,
  LOCATION,
} from "../utils/strings";

// import { SiLinkedin } from "react-icons/si";
import { FaFacebook } from "react-icons/fa";

// import { RiWhatsappFill } from "react-icons/ri";
import { AiOutlinePhone } from "react-icons/ai";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";

// import pdf
import TermsAndConditions from "../../pdf/TermsAndConditions.pdf";
import { Container, OverlayTrigger, Popover } from "react-bootstrap";
import { CONTACTUS_ITEM } from "./contactus-item";
import { AnimatedButton } from "./animated-button";

// footer
export function Footer() {
  // remove
  const subHeadingFS = 15;
  const ourservices = [
    "Furniture removal",
    "Purchased deliveries",
    "Household refuse",
  ];
  const [showMore, setShowMore] = React.useState(false);

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
  // popover function
  const aboutUsPopOver = (description, caption) => {
    return (
      <Popover id="popover-basic" className="rounded-0 border-transparent">
        <Popover.Header
          as="h3"
          className="rounded-0 border-0 fw-bolder bg-secondary text-white"
        >
          {caption}
        </Popover.Header>
        <Popover.Body>
          <span className="text-muted" style={{ fontWeight: "900" }}>
            Xcrossing Lines{" "}
          </span>
          {showMore
            ? `${description} `
            : `${description.substring(0, 300)}... `}
          <span
            className="text-primary"
            onClick={() => setShowMore((prev) => !prev)}
            style={{
              cursor: "pointer",
              fontWeight: "900",
            }}
          >
            {showMore ? "show less" : "show more"}
          </span>
        </Popover.Body>
      </Popover>
    );
  };
  //
  const contactUsPopOver = () => {
    return (
      <Popover id="popover-basic" className="rounded-0 border-transparent">
        <Popover.Header
          as="h3"
          className="rounded-0 border-0 fw-bolder bg-secondary text-white"
        >
          Contact us
        </Popover.Header>
        <Popover.Body className="d-flex flex-column flex-wrap justify-content-start align-items-start gap-3">
          {/*Email*/}
          <CONTACTUS_ITEM icon={<HiOutlineMail size={20} />} item={[EMAIL]} />
          {/*Email*/}
          {/*Location*/}
          <CONTACTUS_ITEM
            icon={<HiOutlineLocationMarker size={20} color="red" />}
            item={[LOCATION]}
          />
          {/*Location*/}
          {/*Contact numbers*/}
          <CONTACTUS_ITEM
            icon={<AiOutlinePhone size={20} />}
            item={["(+27) 72 516 7658 or", "(+27) 81 816 6146"]}
          />
          {/*Contact numbers*/}
        </Popover.Body>
      </Popover>
    );
  };

  return (
    <section>
      <footer>
        <Container className="bg-secondary p-4 text-white text-center">
          {/*Sections*/}
          <div className="d-flex flex-row justify-content-md-between align-items-start gap-4 flex-wrap">
            {/*Our Services*/}
            <div className="d-flex flex-column justify-content-start align-items-start text-start gap-1">
              <span className="text-white" style={{ fontWeight: "900" }}>
                OUR SERVICES
              </span>
              {OUR_SERVICES.map((value, k) => {
                return (
                  <AnimatedButton key={`${k}-item`}>
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      rootClose={true}
                      overlay={popOver(
                        `${value.description}`,
                        `${value.caption}`
                      )}
                    >
                      <span
                        className="text-white"
                        style={{
                          fontSize: `${subHeadingFS / 16}rem`,
                          cursor: "pointer",
                        }}
                      >
                        {ourservices[k]}
                      </span>
                    </OverlayTrigger>
                  </AnimatedButton>
                );
              })}
            </div>
            {/*Our Services*/}
            {/*About Us*/}
            <div className="d-flex flex-column justify-content-start align-items-start text-start gap-1">
              <span className="text-white" style={{ fontWeight: "900" }}>
                ABOUT US
              </span>
              <AnimatedButton>
                <OverlayTrigger
                  trigger="click"
                  placement="top"
                  rootClose={true}
                  overlay={aboutUsPopOver(`${ABOUTUS}`, `ABOUT US`)}
                >
                  <span
                    className="text-white"
                    style={{
                      fontSize: `${subHeadingFS / 16}rem`,
                      cursor: "pointer",
                    }}
                  >
                    About us
                  </span>
                </OverlayTrigger>
              </AnimatedButton>
              {/*Contact us*/}
              <AnimatedButton>
                <OverlayTrigger
                  trigger="click"
                  placement="top"
                  rootClose={true}
                  overlay={contactUsPopOver()}
                >
                  <span
                    className="text-white"
                    style={{
                      fontSize: `${subHeadingFS / 16}rem`,
                      cursor: "pointer",
                    }}
                  >
                    Contact us
                  </span>
                </OverlayTrigger>
              </AnimatedButton>
              {/*Contact us*/}
              <AnimatedButton>
                <OverlayTrigger
                  trigger="click"
                  placement="top"
                  rootClose={true}
                  overlay={popOver(`${COVERAGE_TEXT}`, `AREA OF OPERATION`)}
                >
                  <span
                    className="text-white"
                    style={{
                      fontSize: `${subHeadingFS / 16}rem`,
                      cursor: "pointer",
                    }}
                  >
                    Coverage
                  </span>
                </OverlayTrigger>
              </AnimatedButton>
            </div>
            {/*About Us*/}
            {/*FAQs*/}
            <div className="d-flex flex-column justify-content-start align-items-start text-start gap-1">
              <span className="text-white" style={{ fontWeight: "900" }}>
                FAQS
              </span>
              <AnimatedButton
                onClick={() => (window.location.href = ROUTE_LINKS.faqs)}
              >
                <span
                  role="button"
                  className="ttext-white"
                  style={{
                    fontSize: `${subHeadingFS / 16}rem`,
                    cursor: "pointer",
                  }}
                >
                  Frequently asked questions
                </span>
              </AnimatedButton>
            </div>
            {/*FAQs*/}
            {/*JOB*/}
            <div className="d-flex flex-column justify-content-start align-items-start text-start gap-1">
              <span className="text-white" style={{ fontWeight: "900" }}>
                GET A QUOTE
              </span>
              <AnimatedButton
                onClick={() => (window.location.href = ROUTE_LINKS.create_job)}
              >
                <span
                  className="text-white"
                  style={{
                    fontSize: `${subHeadingFS / 16}rem`,
                    cursor: "pointer",
                  }}
                >
                  Get a free quote
                </span>
              </AnimatedButton>
            </div>
            {/*JOB*/}
            {/*Follow Us*/}
            <div className="d-flex flex-column justify-content-start align-items-start text-start gap-1">
              <span className="text-white" style={{ fontWeight: "900" }}>
                FOLLOW US
              </span>
              {/*Social Media*/}
              <div className="d-flex flex-row flex-wrap justify-content-center align-items-center gap-3">
                {/*facebook button*/}
                <div>
                  <div
                    className="bg-white d-flex justify-content-center align-items-center"
                    style={{
                      padding: `${4 / 16}rem`,
                      borderRadius: "50%",
                      width: `${25 / 16}rem`,
                      height: `${25 / 16}rem`,
                    }}
                  >
                    <FaFacebook
                      className="h-100 w-100"
                      color="#4267B2"
                      onClick={() => {
                        let anchor = window.document.createElement("a");
                        anchor.href =
                          "https://www.facebook.com/profile.php?id=100083157257574";
                        anchor.rel = "noreferrer";
                        anchor.target = "_blank";
                        anchor.click();
                      }}
                    />
                  </div>
                </div>
                {/*facebook button*/}
              </div>
              {/*Social Media*/}
            </div>
            {/*Follow Us*/}
          </div>
          {/*Sections*/}
        </Container>
      </footer>
      {/*Privacy Policy*/}
      <div className="text-center p-4" style={{ fontSize: `${14 / 16}rem` }}>
        <div className="fw-normal">
          All content &copy; {PRIVACY_POLICY}{" "}
          <a
            className="text-primary fw-bold"
            href={TermsAndConditions}
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            className="text-primary fw-bold"
            href={TermsAndConditions}
            target="_blank"
            rel="noreferrer"
          >
            Terms & Conditions
          </a>
          .
        </div>
      </div>
      {/*Privacy Policy*/}
    </section>
  );
}
