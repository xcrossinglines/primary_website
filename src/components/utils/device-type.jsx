import { ScreenSize } from "./responsive";
import { DEVICE_TYPE } from "./strings";

// export
export function DeviceType() {
  //
  let sType = ScreenSize();

  // check
  if (sType > 0 && sType <= 576) return DEVICE_TYPE.mobile;
  else if (sType > 576 && sType <= 768) return DEVICE_TYPE.tablet;
  else if (sType > 768 && sType <= 992) return DEVICE_TYPE.desktop;
  else if (sType > 992 && sType < 1200) return DEVICE_TYPE.xl_device;
  else return DEVICE_TYPE.xxl_device;
}
