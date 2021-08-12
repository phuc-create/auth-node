import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import axios from "axios";
import { urlServer } from "../../UrlServer";
import { toast } from "react-toastify";
import { isAuth } from "../helper/auth";
const Active = ({ match }) => {
  const [form, setForm] = useState({
    user: "",
    token: "",
    show: true,
  });
  useEffect(() => {
    const checkToken = () => {
      let token = match.params.token;
      let { username } = jwt.decode(token);
      if (token) {
        setForm({ ...form, user: username, token });
      }
    };
    checkToken();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params]);
  const { token } = form;
  const handleSubmitRegister = (e) => {
    e.preventDefault();
    axios
      .post(`${urlServer}/activation`, { token })
      .then((res) => {
        setForm({ ...form, show: false });
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  console.log(form);
  return (
    <div className="d-flex justify-content-center align-items-center mt-5 flex-column mw-100">
      {isAuth() ? (
        <Redirect to="/" />
      ) : (
        <>
          <form onSubmit={handleSubmitRegister}>
            <p className="text-uppercase">Click button to active</p>
            <button type="submit" className="btn btn-secondary mb-3">
              Active your account
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
              Facebook,Google,etc... also try about how email verify working
              when you create new one! Let try for yourself
            </p>
            <hr />
            <p className="mb-0">
              Whenever you need to, be sure to use correct email to keep things
              nice and tidy.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Active;
