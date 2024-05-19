import React from "react";
import { Routes, Route } from "react-router-dom";

//pages
// import { Main } from "../pages/main";

// framer motion
import { AnimatePresence } from "framer-motion";

// strings
import { ROUTE_LINKS } from "./strings";
// lazy loader
import { LazyLoading } from "./lazy_loading";

// lazy loading  import { Jobs } from "../pages/jobs";
// import { SignIn } from "../pages/signin";
// import { Register } from "../pages/register";
// import { ResetAccount } from "../pages/reset-account";
// import { Profile } from "../pages/profile";
// import { FAQ } from "../pages//faq";
// import { FeedBack } from "../pages/feedbacks";
// import { CreateJob } from "../pages/create-job";
// import { UpdateJob } from "../pages/update-job";
// import { ResetPassword } from "../pages/reset-password";
// import { CustomerCompleteJob } from "../pages/complete-job";
// import { PageNotFound } from "../pages/page-not-found";

const Main = React.lazy(() => import("../pages/main"));
const Jobs = React.lazy(() => import("../pages/jobs"));
const SignIn = React.lazy(() => import("../pages/signin"));
const Register = React.lazy(() => import("../pages/register"));
const ResetAccount = React.lazy(() => import("../pages/reset-account"));
const Profile = React.lazy(() => import("../pages/profile"));
const FAQ = React.lazy(() => import("../pages/faq"));
const FeedBack = React.lazy(() => import("../pages/feedbacks"));
const CreateJob = React.lazy(() => import("../pages/create-job"));
const UpdateJob = React.lazy(() => import("../pages/update-job"));
const ResetPassword = React.lazy(() => import("../pages/reset-password"));
const CustomerCompleteJob = React.lazy(() => import("../pages/complete-job"));
const PageNotFound = React.lazy(() => import("../pages/page-not-found"));

//
// export
export function AnimatedRoutes() {
  // location
  return (
    <AnimatePresence>
      <Routes>
        <Route
          path={ROUTE_LINKS.home}
          element={
            <LazyLoading>
              <Main />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.jobs}
          element={
            <LazyLoading>
              <Jobs />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.signin}
          element={
            <LazyLoading>
              <SignIn />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.signup}
          element={
            <LazyLoading>
              <Register />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.profile}
          element={
            <LazyLoading>
              <Profile />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.faqs}
          element={
            <LazyLoading>
              <FAQ />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.feedback}
          element={
            <LazyLoading>
              <FeedBack />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.create_job}
          element={
            <LazyLoading>
              <CreateJob />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.update_job}
          element={
            <LazyLoading>
              <UpdateJob />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.reset_password}
          element={
            <LazyLoading>
              <ResetPassword />
            </LazyLoading>
          }
        />
        <Route
          path={ROUTE_LINKS.complete_job}
          element={
            <LazyLoading>
              <CustomerCompleteJob />
            </LazyLoading>
          }
        />
        <Route
          path={`${ROUTE_LINKS.reset_account}`}
          element={
            <LazyLoading>
              <ResetAccount />
            </LazyLoading>
          }
        />
        <Route
          path="*"
          element={
            <LazyLoading>
              <PageNotFound />
            </LazyLoading>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
