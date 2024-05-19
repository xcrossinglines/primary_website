import React from "react";
import { Card, OverlayTrigger, Popover } from "react-bootstrap";

import { BsInfoCircle as InfoIcon } from "react-icons/bs";
// import { FaInfoCircle as InfoIcon } from "react-icons/fa";

import {
  AMOUNT_DUE,
  BASE_AMOUNT,
  EXTRA_DISCOUNT,
  OFFPEAK,
  PRICE_ADJUSTMENT,
  RETURN_CUSTOMER,
} from "../utils/strings";
import { AnimatedButton } from "./animated-button";

// export export
export function JOB_INVOICE_SLIP({ job, padding = "p-3" }) {
  // format
  const formater = Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "zar",
    minimumSignificantDigits: 1,
  });

  //const popover
  const popover = (body) => {
    return (
      <Popover
        id="popover-basic"
        className="rounded-0 border-secondary"
        arrowProps={{ style: { backgroundColor: "red" } }}
      >
        <Popover.Body className="text-secondary fw-bold rounded-0">
          {body}
        </Popover.Body>
      </Popover>
    );
  };

  //
  return (
    <Card className="dropdown__shadow rounded-0 border-0">
      <Card.Body className={`${padding}`}>
        {/*table*/}
        <table className={`table table-bordered table-striped table-dark m-0`}>
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col">Price(ZAR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="d-flex flex-row">
                  <span>Base fee</span>
                  <AnimatedButton className="px-1">
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      rootClose={true}
                      overlay={popover(`${BASE_AMOUNT}`)}
                    >
                      <div>
                        <InfoIcon role="button" className="text-primary" />
                      </div>
                    </OverlayTrigger>
                  </AnimatedButton>
                </div>
              </td>
              <td>{`${formater.format(job.base_fee)}`}</td>
            </tr>
            <tr>
              <td>
                <div className="d-flex flex-row">
                  <span>Off peak</span>
                  <AnimatedButton className="px-1">
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      rootClose={true}
                      overlay={popover(`${OFFPEAK}`)}
                    >
                      <div>
                        <InfoIcon role="button" className="text-primary" />
                      </div>
                    </OverlayTrigger>
                  </AnimatedButton>
                </div>
              </td>
              <td className="text-danger fw-bolder">{`${
                job.mid_discount > 0 ? "-" : ""
              } ${formater.format(job.mid_discount)}`}</td>
            </tr>
            <tr>
              <td>
                <div className="d-flex flex-row">
                  <span>Return customer</span>
                  <AnimatedButton className="px-1">
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      rootClose={true}
                      overlay={popover(`${RETURN_CUSTOMER}`)}
                    >
                      <div>
                        <InfoIcon role="button" className="text-primary" />
                      </div>
                    </OverlayTrigger>
                  </AnimatedButton>
                </div>
              </td>
              <td className="text-danger fw-bolder">{`${
                job.return_customer_discount > 0 ? "-" : ""
              } ${formater.format(job.return_customer_discount)}`}</td>
            </tr>
            {/*extra discount*/}
            {job.give_extra_discount ? (
              <tr>
                <td>
                  <div className="d-flex flex-row">
                    <span>Extra discount</span>
                    <AnimatedButton className="px-1">
                      <OverlayTrigger
                        trigger="click"
                        placement="top"
                        rootClose={true}
                        overlay={popover(`${EXTRA_DISCOUNT}`)}
                      >
                        <div>
                          <InfoIcon role="button" className="text-primary" />
                        </div>
                      </OverlayTrigger>
                    </AnimatedButton>
                  </div>
                </td>
                <td className="text-danger">{`${
                  job.give_extra_discount ? "-" : ""
                } ${formater.format(job.extra_discount)}`}</td>
              </tr>
            ) : null}
            {/*price adjustment*/}
            {job.set_price_adjustment ? (
              <tr>
                <td>
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-row">
                      <span>Price adjustment</span>
                      <AnimatedButton className="px-1">
                        <OverlayTrigger
                          trigger="click"
                          placement="top"
                          rootClose={true}
                          overlay={popover(`${PRICE_ADJUSTMENT}`)}
                        >
                          <div>
                            <InfoIcon role="button" className="text-primary" />
                          </div>
                        </OverlayTrigger>
                      </AnimatedButton>
                    </div>
                    <span className="text-muted form-text fw-bold border border-2 px-1 bg-light">
                      Price adjustment justification:{" "}
                      <span className="text-dark">
                        {job.price_adjustment_justification}
                      </span>
                    </span>
                  </div>
                </td>
                <td>{`${formater.format(job.price_adjustment)}`}</td>
              </tr>
            ) : null}
            {/*price adjustment*/}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <div className="d-flex flex-row">
                  <span style={{ fontWeight: "900" }}>Amount due</span>
                  <AnimatedButton className="px-1">
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      rootClose={true}
                      overlay={popover(`${AMOUNT_DUE}`)}
                    >
                      <div>
                        <InfoIcon role="button" className="text-primary" />
                      </div>
                    </OverlayTrigger>
                  </AnimatedButton>
                </div>
              </td>
              <td>
                <span
                  style={{
                    fontWeight: "900",
                    fontSize: `${20 / 16}rem`,
                  }}
                >
                  {formater.format(job.amount_due).replace("ZA", "")}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
        {/*table*/}
      </Card.Body>
    </Card>
  );
}
