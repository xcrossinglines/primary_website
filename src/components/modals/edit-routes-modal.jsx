import React from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

// contexts
import { UPDATE_JOB_CONTEXT } from "../utils/contexts";

// icons
import { HiLocationMarker } from "react-icons/hi";
import { MdEditLocationAlt } from "react-icons/md";

// util
import { NOTIFICATIONS } from "../utils/notifications";
import { GOOGLE_API_KEY, NOTIFICATION_TYPE } from "../utils/strings";
import api from "../utils/api";
import { IS_LOGGED_IN } from "../utils/loggedin";
import { ROUTE_LINKS } from "../utils/strings";
import { ErrorHandling } from "../utils/error-handling";
import { AwaitCallBack } from "../utils/await-callback";

// export modal
export function EDIT_ROUTES_MODAL() {
  //useRef
  const searchRouteRef = React.useRef();
  //
  const context = React.useContext(UPDATE_JOB_CONTEXT);

  // navigate
  const navigate = useNavigate();
  // routes React usestate hook
  const [pickedRoutes, setPickedRoutes] = React.useState([]);
  const [disableUI, setDisableUI] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(
    NOTIFICATION_TYPE.none
  );
  const [leadingText, setLeadingText] = React.useState("");
  const [trailingText, setTrailingText] = React.useState("");

  //
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: GOOGLE_API_KEY,
    debounce: 100,
    options: {
      componentRestrictions: { country: "za" },
    },
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
    if (current <= 0) {
      return "Pickup";
    } else if (current > 0 && current < list.length - 1) {
      return "Pickup|Dropoff";
    }
    //
    return "Dropoff";
  };
  // function generate distance
  const generateDistance = async (routeList) => {
    //
    // set notification
    setNotification(NOTIFICATION_TYPE.loading, "Loading ...", "");

    // set url
    const url = "jobs/api/compute-distance/";
    await api
      .post(url, { routes: routeList })
      .then(async (r) => {
        // check the status
        if (r.status === 200) {
          //
          setNotification(NOTIFICATION_TYPE.none, "", "");

          // set response Data
          const responseData = {
            routes: routeList,
            distance: r.data.distance,
          };

          // update
          await updateJobRoutes(responseData);
        }
      })
      .catch((e) => {
        ErrorHandling(e, setNotification);
      });
  };

  const Routes = ({ routes }) => {
    // evaluate
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

  // function to update
  const updateJobRoutes = async (payload) => {
    // verify if logged in
    const [verify, tokens] = IS_LOGGED_IN();
    if (verify) {
      // set loading
      setNotification(NOTIFICATION_TYPE.loading, "Updating ...", "");
      //set config
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
      };

      // set url
      const url = `jobs/api/job/update/${context.job.id}/`;
      await api
        .patch(url, payload, config)
        .then(async (r) => {
          setNotification(
            NOTIFICATION_TYPE.success,
            "Awesome.",
            "Routes successfully updated"
          );
          // then wait for 3 seconds
          const updateUrl = `/jobs/job/${context.job.id}/update`;
          await AwaitCallBack(() => context.setShow((_) => false), 2000);
          await AwaitCallBack(() => (window.location.href = updateUrl), 2000);
        })
        .catch((e) => {
          ErrorHandling(e, setNotification);
        });
      return;
    }
    //
    // otherwise
    const message =
      "To view this section you must be signed in. we'll navigate you to the sign-in page.";
    setNotification(NOTIFICATION_TYPE.info, "Dear valued customer. ", message);
    // sleep
    await AwaitCallBack(() => {
      context.setShow((_) => false);
      navigate(ROUTE_LINKS.signin);
    }, 6000);
  };

  //
  React.useEffect(() => {
    setPickedRoutes((_) => [...context.job.routes]);
  }, [context]);
  //
  return (
    <Modal
      contentClassName="rounded-0"
      centered={true}
      show={context.show}
      onHide={
        disableUI
          ? null
          : () => {
              context.setShow((_) => false);
              setNotification(NOTIFICATION_TYPE.none, "", "");
            }
      }
    >
      <Modal.Header
        closeButton={true}
        // closeVariant="dark"
        className="rounded-0 text-dark border-0"
      >
        <Modal.Title style={{ fontWeight: "900" }}>Edit routes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*NOTIFICATIONS*/}
        {NOTIFICATIONS(notificationType, leadingText, trailingText)}
        {/*NOTIFICATIONS*/}
        {/*List Items*/}
        <Routes routes={pickedRoutes} />
        {/*List Items*/}
        {/*Search*/}
        <Form.Group className={`position-relative mt-3`}>
          <InputGroup>
            <Form.Control
              className="fw-bold rounded-0 border-end-0"
              placeholder="Search"
              ref={searchRouteRef}
              disabled={disableUI}
              onChange={(e) => getPlacePredictions({ input: e.target.value })}
            />
            <InputGroup.Text className="bg-white rounded-0">
              <MdEditLocationAlt color="red" />
            </InputGroup.Text>
          </InputGroup>
          <ul
            className="dropdown__shadow mt-2 p-0 shadow-sm w-100 position-absolute bg-white d-flex flex-column justify-content-center align-items-center gap-1"
            style={{
              listStyle: "none",
              zIndex: "999",
            }}
          >
            {searchSuggestions(isPlacePredictionsLoading)}
          </ul>
        </Form.Group>
        {/*Search*/}
      </Modal.Body>
      <Modal.Footer className="rounded-0 border-0">
        <Button
          disabled={disableUI}
          variant="outline-primary"
          className="border-0 rounded-0 fw-bold"
          onClick={async () => await generateDistance(pickedRoutes)}
        >
          Select & update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
