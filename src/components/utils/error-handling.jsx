import { STATUS } from "./status";
import { NOTIFICATION_TYPE } from "./strings";

export function ErrorHandling(e, setNotification) {
  // set
  if (e.response) {
    let msg;
    const statuscode = e.response.status;
    if (statuscode >= 500) {
      // ... handle internal server errors
      msg = "Internal server error. Contact admin";
      setNotification(NOTIFICATION_TYPE.error, "Oops!", msg);
      return;
    } else if (e.response.data.detail) {
      // handle 400 range errors with msg
      msg = `${STATUS[statuscode]}, ${e.response.data.detail}`;
      setNotification(NOTIFICATION_TYPE.error, "Oops!", msg);
    } else if (e.response.data.msg) {
      // ... handle 400 range errors with msg
      msg = `${STATUS[statuscode]}, ${e.response.data.msg}`;
      setNotification(NOTIFICATION_TYPE.error, "Oops!", msg);
    } else if (e.response.data.email) {
      // ... handle 400 range errors with msg
      msg = `${STATUS[statuscode]}, ${e.response.data.email}`;
      setNotification(NOTIFICATION_TYPE.error, "Oops!", msg);
    } else {
      // ... handle 400 range errors without msg
      msg = `${STATUS[statuscode]}`;
      setNotification(NOTIFICATION_TYPE.error, "Oops!", msg);
    }
  } else if (e.request) {
    setNotification(NOTIFICATION_TYPE.error, "Oops!", e.request);
  } else {
    setNotification(NOTIFICATION_TYPE.error, "Oops!", e.message);
  }
}
