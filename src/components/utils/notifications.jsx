import React from "react";

import { NOTIFICATION_TYPE } from "./strings";

// import icons
import { BsCheckCircleFill, BsInfoCircleFill } from "react-icons/bs";
import { IoIosWarning } from "react-icons/io";
import { MdOutlineError } from "react-icons/md";

export function NOTIFICATIONS(notificationType, leadingText, trailingText) {
  // icons size
  const iconSize = 22;

  //
  switch (notificationType) {
    case NOTIFICATION_TYPE.success:
      return (
        <div className="alert alert-success rounded-0 m-0" role="alert">
          <div className="d-flex flex-row justify-content-center align-items-start gap-2">
            <div>
              <BsCheckCircleFill size={iconSize} />
            </div>
            <span className="fw-bolder">
              {leadingText} <span className="fw-normal">{trailingText}</span>
            </span>
          </div>
        </div>
      );
    case NOTIFICATION_TYPE.error:
      return (
        <div className="alert alert-danger rounded-0 m-0" role="alert">
          <div className="d-flex flex-row justify-content-center align-items-start gap-2">
            <div>
              <MdOutlineError size={iconSize} />
            </div>
            <span className="fw-bolder">
              {leadingText} <span className="fw-normal">{trailingText}</span>
            </span>
          </div>
        </div>
      );
    case NOTIFICATION_TYPE.warning:
      return (
        <div className="alert alert-warning rounded-0 m-0" role="alert">
          <div className="d-flex flex-row justify-content-center align-items-start gap-2">
            <div>
              <IoIosWarning size={iconSize} />
            </div>
            <span className="fw-bolder">
              {leadingText} <span className="fw-normal">{trailingText}</span>
            </span>
          </div>
        </div>
      );

    case NOTIFICATION_TYPE.info:
      return (
        <div className="alert alert-info rounded-0 m-0" role="alert">
          <div className="d-flex flex-row justify-content-center align-items-start gap-2">
            <div>
              <BsInfoCircleFill size={iconSize} />
            </div>
            <span className="fw-bolder">
              {leadingText} <span className="fw-normal">{trailingText}</span>
            </span>
          </div>
        </div>
      );
    case NOTIFICATION_TYPE.loading:
      return (
        <div className="alert alert-info rounded-0 m-0" role="alert">
          <div className="d-flex justify-content-center align-items-start">
            <div
              className="spinner-border text-secondary spinner-border-sm"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>{" "}
            <span className="ms-2 fw-bolder"> {leadingText} </span>
          </div>
        </div>
      );
    default:
      return <></>;
  }
}
