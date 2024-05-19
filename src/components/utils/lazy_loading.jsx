import React from "react";
import { LazyLoader } from "../sub-components/lazy_loading_text";

// export
export function LazyLoading({ children }) {
  return (
    <React.Suspense fallback={<LazyLoader text={"Just a moment"} />}>
      {children}
    </React.Suspense>
  );
}
