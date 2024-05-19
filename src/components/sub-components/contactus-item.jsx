import React from "react";

// export
export function CONTACTUS_ITEM({ icon, item }) {
  // remember that subtitle is a list

  return (
    <div className="d-flex flex-row justify-content-start align-items-start gap-2">
      <div>{icon}</div>
      <div className="d-flex flex-column justify-content-start align-items-start">
        {/* <div className="h6 m-0" style={{ fontWeight: "900" }}>
          {title}
        </div> */}
        {item.map((value, index) => (
          <span key={index} className="fw-bolder">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
