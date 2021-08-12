import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import { isAuth } from "../helper/auth";
import { urlServer } from "../../UrlServer";
const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const { username, email, password, password2 } = form;
  const inputHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (username && email && password && password2) {
      if (password === password2) {
        axios
          .post(`${urlServer}/register`, { username, email, password })
          .then((res) => {
            setForm({
              ...form,
              username: "",
              email: "",
              password: "",
              password2: "",
            });
            toast.success(res.data.message);
          })
          .catch((err) => {
            toast.error(err.response.data.error);
          });
      } else {
        toast.error("Password do not match!!!");
      }
    } else {
      toast.error("Information doesn't filled all fields!!!");
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center mt-5 flex-column mw-100">
      {isAuth() ? <Redirect to="/" /> : null}
      <form onSubmit={handleSubmitForm}>
        <p className="text-uppercase">Register</p>
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
          <label>Name</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={inputHandler}
            className="form-control"
            placeholder="Join"
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
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={inputHandler}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-secondary mb-3">
          Register
        </button>
        <div className="alert alert-primary" role="alert">
          Already have an account,{" "}
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

export default Register;
