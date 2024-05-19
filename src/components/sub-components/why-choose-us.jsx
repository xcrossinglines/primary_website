import React from "react";
import { Card, Col, Row } from "react-bootstrap";

import { WHY_CHOOSE_US } from "../utils/strings";
import { VerticalSpacer } from "./vertical-spacer";

// why choose us
export function WhyChooseUs() {
  //
  return (
    <section id="why_choose_us_section">
      <div className="card rounded-0 border-0 bg-transparent">
        <div className="card-body text-center px-4">
          {/*Headers*/}
          <h2 className="card-title mb-4" style={{ fontWeight: "900" }}>
            Why choose us
          </h2>
          {/*underbar*/}
          {/* <div className="d-flex flex-row justify-content-center align-items-center mb-4">
            <div
              className="bg-primary bg-opacity-50"
              style={{
                height: `${5 / 16}rem`,
                width: `${80 / 16}rem`,
              }}
            />
          </div> */}
          {/*underbar*/}
          {/*Headers*/}
          <Row xs={1} sm={1} md={2} lg={3} xl={3} xxl={3}>
            {WHY_CHOOSE_US.map((v, i) => {
              return (
                <Col className="py-2" key={i}>
                  <Card
                    className="dropdown__shadow w-100 h-100 rounded-0 border-0"
                    style={{ backgroundColor: "#fafafa" }}
                  >
                    <Card.Body className="d-flex flex-row justify-content-between align-items-center py-5">
                      <div className="text-start h-100 w-100">
                        <Card.Title
                          as="h4"
                          style={{
                            fontWeight: "900",
                            lineHeight: "20px",
                            fontSize: `${18 / 16}rem`,
                          }}
                        >
                          {v.caption}
                        </Card.Title>
                        <Card.Text style={{ fontSize: `${15 / 16}rem` }} as="p">
                          {v.description}
                        </Card.Text>
                      </div>
                      <div
                        className="ms-0 p-3 border-0 "
                        style={{ borderRadius: "50%" }}
                      >
                        <img
                          src={v.img}
                          alt={v.caption}
                          style={{
                            width: `${40 / 16}rem`,
                            height: `${40 / 16}rem`,
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <VerticalSpacer height={"20px"} />
        </div>
      </div>
    </section>
  );
}
