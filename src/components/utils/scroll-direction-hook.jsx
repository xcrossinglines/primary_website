import React from "react";
import { ScrollDirection } from "./strings";

// export
export function useScrollDirection() {
  //const threshold
  const threshold = 10;
  const [scrollDir, setScrollDir] = React.useState(ScrollDirection.up);

  //
  React.useEffect(() => {
    // previous scroll position
    let previousScrollPosition = window.scrollY;

    //
    const scrollMorethanThreshold = (currentScrollYPosition) =>
      Math.abs(currentScrollYPosition - previousScrollPosition) > threshold;

    //is scrolling up
    const isScrollingUp = (currentScrollYPosition) =>
      currentScrollYPosition > previousScrollPosition &&
      !(previousScrollPosition > 0 && currentScrollYPosition === 0) &&
      !(currentScrollYPosition > 0 && previousScrollPosition === 0);

    const updateScrollDirection = () => {
      const currentScrollYPosition = window.scrollY;
      if (scrollMorethanThreshold(currentScrollYPosition)) {
        const newScrollDirection = isScrollingUp(currentScrollYPosition)
          ? ScrollDirection.down
          : ScrollDirection.up;
        setScrollDir(newScrollDirection);
        previousScrollPosition =
          currentScrollYPosition > 0 ? currentScrollYPosition : 0;
      }
    };
    const onScroll = () => window.requestAnimationFrame(updateScrollDirection);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollDir;
}
