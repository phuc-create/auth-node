import axios from "axios";
import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { urlServer } from "../../UrlServer";
import { authenticate, isAuth } from "../helper/auth";

const ForgotPassword = () => {
  const [login, setLogin] = useState({
    email: "",
  });
  const { email } = login;
  const inputHandler = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const handleForgetPassword = (e) => {
    e.preventDefault();
    if (email) {
      axios
        .put(`${urlServer}/forget`, { email })
        .then((res) => {
          authenticate(res, () => {
            setLogin({ ...login, email: "", password: "" });
          });
          toast.success("Please check email");
          console.log(res.data);
        })
        .catch((err) => toast.error(err.response.data.error));
    } else {
      toast.error("Enter valid email");
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center mt-5 flex-column mw-100">
      {isAuth() ? <Redirect to="/" /> : null}
      <form onSubmit={handleForgetPassword} className="w-100 p-3">
        <p className="text-uppercase">Forget Password</p>
        <div className="form-group">
          <label>Your email address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={inputHandler}
            className="form-control"
            placeholder="name@example.com"
          />
        </div>
        <button type="submit" className="btn btn-secondary mb-3">
          Verify Email
        </button>
        <div className="alert alert-primary" role="alert">
          Back to{" "}
          <Link to="/login" className="alert-link">
            Login{" "}
          </Link>
          now.
        </div>
      </form>
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

export default ForgotPassword;
