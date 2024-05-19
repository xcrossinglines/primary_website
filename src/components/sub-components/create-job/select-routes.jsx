import React from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

// import { Swiper } from "swiper/react";

import {
  CREATE_JOB_VIEW,
  GOOGLE_API_KEY,
  NOTIFICATION_TYPE,
} from "../../utils/strings";

// icons
import { HiLocationMarker } from "react-icons/hi";
import { MdEditLocationAlt } from "react-icons/md";

// api
import api from "../../utils/api";

import { CREATE_JOB_CONTEXT } from "../../utils/contexts";
import { Button, ButtonGroup, Card, Form, InputGroup } from "react-bootstrap";
import { NOTIFICATIONS } from "../../utils/notifications";
import { ENCODE_CREATE_JOB_JWT, GET_JWT_JOB } from "../../utils/jwt-encode-job";
import { ErrorHandling } from "../../utils/error-handling";

// animation
import { motion } from "framer-motion";
import { PAGES_VARIANT } from "../../utils/animation-variants";

// export
export function SelectRoutes() {
  // ref
  const searchRouteRef = React.useRef();
  // locations
  const [pickedRoutes, setPickedRoutes] = React.useState([]);
  const [disableUI, setDisableUI] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");

  // get context
  const context = React.useContext(CREATE_JOB_CONTEXT);

  //
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: GOOGLE_API_KEY,
    debounce: 100,
    options: { componentRestrictions: { country: "za" } },
  });

  // notification function
  const setNotification = (type, leading, trailing) => {
    setNotificationType((_) => type);
    setLeadingText((_) => leading);
    setTrailingText((_) => trailing);

    // disable
    const disable =
      type === NOTIFICATION_TYPE.loading || type === NOTIFICATION_TYPE.success;
    setDisableUI((_) => disable);
  };

  // function to determin
  const pickupDropOff = (list, current) => {
    if (current <= 0) return "Pickup";
    else if (current > 0 && current < list.length - 1) return "Both";
    return "Dropoff";
  };

  // jwt encode then save to local storage
  const jwtSaveLocalStorage = (data) => {
    // get the payload
    const [verify, payload] = GET_JWT_JOB();
    if (verify) {
      const sudoData = {
        ...payload,
        ...data,
      };
      ENCODE_CREATE_JOB_JWT(sudoData);
      return;
    }
    return;
  };

  // function generate distance
  const generateDistance = async (routeList) => {
    // set notification
    setNotification(NOTIFICATION_TYPE.loading, "Loading...", "");

    // set url
    const url = "jobs/api/compute-distance/";
    await api
      .post(url, { routes: routeList })
      .then((r) => {
        // check the status
        if (r.status === 200) {
          // set notification
          setNotification(NOTIFICATION_TYPE.success, "Awesome", "");
          jwtSaveLocalStorage({
            routes: routeList,
            distance: r.data.distance,
          });
          // navigate to next page
          context.selectNext(CREATE_JOB_VIEW.route);
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      });
  };

  // return routes
  // these routes are choosen routes and will
  // show at the bottom of the search bar
  const Routes = ({ routes }) => {
    //
    if (routes.length > 0) {
      return (
        <div className="mt-3">
          <table className="table table-bordered table-striped table-dark m-0">
            {/*head*/}
            {routes.length > 0 ? (
              <thead>
                <tr>
                  <th>Routes</th>
                </tr>
              </thead>
            ) : null}
            {/*head*/}
            {/*tbody*/}
            <tbody>
              {routes.map((route, index) => {
                return (
                  <tr key={`route-${index}`}>
                    <td>
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex flex-column">
                          <span className="form-text fw-bold text-warning">
                            {index + 1} - {pickupDropOff(routes, index)}
                          </span>
                          <span style={{ fontSize: `${14 / 16}rem` }}>
                            {route.route_name}
                          </span>
                        </div>
                        <div className="ms-2">
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Close"
                            onClick={
                              disableUI
                                ? null
                                : () => {
                                    const newRouteList = pickedRoutes.filter(
                                      function (item) {
                                        return item !== route;
                                      }
                                    );
                                    setPickedRoutes((_) => [...newRouteList]);
                                  }
                            }
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/*tbody*/}
          </table>
        </div>
      );
    }
  };

  // when search route is clicked
  const getRouteAddress = (place) => {
    placesService?.getDetails(
      {
        placeId: place.place_id,
      },
      (placeDetails) => {
        const loc = {
          route_name: `${place.structured_formatting.main_text} ${place.structured_formatting.secondary_text}`,
          lat: placeDetails.geometry.location.lat(),
          lng: placeDetails.geometry.location.lng(),
        };
        setPickedRoutes((_) => [...pickedRoutes, loc]);
        getPlacePredictions({ input: "" });
        searchRouteRef.current.value = "";
      }
    );
  };

  // These are seach items
  // these items will show on the search list
  const seachListItem = (searchList) => {
    //
    if (searchList.length > 0) {
      return searchList.map((route, index) => {
        return (
          <li
            key={index}
            className="btn btn-light border-0 w-100 rounded-0 text-dark d-flex flex-row justify-content-start align-items-start text-start gap-2"
            onClick={() => getRouteAddress(route)}
          >
            <div className="p-0 m-0">
              <HiLocationMarker color="red" />
            </div>
            <span style={{ fontSize: `${14 / 16}rem` }}>
              <strong>{route.structured_formatting.main_text}</strong>{" "}
              {route.structured_formatting.secondary_text}
            </span>
          </li>
        );
      });
    }
  };

  // thi will be displayed when loading search routes
  const searchSuggestions = (isloading) => {
    if (isloading) {
      return (
        <div className="w-100 p-2 d-flex flex-row justify-content-center align-items-center">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    } else if (placePredictions.length > 0) {
      return seachListItem(placePredictions);
    }
    return;
  };

  // REact
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // React
  React.useEffect(() => {
    //
    const [verify, payload] = GET_JWT_JOB();
    // verify ...
    if (verify && payload.routes) setPickedRoutes((_) => [...payload.routes]);
  }, []);

  //
  return (
    <motion.div
      variants={PAGES_VARIANT}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 1,
      }}
    >
      {/*NOTIFICATIONS*/}
      {NOTIFICATIONS(notificationType, leadingText, trailingText)}
      {/*NOTIFICATIONS*/}
      {/*List Items*/}
      <Routes routes={pickedRoutes} />
      {/* {choosenRoutes(pickedRoutes)} */}
      {/*List Items*/}
      {/*Search*/}
      <div id="LOCATION_SEARCH" />
      <Form.Group className="position-relative mt-3">
        <InputGroup>
          <Form.Control
            id="search"
            className="fw-bold rounded-0 border border-end-0"
            placeholder="Search"
            type="search"
            ref={searchRouteRef}
            disabled={disableUI}
            onChange={(e) => getPlacePredictions({ input: e.target.value })}
            onFocus={() => {
              const formElement = document.getElementById("LOCATION_SEARCH");
              window.scrollTo(0, formElement.offsetTop - 10);
            }}
            onClick={() => {
              const formElement = document.getElementById("LOCATION_SEARCH");
              window.scrollTo(0, formElement.offsetTop - 10);
            }}
          />
          <InputGroup.Text className="bg-white rounded-0">
            <MdEditLocationAlt color="red" />
          </InputGroup.Text>
        </InputGroup>
        <ul
          className="dropdown__shadow mt-2 p-0 shadow-sm bg-white w-100 position-absolute d-flex flex-column justify-content-center align-items-center gap-1"
          style={{
            listStyle: "none",
            zIndex: "999",
          }}
        >
          {searchSuggestions(isPlacePredictionsLoading)}
        </ul>
      </Form.Group>
      {/*Search*/}

      {/*footer*/}
      <Card.Footer className="mt-3 border-top border-3 border-light rounded-0 bg-transparent d-flex flex-row justify-content-end align-items-center">
        <ButtonGroup>
          <Button
            className="rounded-0 border-0 "
            style={{ fontWeight: "800" }}
            variant="outline-secondary"
            disabled={disableUI}
            onClick={() => context.selectPrevious(CREATE_JOB_VIEW.route)}
          >
            Previous
          </Button>
          <Button
            className="rounded-0 border-0"
            style={{ fontWeight: "800" }}
            variant="outline-primary"
            disabled={pickedRoutes.length <= 1 || disableUI}
            onClick={async () => await generateDistance(pickedRoutes)}
          >
            Select & proceed
          </Button>
        </ButtonGroup>
      </Card.Footer>
      {/*footer*/}
    </motion.div>
  );
}

// locations
// {
//   route_name:
//     "University of Witwatersrand Johannesburg standard university for the best engineering students",
//   description: 0,
//   lat: -25.02211554445564,
//   lng: -25.02211554445564,
// },
// {
//   route_name: "University of Pretoria",
//   description: 0,
//   lat: -25.02211554445564,
//   lng: -25.02211554445564,
// },

//
// to be removed
// jwtSaveLocalStorage({
//   routes: routeList,
//   // distance: r.data.distance,
//   distance: 20,
// });
// setNotification(NOTIFICATION_TYPE.none, "", "");
// context.selectNext(CREATE_JOB_VIEW.route);
// to be removed
//

// // to be removed
// jwtSaveLocalStorage({
//   routes: routeList,
//   distance: 40,
// });
// setNotification(NOTIFICATION_TYPE.none, "", "");
// context.selectNext(CREATE_JOB_VIEW.route);
// return;
// // to be removed
