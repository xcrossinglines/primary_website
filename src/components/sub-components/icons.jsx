import React from "react";

// export
export function Icon({ icon, dimension, className }) {
  return (
    <img
      className={className}
      src={icon}
      alt="icon"
      style={{
        width: `${dimension}rem`,
        height: `${dimension}rem`,
      }}
    />
  );
}
