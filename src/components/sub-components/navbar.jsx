import React from "react";
import { Squasher } from "../hamburger-menu/squasher";
import { Container } from "react-bootstrap";

// utils
import { DEVICE_TYPE, ROUTE_LINKS } from "../utils/strings";
import { IS_LOGGED_IN } from "../utils/loggedin";
import { useLocation } from "react-router-dom";

// images
import logo from "../../images/logo.svg";
import logoWhite from "../../images/logo_white.svg";

// other links
import { NavLink } from "react-router-dom";
import { GET_USER_NAME } from "../utils/decode-jwt-user";
import api from "../utils/api";
import { AwaitCallBack } from "../utils/await-callback";

// animation
import { AnimatedButton } from "./animated-button";
import { motion } from "framer-motion";
//utils
import { DeviceType } from "../utils/device-type";
import {
  SECTION_ANIMATION_DELAY,
  SECTION_ANIMATION_DURATION,
} from "../utils/numerics";
import { PAGES_VARIANT } from "../utils/animation-variants";

//
import { useScrollY } from "../utils/y-scroll-offset";

// export
export function NavBar() {
  const loc = useLocation();
  const deviceType = DeviceType();
  //variables
  const reloadDoc = false;
  //
  const [isOpen, setOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isHomeScreen, setIsHomeScreen] = React.useState(true);

  // responsive
  // y scroll
  const y = useScrollY();

  // userRef hooks
  const navRef = React.useRef();

  // toogle function
  const toogleActive = (toggled) => {
    // check
    if (toggled) {
      navRef.current.classList.add("active");
      return;
    }
    //
    navRef.current.classList.remove("active");
    return;
  };

  // customer name
  const setUserName = () => {
    const [isLoggedin, decodedInfo] = GET_USER_NAME();
    if (isLoggedin) {
      return (
        `${decodedInfo.f_name}`.toUpperCase().charAt(0) +
        `${decodedInfo.s_name}`.toUpperCase().charAt(0)
      );
    }
    // other
    return "";
  };

  // logout
  const logout = async () => {
    //
    const [isLoggedin, userToken] = IS_LOGGED_IN();
    if (isLoggedin) {
      //
      setIsLoggingOut((_) => true);
      const url = "accounts/api/account/signout/blacklist/";
      await api
        .post(url, {
          access: userToken.access,
          refresh: userToken.refresh,
        })
        .then(async (r) => {
          // check status
          if (r.status === 200) {
            toogleActive(false);
            setOpen((_) => false);
            setIsLoggingOut((_) => false);
            await AwaitCallBack(() => {
              localStorage.clear();
              window.location.href = ROUTE_LINKS.home;
            });
          }
        })
        .catch(async (e) => {
          toogleActive(false);
          setOpen((_) => false);
          setIsLoggingOut((_) => false);
          await AwaitCallBack(() => {
            localStorage.clear();
            window.location.href = ROUTE_LINKS.home;
          });
        });
      return;
    }
  };

  // const set loading out
  const setNotification = (logginOut) => {
    //
    if (logginOut) {
      return (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span className="signout__nav__link">SIGN OUT</span>
          <div
            className="spinner-border spinner-grow-sm text-light"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }
    // just return a span
    return <span className="signout__nav__link">SIGN OUT</span>;
  };

  const setNavigation = () => {
    //
    const [isLoggedin, _] = IS_LOGGED_IN();
    if (isLoggedin) {
      return (
        <React.Fragment>
          <NavLink
            to={ROUTE_LINKS.profile}
            className="nav__link"
            reloadDocument={reloadDoc}
            onClick={handleOnClickNavLinks}
          >
            <span>{setUserName()}</span>
          </NavLink>
          <NavLink
            to={ROUTE_LINKS.jobs}
            className="nav__link"
            reloadDocument={reloadDoc}
            onClick={handleOnClickNavLinks}
          >
            <span>JOBS</span>
          </NavLink>
          <NavLink
            to={ROUTE_LINKS.faqs}
            className="nav__link"
            reloadDocument={reloadDoc}
            onClick={handleOnClickNavLinks}
          >
            <span>FAQ</span>
          </NavLink>
          <NavLink
            className="w-100 signout__btn"
            style={{ fontWeight: "800" }}
            onClick={logout}
          >
            {setNotification(isLoggingOut)}
          </NavLink>
        </React.Fragment>
      );
    }
    //
    return (
      <React.Fragment>
        <NavLink
          to={ROUTE_LINKS.faqs}
          className="nav__link"
          reloadDocument={reloadDoc}
          onClick={handleOnClickNavLinks}
        >
          <span>FAQ</span>
        </NavLink>
        <NavLink
          to={ROUTE_LINKS.signin}
          className="nav__link"
          reloadDocument={reloadDoc}
          onClick={handleOnClickNavLinks}
        >
          <span>SIGN IN</span>
        </NavLink>
        <NavLink
          to={ROUTE_LINKS.signup}
          className="nav__link"
          reloadDocument={reloadDoc}
          onClick={handleOnClickNavLinks}
        >
          <span>REGISTER</span>
        </NavLink>
      </React.Fragment>
    );
  };

  // change logoh
  const changeLogo = (homeScreenLoaded) => {
    if (homeScreenLoaded) {
      return (
        <motion.img
          id="IMAGE_LOGO"
          variants={PAGES_VARIANT}
          animate="visible"
          initial="hidden"
          exit="exit"
          transition={{
            duration: SECTION_ANIMATION_DURATION,
            delay: SECTION_ANIMATION_DELAY,
          }}
          className="img-fluid"
          style={{ width: "140px" }}
          src={logoWhite}
          alt="logo"
        />
      );
    }
    // otherwise
    return (
      <motion.img
        id="IMAGE_LOGO"
        variants={PAGES_VARIANT}
        animate="visible"
        initial="hidden"
        exit="exit"
        transition={{
          duration: SECTION_ANIMATION_DURATION,
          delay: SECTION_ANIMATION_DELAY,
        }}
        className="img-fluid"
        style={{ width: "140px" }}
        src={logo}
        alt="logo"
      />
    );
  };

  // define
  const isHome = React.useCallback(
    () => loc.pathname === ROUTE_LINKS.home,
    [loc.pathname]
  );
  const isTabletMobile = React.useCallback(
    () =>
      deviceType === DEVICE_TYPE.mobile || deviceType === DEVICE_TYPE.tablet,
    [deviceType]
  );
  const isGreaterThanTablet = React.useCallback(
    () =>
      deviceType === DEVICE_TYPE.desktop ||
      deviceType === DEVICE_TYPE.xl_device ||
      deviceType === DEVICE_TYPE.xxl_device,
    [deviceType]
  );

  // handleOnclick for navLink
  const handleOnClickNavLinks = () => {
    setOpen((_) => false);
    toogleActive(false);
  };

  // React
  React.useEffect(() => {
    // variables
    const projectElement = window.document.getElementById("PROJECT_LIFE");
    const element = window.document.getElementById("coverage_section");
    const elements = window.document.getElementsByClassName("nav__link ");

    //
    if (isHome() && projectElement && element) {
      // offet
      const sumOffSet = element.offsetHeight + projectElement.offsetHeight;
      // for desktop
      if (y > sumOffSet && isGreaterThanTablet()) {
        // console.log(, );
        setIsHomeScreen(false);
        Array.from(elements).forEach((e) => (e.style.color = "black"));
      } else if (y < sumOffSet && isGreaterThanTablet()) {
        setIsHomeScreen(true);
        Array.from(elements).forEach((e) => (e.style.color = "white"));
      } else if (y > sumOffSet && isTabletMobile()) {
        setIsHomeScreen(false);
        Array.from(elements).forEach((e) => (e.style.color = "white"));
      } else if (y < sumOffSet && isTabletMobile()) {
        setIsHomeScreen(true);
        Array.from(elements).forEach((e) => (e.style.color = "white"));
      }

      //
    }
  }, [y, isHome, isGreaterThanTablet]);

  React.useEffect(() => {
    // variables
    const elements = window.document.getElementsByClassName("nav__link ");

    // set is home screen
    setIsHomeScreen((_) => isHome());
    // conditional operators
    if (isTabletMobile() && isHome())
      Array.from(elements).forEach((e) => (e.style.color = "white"));
    else if (isTabletMobile() && !isHome())
      Array.from(elements).forEach((e) => (e.style.color = "white"));
    else if (isGreaterThanTablet() && isHome())
      Array.from(elements).forEach((e) => (e.style.color = "white"));
    else if (isGreaterThanTablet() && !isHome())
      Array.from(elements).forEach((e) => (e.style.color = "black"));
  }, [loc.pathname, deviceType, isHome, isGreaterThanTablet, isTabletMobile]);

  //
  return (
    <div
      className="shadow-sm position-sticky top-0 bg-transparent p-0 w-100"
      style={{ zIndex: "999" }}
    >
      <header
        className={`position-relative top-0 bg-white p-0 w-100`}
        style={{ zIndex: "999" }}
      >
        <Container
          className={`navbar bg-${isHomeScreen ? "secondary" : "white"}`}
        >
          <AnimatedButton id="logo" className="ms-3 p-1">
            <NavLink
              to={ROUTE_LINKS.home}
              reloadDocument={isHome()}
              className="profile__nav__link"
              onClick={handleOnClickNavLinks}
            >
              {changeLogo(isHomeScreen)}
            </NavLink>
          </AnimatedButton>
          <nav ref={navRef}>{setNavigation()}</nav>
          <div className="hamburger__section me-1">
            <AnimatedButton id="userprofile" className="px-1">
              <NavLink
                id="SIGNEDIN_USER"
                style={{
                  textDecoration: "none",
                  fontWeight: "900",
                  color: isHomeScreen ? "#fff" : "#0c0c0c",
                  // color: "#0c0c0c",
                }}
                reloadDocument={reloadDoc}
                to={ROUTE_LINKS.profile}
                onClick={handleOnClickNavLinks}
              >
                {setUserName()}
              </NavLink>
            </AnimatedButton>
            {/*Animation*/}
            <AnimatedButton id="hamburger-icon" className="me-2">
              <Squasher
                id="HAMBURGER_ICON"
                size={25}
                color={isHomeScreen ? "#fff" : "var(--primary-color)"}
                rounded={true}
                toggled={isOpen}
                duration={0.3}
                onToggle={(toggled) => {
                  setOpen((_) => toggled);
                  toogleActive(toggled);
                }}
              />
            </AnimatedButton>
            {/*Animation*/}
          </div>
        </Container>
      </header>
    </div>
  );
}
