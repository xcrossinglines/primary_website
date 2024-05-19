import axios from "axios";
import { IS_LOGGED_IN } from "./loggedin";
import { DEBUG_MODE } from "./debug-mode";

// check
const devUrl = "http://127.0.0.1:8000/";
const actualUrl = "https://xcrossinglines-transport.herokuapp.com/";

// choose header types
const retrieveHeaderType = () => {
  // verify user logged in
  const [isloggedIn, tokens] = IS_LOGGED_IN();
  // conditional operator
  return isloggedIn
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.access}`,
      }
    : { "Content-Type": "application/json" };
};

// check
export default axios.create({
  baseURL: DEBUG_MODE ? devUrl : actualUrl,
  headers: retrieveHeaderType(),
  // timeout: 20000, // 20 seconds
  // timeoutErrorMessage:
  //   "Request took too long, please check your internet connection.",
});
