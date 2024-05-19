import React from "react";
import { Container } from "react-bootstrap";

// local imports
import { OurServices } from "../sub-components/services";
import { CoverPage } from "../sub-components/cover-page";
import { AboutUs } from "../sub-components/about-us";
import { WhyChooseUs } from "../sub-components/why-choose-us";
import { ProjectLife } from "../sub-components/project-life";
import { Testimonials } from "../sub-components/testimonials";

// import framer
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../utils/animation-variants";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";

// export
export default function Main() {
  //
  React.useEffect(() => {
    // scroll to top
    window.scrollTo(0, 0);
  }, []);
  //
  return (
    <motion.section
      variants={PAGES_VARIANT}
      animate="visible"
      initial="hidden"
      exit="exit"
      transition={{
        duration: SECTION_ANIMATION_DURATION,
        delay: SECTION_ANIMATION_DELAY,
      }}
    >
      <Container className="p-0">
        <ProjectLife />
        <CoverPage />
        <OurServices />
        <AboutUs />
        <WhyChooseUs />
        <Testimonials />
      </Container>
    </motion.section>
  );
}
