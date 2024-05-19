import React from "react";
import { Card } from "react-bootstrap";

// utils
import {
  INTRODUCTION_COVER_TITLE,
  INTRODUCTION_COVER_TEXT,
} from "../utils/strings";
import { Link } from "react-router-dom";
import { ROUTE_LINKS } from "../utils/strings";

// import icons
// import { FaChevronRight } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";

// image
import CoverImage from "../../images/cover-image.svg";
// export
export function CoverPage() {
  //
  return (
    <section id="coverage_section">
      <div className="cover__page">
        {/* bg-transparent border-0 */}
        <Card className="cover__page__card bg-secondary rounded-0 bg-opacity-75 border-0">
          <Card.Body>
            <h1 className="text-white" style={{ fontWeight: 900 }}>
              {INTRODUCTION_COVER_TITLE} Xcrossing Lines
            </h1>
            <h5 className="text-white my-3" style={{ fontWeight: 900 }}>
              Speed, reliability and care in every package
            </h5>
            <Card.Text
              className="mb-3 text-white fw-light"
              style={{ fontSize: `${14 / 16}rem` }}
            >
              {INTRODUCTION_COVER_TEXT}
            </Card.Text>
            <Link
              to={ROUTE_LINKS.create_job}
              reloadDocument={false}
              className="btn btn-md btn-primary text-white rounded-0 border-0 px-3 quote-btn"
              style={{ fontWeight: 800 }}
            >
              Get a quote <IoArrowForward size={20} />
            </Link>
          </Card.Body>
        </Card>
        {/* image */}
        <div className="cover_image_background">
          <img src={CoverImage} alt="coverimage" />
        </div>
        {/* image */}
      </div>
    </section>
  );
}
