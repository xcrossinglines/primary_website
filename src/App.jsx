import React from "react";

import { BrowserRouter } from "react-router-dom";

import { NavBar } from "./components/sub-components/navbar";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import "./xcrossinglines-sass.scss";

// google
import { GoogleOAuthProvider } from "@react-oauth/google";

// api
import api from "./components/utils/api";
//

import { Footer } from "./components/sub-components/footer";

// icons
import { AiOutlineWhatsApp as WhatsAppIcon } from "react-icons/ai";
import { RiWhatsappFill } from "react-icons/ri";

// route links
import { CLIENT_ID, NOTIFICATION_TYPE } from "./components/utils/strings";

import { IS_LOGGED_IN } from "./components/utils/loggedin";
import { NOTIFICATIONS } from "./components/utils/notifications";
import { Container } from "react-bootstrap";
import { AnimatedRoutes } from "./components/utils/routes";

//
import { motion, useAnimation } from "framer-motion";
import { PAGES_VARIANT } from "./components/utils/animation-variants";

function App() {
  // animation hooks
  const animate = useAnimation();
  // react
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");
  const [shutdownWebsite, setShutdownWebsite] = React.useState(true);

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);
  };

  // http request to check
  const userConfigoration = React.useCallback(async () => {
    // set url
    const [verify, _] = IS_LOGGED_IN();
    const url = "config/api/get/config/";
    await api
      .get(url)
      .then((r) => {
        // check status code
        if (r.status === 200) {
          setShutdownWebsite((_) => r.data.shutdown_website);
          if (r.data.shutdown_website) animate.start("visible");
          else if (r.data.pComplete)
            setNotification(NOTIFICATION_TYPE.none, "", "");
          else if (verify && !r.data.pComplete)
            setNotification(NOTIFICATION_TYPE.warning, "Warning! ", r.data.msg);
        }
      })
      .catch((e) => setShutdownWebsite((_) => false));
  }, []);

  // useEffect
  React.useEffect(() => {
    userConfigoration();
  }, [userConfigoration]);

  return shutdownWebsite ? (
    <motion.div
      variants={PAGES_VARIANT}
      initial="hidden"
      animate={animate}
      exit="hidden"
      className="main__parent w-100 h-100 d-flex flex-column justify-content-center align-items-center"
    >
      <h1 className="fw-bolder">Xcrossing Lines</h1>
      <h3>Transport Services Pty (Ltd)</h3>
      <p className="text-center">
        Website currently undergoing mentanance thank you for your patience
      </p>
    </motion.div>
  ) : (
    <GoogleOAuthProvider clientId={`${CLIENT_ID}`}>
      <BrowserRouter>
        <div className="main__parent">
          <div className="d-flex flex-column">
            {/*Navbar*/}
            <NavBar />
            {/*Navbar*/}
            {/* Incomplete profile */}
            <Container className="p-0">
              {/*NOTIFICATIONS*/}
              {NOTIFICATIONS(notificationType, leadingText, trailingText)}
              {/*NOTIFICATIONS*/}
            </Container>
            {/* Incomplete profile */}
            {/* Routes*/}
            <React.Fragment>
              <AnimatedRoutes />
            </React.Fragment>
            {/* Routes*/}
          </div>
          {/*whatapp button*/}
          <div className="chat_btn" style={{ zIndex: 999 }}>
            <a
              className="text-decoration-none fw-bolder d-flex flex-row justify-content-center align-items-center gap-1 btn btn-outline-primary btn-sm rounded-5 border-0 text-white"
              style={{ backgroundColor: "#25D366" }}
              href="https://wa.link/byh16w"
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={20} color="#fff" />
              Start Chat
            </a>
          </div>
          {/*whatapp button*/}
          <Footer />
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
