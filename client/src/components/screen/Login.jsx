import axios from "axios";
import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { urlServer } from "../../UrlServer";
import { authenticate, isAuth } from "../helper/auth";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const Login = ({ history }) => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
    redirect: false,
  });
  const { email, password } = login;
  const inputHandler = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const sendGoogleToken = (tokenId) => {
    axios
      .post(`${urlServer}/google/login`, { idToken: tokenId })
      .then((res) => inForm(res))
      .catch((err) => toast.error(err.response.data.error));
  };
  const inForm = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/");
    });
  };
  const sendFacebookToken = (userID, accessToken) => {
    axios
      .post(`${urlServer}/facebook/login`, { userID, accessToken })
      .then((res) => inForm(res))
      .catch((err) => toast.error(err.response.data.error));
  };

  //GET RESPONSE FROM GOOGLE
  const responseGoogle = (response) => {
    // console.log(response);
    sendGoogleToken(response.tokenId);
  };
  //GET RESPONSE FROM FACEBOOK
  const responseFacebook = (response) => {
    // console.log(response);
    sendFacebookToken(response.userID, response.accessToken);
  };
  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(`${urlServer}/login/individual`, { email, password })
      .then((res) => {
        authenticate(res, () => {
          setLogin({ ...login, email: "", password: "" });
        });
        isAuth() && isAuth().role === "admin"
          ? history.push("/admin")
          : history.push("/");
        toast.success(`Hello ${res.data.user.username}, Welcome back!!!`);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };
  return (
    <div className="d-flex justify-content-center align-items-center mt-5 flex-column mw-100">
      {isAuth() ? <Redirect to="/" /> : null}
      <form onSubmit={handleLogin}>
        <p className="text-uppercase">Login</p>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={inputHandler}
            className="form-control"
            placeholder="name@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={inputHandler}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-secondary mb-3  mr-3">
          Login
        </button>

        <div className="alert alert-primary" role="alert">
          Sign up for free,{" "}
          <Link to="/register" className="alert-link">
            Register{" "}
          </Link>
          here.
        </div>
        <div className="alert alert-warning" role="alert">
          Forget password ?{" "}
          <Link to="/user/forget" className="alert-link">
            Click{" "}
          </Link>
          here.
        </div>
      </form>
      <GoogleLogin
        clientId="815129387316-vbmbr77qafmo6co6gm2391dl8beobcdt.apps.googleusercontent.com"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="btn btn-danger mb-3"
          >
            Login with google
          </button>
        )}
      ></GoogleLogin>
      <FacebookLogin
        appId={
          process.env.NODE_ENV === "production"
            ? "260960358882353"
            : "560089991840309"
        }
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className="btn btn-primary mb-3"
          >
            Login with facebook
          </button>
        )}
      />
      <div className="alert alert-warning" role="alert">
        <h4 className="alert-heading">Note!</h4>
        <p>
          You can using all of stuff ,consists of Login by
          Facebook,Google,etc... also try about how email verify working when
          you create new one! Let try for yourself
        </p>
        <hr />
        <p className="mb-0">
          Whenever you need to, be sure to use correct email to keep things nice
          and tidy.
        </p>
      </div>
    </div>
  );
};

export default Login;
