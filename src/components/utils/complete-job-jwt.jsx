import jwt_decode from "jwt-decode";
import jwt_encode from "jwt-encode";

//
// export
export function COMPLETE_JOB_JWT_DECODED() {
  // try and fetch the job to complete
  try {
    //
    const fetchJwtComplete = JSON.parse(localStorage.getItem("create-job"));
    // verify
    if (fetchJwtComplete) {
      //decoded
      const decoded = jwt_decode(fetchJwtComplete);
      // return list
      return [true, decoded];
    }
    //
    return [false, {}];
  } catch (error) {
    return [false, {}];
  }
}

// encode
export function ENCODE_COMPLETE_JOB(data) {
  // const
  const secretKey = "xcrossinglines";
  const jwt = jwt_encode(data, secretKey);

  // save the jwt locally
  localStorage.setItem("create-job", JSON.stringify(jwt));

  //
  return jwt;
}

// verify jwt Correct

export function VERIFY_JWT_VALIDITY(jwt) {
  // try and fetch the job to complete
  try {
    // decode
    const decoded = jwt_decode(jwt);
    // verify
    if (decoded) {
      return [true, decoded];
    }
    //
    return [false, {}];
  } catch (error) {
    return [false, {}];
  }
}
