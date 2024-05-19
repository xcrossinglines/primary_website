// import images
import delivery from "../../images/delivery.svg";
import gardenRefuse from "../../images/garden-refuse.svg";
import home from "../../images/home.svg";

// whychoose us images
import cost from "../../images/cost.svg";
import damageTolerance from "../../images/damage-tolerance.svg";
import ppe from "../../images/ppe.svg";
import quote from "../../images/quote.svg";
import maintainedVehicles from "../../images/maintained-vehicles.svg";
import cancellationFee from "../../images/cancellation-fee.svg";

// vehicle images
import OneTon from "../../images/one_ton.svg";
import OnePointFiveTon from "../../images/one_point_five_ton.svg";
import TwoTon from "../../images/two_ton.svg";
import FourTon from "../../images/four_ton.svg";
import EightTon from "../../images/eight_ton.svg";

//enums
export const ScrollDirection = {
  up: "up",
  down: "down",
};

//
export const VEHICLE_TYPE = [
  {
    img: OneTon,
    size: 1.0,
    description:
      "is good when loading a double bed, single door fridge, a washing machine, dishwasher or a tumble dryer and a few other stuff e.g boxes and plastics.",
  },
  {
    img: OnePointFiveTon,
    size: 1.5,
    description:
      "is good when loading a double bed, 2 or 3 seater couch, double door fridge, a washing machine and a few other items e.g boxes and plastics.",
  },
  {
    img: TwoTon,
    size: 2.0,
    description:
      "is suitable for small 2 bedroom apartment, 2x queen size beds, 3 or 2 sitter couch, standard size fridge, washing machine, TV stand and a few boxes.",
  },
  {
    img: FourTon,
    size: 3.0,
    description:
      "is suitable for 2 bedrooms, kitchen, sitting and dinning room and a few boxes/small items.",
  },
  {
    img: FourTon,
    size: 4.0,
    description:
      "is suitable for 3 bedrooms, kitchen, sitting and dinning room and a few boxes/small items.",
  },
  {
    img: EightTon,
    size: 8.0,
    description:
      "is suitable when moving more big items especially when moving a 2 or 3 bedroom house with kitchen, sitting and dining rooms.",
  },
];

// shuttle
export const SHUTTLE_SERVICE = [
  {
    value: 0,
    caption: "None",
    description: "Shuttle not required",
  },
  {
    value: 1,
    caption: "Pick up",
    description: "Shuttle at pick up",
  },

  {
    value: 2,
    caption: "Drop off",
    description: "Shuttle at drop off",
  },

  {
    value: 3,
    caption: "Both",
    description: "Shuttle at pick up and drop off",
  },
];
// ourservices
export const OUR_SERVICES = [
  {
    image: home,
    caption: "Furniture Removal",
    description:
      "We do local and long distance furniture/any goods transportation.",
  },
  {
    image: delivery,
    caption: "Purchased Deliveries",
    description:
      "Need to buy something from a shop, warehouse, hardware, etc ... and you dont have transport? please get in touch with us and we will collect and have it delivered to your doorstep. Do you own a small business and struggling to get your products delivered to your customers and clients? we are the solution to that.",
  },
  {
    image: gardenRefuse,
    caption: "Household Refuse",
    description:
      "We collect unwanted household items and your garden refuse to a dumpsite of your choice.",
  },
];

export const WHY_CHOOSE_US = [
  {
    img: quote,
    caption: "Instant Quote",
    description:
      "You get a free instant quote displayed on your screen within minutes",
  },
  {
    img: damageTolerance,
    caption: "0 Loss and Damage Tolerance",
    description:
      "We handle your items with care to avoid scratches and being damaged",
  },

  {
    img: cost,
    caption: "Cost",
    description: "We are a cost saving option in the moving industry",
  },

  {
    img: ppe,
    caption: "Protective Gear",
    description:
      "We have blankets, straps, nets and tarpaulin to ensure a safe and secured transportation of your goods.",
  },
  {
    img: maintainedVehicles,
    caption: "Maintained Vehicles",
    description:
      "Our vehicles are well maintained to ensure a quick and smooth arrival of your items to your desired destination",
  },
  {
    img: cancellationFee,
    caption: "0 Cancellation Fees",
    description: "We dont have any cancellation fees",
  },
];

