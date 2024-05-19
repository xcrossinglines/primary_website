import React from "react";

// export
export function useScrollY() {
  const [y, setY] = React.useState(0);

  React.useEffect(() => {
    //
    const onScroll = (e) => setY((_) => window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}
