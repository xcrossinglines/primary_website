import React from "react";

// animation
import { motion } from "framer-motion";

// icons
import { FaQuestionCircle } from "react-icons/fa";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";
import { Link } from "react-router-dom";
import { VerticalSpacer } from "../sub-components/vertical-spacer";
import { ROUTE_LINKS } from "../utils/strings";

// export
export default function PageNotFound() {
  // return
  return (
    <motion.div
      className="w-100 px-3 py-5 d-flex flex-column justify-content-center align-items-center"
      variants={PAGES_VARIANT}
      animate="visible"
      initial="hidden"
      exit="exit"
      transition={{
        duration: SECTION_ANIMATION_DURATION,
        delay: SECTION_ANIMATION_DELAY,
      }}
    >
      <div className="mb-3">
        <FaQuestionCircle size={55} className="text-muted text-opacity-75" />
      </div>
      <h1 style={{ fontWeight: 900 }} className="text-dark mb-3 text-center">
        Page Not Found
      </h1>
      <p className="text-center">
        Oops! We couldn't find the page that you're looking for.
      </p>
      <p className="text-center">Please check the address and try again.</p>
      <p className="fw-bolder">Error code: 404</p>

      <span className="text-center text-muted">
        <Link
          className="text-dark fw-bold"
          to={ROUTE_LINKS.home}
          reloadDocument={true}
        >
          Click here{" "}
        </Link>{" "}
        to return to the home page.
      </span>
      <VerticalSpacer height={`${window.innerHeight / 2}px`} />
    </motion.div>
  );
}
