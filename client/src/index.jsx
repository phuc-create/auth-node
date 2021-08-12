import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import Home from "./components/screen/Home";
import Register from "./components/screen/Register";
import Login from "./components/screen/Login";
import Active from "./components/screen/Active";
import ForgetPassword from "./components/screen/ForgetPassword";
import ResetPassword from "./components/screen/ResetPassword";
import PrivateRouter from "./components/private/PrivateRouter";
import Admin from "./components/admin/Admin";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App>
        <Switch>
          <PrivateRouter exact path="/" component={Home} />
          <PrivateRouter exact path="/admin" component={Admin} />
          <Route
            exact
            path="/user/forget"
            render={(props) => <ForgetPassword {...props} />}
          />
          <Route
            exact
            path="/register"
            render={(props) => <Register {...props} />}
          />
          <Route exact path="/login" render={(props) => <Login {...props} />} />
          <Route
            exact
            path="/users/activate/:token"
            render={(props) => <Active {...props} />}
          />
          <Route
            exact
            path="/users/password/reset/:token"
            render={(props) => <ResetPassword {...props} />}
          />
        </Switch>
      </App>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
