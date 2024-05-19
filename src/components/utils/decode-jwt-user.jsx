import jwt_decode from "jwt-decode";

// export
export function GET_USER_NAME() {
  try {
    //
    const userToken = JSON.parse(localStorage.getItem("xcrossinglines_tokens"));
    if (userToken) {
      // decoded
      const decodedInfo = jwt_decode(userToken.access);
      //
      return [true, decodedInfo];
    }
    //other
    return [false, {}];
  } catch (error) {
    //other
    return [false, {}];
  }
}
