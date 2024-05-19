import React from "react";
import { Card, OverlayTrigger, Popover } from "react-bootstrap";
import { ABOUTUS, DEVICE_TYPE } from "../utils/strings";

// import image
import Team from "../../images/team.svg";
import { DeviceType } from "../utils/device-type";

// icons
// import { IoArrowForward } from "react-icons/io5";

// export
export function AboutUs() {
  // ref
  const [showMore, setShowMore] = React.useState(false);
  const titleRef = React.useRef(null);
  // function
  const popOver = (description, caption) => {
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

  const minTextLength = () => {
    // determine device type
    let dType = DeviceType();
    //switch case
    switch (dType) {
      case DEVICE_TYPE.mobile:
        return 200;
      case DEVICE_TYPE.tablet:
        return 250;
      default:
        return 300;
    }
  };

  // about us
  const aboutUs = (description, caption) => {
    //
    return (
      <div className="my-3">
        <OverlayTrigger
          trigger="click"
          placement="top"
          rootClose={true}
          overlay={popOver(`${description}`, `${caption}`)}
        >
          <div className="about_text">
            <Card.Text
              as="p"
              className="text-dark"
              style={{ cursor: "pointer" }}
            >
              {`Xcrossing Lines ${description.substring(
                0,
                minTextLength()
              )}... `}
              <span className="fw-bold text-primary">read more ...</span>
            </Card.Text>
          </div>
        </OverlayTrigger>
      </div>
    );
  };
  //
  return (
    <section id="about_us_section">
      <Card className="border-0 rounded-0 bg-transparent py-2">
        <Card.Body className="px-4">
          <div className="about_header_mobile">
            <Card.Title
              as="h3"
              ref={titleRef}
              className="text-center mb-0"
              style={{ fontWeight: "900", lineHeight: "20px" }}
            >
              About us
            </Card.Title>
          </div>
          {/*Row*/}
          <div className="about__section">
            <div className="about_section_text">
              <div className="about_header_desktop">
                <Card.Title
                  as="h3"
                  ref={titleRef}
                  style={{ fontWeight: "900", lineHeight: "20px" }}
                >
                  About us
                </Card.Title>
              </div>
              {aboutUs(ABOUTUS, "About us")}
            </div>
            <div className="about__image__container">
              <div className="about__image__background">
                <img id="about__image" src={Team} alt="The team" />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      {/*  */}
    </section>
  );
}
