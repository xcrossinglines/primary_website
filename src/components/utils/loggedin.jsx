// export
export function IS_LOGGED_IN() {
  try {
    const userToken = JSON.parse(localStorage.getItem("xcrossinglines_tokens"));
    if (userToken) return [true, userToken];
    return [false, null];
  } catch (error) {
    return [false, null];
  }
}
