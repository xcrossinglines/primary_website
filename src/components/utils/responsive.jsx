import React from "react";

// function to determine the size
export function ScreenSize() {
  //
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  //
  React.useEffect(() => {
    function handleWidthResize() {
      setScreenWidth((v) => window.innerWidth);
    }

    //
    window.addEventListener("resize", handleWidthResize);

    return () => {
      window.removeEventListener("resize", handleWidthResize);
    };
  }, []);

  return screenWidth;
}
