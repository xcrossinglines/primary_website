import React from "react";

// animation
import { motion, useAnimation } from "framer-motion";

import { AwaitCallBack } from "../utils/await-callback";

// export
export function AnimatedButton({
  id = "animated",
  className,
  children,
  onClick = () => {},
}) {
  //
  const animation = useAnimation();
  // export rgb(39, 36, 96) secondary color
  // export rgb(115, 194, 251) primary
  const BUTTON_VARIANT = {
    hide: {
      backgroundColor: "rgb(115, 194, 251, 0.0)",
    },
    show: {
      backgroundColor: "rgb(115, 194, 251, 0.75)",
    },
    exit: {
      backgroundColor: "rgb(115, 194, 251, 0.0)",
    },
  };
  //animation div
  return (
    <motion.div
      id={id}
      className={className}
      variants={BUTTON_VARIANT}
      animate={animation}
      exit="exit"
      transition={{ duration: 0.5 }}
      onClick={async () => {
        animation.start("show");
        await AwaitCallBack(() => animation.start("hide"), 100);
        onClick();
      }}
    >
      {children}
    </motion.div>
  );
}