// device type
export const DEVICE_TYPE = {
  mobile: "mobile",
  tablet: "tablet",
  desktop: "desktop",
  xl_device: "xl_device",
  xxl_device: "xxl_device",
};

// export notification types
export const NOTIFICATION_TYPE = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
  loading: "loading",
  none: "none",
};

export const ROUTE_LINKS = {
  home: "/",
  jobs: "/jobs",
  signin: "/accounts/signin",
  signup: "/accounts/register",
  profile: "/profile",
  faqs: "/faqs",
  feedback: "/feedback",
  create_job: "/create/job",
  reset_account: "/reset/account",
  update_job: "/jobs/job/:id/update",
  complete_job: "/jobs/job/:pk/create",
  reset_password: "/password/reset/:token",
};

export const ROUTE_DESCRIPTION = {
  0: "Pickup",
  1: "Dropoff",
  2: "Both",
};

export const HEAR_ABOUT_US = {
  none: "None",
  referral: "Referral",
  facebook: "Facebook",
  gumtree: "Gumtree",
};

export const CREATE_JOB_VIEW = {
  vehicle_size: "v-size",
  route: "routes",
  add_info: "add_info",
  quote: "quote",
};

export const CREATE_JOB_VIEW_INDEX = {
  "v-size": 1,
  routes: 2,
  add_info: 3,
  quote: 4,
};
export const CREATE_JOB_VIEW_DESCRIPTION = {
  "v-size":
    "Select vehicle size of your choice, note the descriptions below to help you choose the correct vehicle.",
  routes: "Select pick up and drop off locations for your job.",
  add_info:
    "Optional information for your job, please note! the date and time of the job are required.",
  quote:
    "Thank you for considering xcrossing lines as your go to services provider. If you are happy with the Quote provided click BOOK to complete the booking.",
};

// introduction text
export const INTRODUCTION_COVER_TEXT =
  "Need something moved or transported? look no further, we handle all of the loading and unloading so you don't have to lift a finger.";
export const INTRODUCTION_COVER_TITLE = "Move it smarter with";
export const ABOUTUS =
  "is a furniture removal business that is locally owned and situated in Clayville east Olifantsfontein. It  operates in all over Gauteng, providing residential and commercial transport services. For both residential and business clients, we provide house/office furniture removal, commercial and personal delivery solutions throughout South Africa to and from Gauteng. We are devoted to providing first-rate service. Our skilled drivers and assistants will make your move easier than you could have ever imagined. We also recognize that everyone is experiencing financial hardship as a result of the unsteady national economy, and we have made every effort to avoid emptying your pockets. Our costs will make you grin because they are reasonable considering the excellent service you will receive. We consider that the most crucial thing we do is to deliver quality service.";

// footer
export const EMAIL = "xcrossinglines@gmail.com";
export const LOCATION = "Clayville East Olifantsfontein 1666";
export const CONTACT_NUMBER = "(+27) 72 516 7658 or (+27) 81 816 6146";
export const PRIVACY_POLICY = "copyright 2023 all rights reserved. Webapp";
// Job
export const GOOGLE_API_KEY = "AIzaSyDNQ2E3_QP13cen-7laSH3QHl3gkDPlTLg";
export const DATETIME_ERROR_MESSAGE =
  "Time of the job must be atleast 1 hour 30 minutes prior.";

// money
export const BASE_AMOUNT =
  "Base amount includes additional helper fee, floors to carry up or down fee etc ...";
export const OFFPEAK =
  "Discount given to our customers in the middle of the month.";
export const REFERAL_DISCOUNT =
  "Discount given to any customer who has a referral code as part of his/her job.";

export const RETURN_CUSTOMER = "Discount given to loyal customers.";

export const AMOUNT_DUE = "Amount to be settled by the customer on delivery.";

export const EXTRA_DISCOUNT = "Discount given as an extra to the job created.";
export const PRICE_ADJUSTMENT =
  "Adjustment price value added to the amount due as discussed with customer.";
// coverage
export const COVERAGE_TEXT =
  "Xcrossing Lines operates in all areas of Gauteng(Johannesburg, Pretoria, Randburg, Sandton, Malboro, Centurion etc..)";
export const CLIENT_ID =
  "1059846145286-imt7nc0q2k31pogdesug290ir2lr65bs.apps.googleusercontent.com";

// numeric strings
export const SECTION_HEIGHT = "50px";
