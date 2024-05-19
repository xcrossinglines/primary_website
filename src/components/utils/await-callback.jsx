//
export async function AwaitCallBack(callback, timout = 1000) {
  return new Promise((solve) => setTimeout(solve, timout)).then(callback);
  //
}
