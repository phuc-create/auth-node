import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { signOut } from "../helper/auth";

const Admin = ({ history }) => {
  //STATE HERE/////////////////
  const [admin, setAdmin] = useState({});

  //LOGIC BELLOW///////////////

  const logOutAccount = () => {
    signOut();
    history.push("/login");
  };
  useEffect(() => {
    setAdmin(JSON.parse(localStorage.getItem("token")));
  }, []);
  return (
    <div>
      {admin && admin.role === "admin" ? null : <Redirect to="/login" />}
      <h1 className="display-3 mb-5">Welcome to admin page</h1>
      <div className="card">
        <h5 className="card-header">Hello : {admin.username}</h5>
        <div className="card-body">
          <h5 className="card-title">Your supper ID: {admin._id}</h5>
          <p className="card-text">Email:{admin.email}</p>
          <Link to="/" className="btn btn-primary btn-lg active">
            Go somewhere
          </Link>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-danger mt-3 btn-lg active"
        onClick={logOutAccount}
      >
        Log out
      </button>
    </div>
  );
};

export default Admin;
