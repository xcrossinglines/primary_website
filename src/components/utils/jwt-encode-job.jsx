import jwt_encode from "jwt-encode";
import jwt_decode from "jwt-decode";

// encode
export function ENCODE_CREATE_JOB_JWT(data) {
  // const
  const secretKey = "xcrossinglines";
  const jwt = jwt_encode(data, secretKey);

  // save the jwt locally
  localStorage.setItem("create-job", JSON.stringify(jwt));
}

//
// check if jwt_encoded version exists
export function GET_JWT_JOB() {
  //
  try {
    // find
    const createJob = JSON.parse(localStorage.getItem("create-job"));
    if (createJob) {
      // then return with
      const decodedPayload = jwt_decode(createJob);
      return [true, decodedPayload];
    }
    // this means wasnt successful
    return [false, {}];
  } catch (error) {
    return [false, {}];
  }
}

//
//
export function RETRIEVE_JWT_JOB() {
  //
  try {
    // find
    const createJob = JSON.parse(localStorage.getItem("create-job"));
    if (createJob) {
      return [true, createJob];
    }
    // this means wasnt successful
    return [false, {}];
  } catch (error) {
    return [false, {}];
  }
}

// get complete jwt job
export function GET_VERIFIED_JWT_JOB() {
  //
  try {
    // find
    const createJob = JSON.parse(localStorage.getItem("create-job"));
    if (createJob) {
      // then return with
      const decodedPayload = jwt_decode(createJob);
      // verify
      if (
        decodedPayload.vehicle_size &&
        decodedPayload.distance &&
        decodedPayload.helpers
      ) {
        //
        return [true, decodedPayload];
      }
      return [false, {}];
    }
    // this means wasnt successful
    return [false, {}];
  } catch (error) {
    return [false, {}];
  }
}
