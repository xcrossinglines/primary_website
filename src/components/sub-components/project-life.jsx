import React from "react";

import { IoArrowForward } from "react-icons/io5";
import { ROUTE_LINKS } from "../utils/strings";

// export project life
export function ProjectLife() {
  // simple
  return (
    <section id="PROJECT_LIFE" className="w-100">
      <div className="bg-secondary p-3 text-center">
        <span className="text-white" style={{ fontSize: `${14 / 16}rem` }}>
          Thank you for considering{" "}
          <span
            className="text-primary fw-bolder"
            onClick={() => (window.location.href = ROUTE_LINKS.home)}
          >
            Xcrossing Lines
          </span>{" "}
          as your go to service provider. Webapp currently in alpha testing{" "}
          <a
            className="fw-bold rounded-0 btn btn-sm btn-danger"
            href="https://en.wikipedia.org/wiki/Software_release_life_cycle"
            target="_blank"
            rel="noreferrer"
          >
            Learn more <IoArrowForward />
          </a>
        </span>
      </div>
    </section>
  );
}
