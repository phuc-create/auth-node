import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "../helper/auth";

const PrivateRouter = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth() ? <Component {...rest} {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
export default PrivateRouter;
