import React from "react";
import { VerticalSpacer } from "./vertical-spacer";

// export
export function LazyLoader({ text }) {
  // inial loader
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // export
  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center py-4">
      <p className="text-muted fw-light">{text} ...</p>
      <VerticalSpacer height={`${window.innerHeight}px`} />
    </div>
  );
}
