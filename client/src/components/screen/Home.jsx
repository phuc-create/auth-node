import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "../helper/auth";
// import { Redirect } from "react-router-dom";
// import { isAuth } from "../helper/auth";

const Home = ({ history }) => {
  //STATE HERE/////////////////
  const [cli, setCli] = useState({});
  //LOGIC BELLOW///////////////
  const logOutAccount = () => {
    signOut();
    history.push("/login");
  };
  useEffect(() => {
    setCli(JSON.parse(localStorage.getItem("token")));
  }, []);
  return (
    <div>
      <h1 className="display-3 mb-5 text-center">Welcome to my project</h1>
      <div className="card text-center">
        <div className="card-header">Hello {cli.username}</div>
        <div className="card-body">
          <h5 className="card-title">Email: {cli.email}</h5>
          <p className="h5 mt-5 mb-5">
            This project takes about login and register system, allow users can
            using Facebook, Google to sign up and sign in, it's easier than
            normal platform right now, so take time for your travel🤗🤗🤗
          </p>
          <Link to="/" className="btn btn-primary">
            Go somewhere
          </Link>
        </div>
        <div className="card-footer text-muted">Your supper ID: {cli._id}</div>
        <div className="card-footer text-muted">Last fixed: 12/08/2021</div>
      </div>
      <button
        type="button"
        className="btn btn-danger mt-3 btn-lg active text-center"
        onClick={logOutAccount}
      >
        Log out
      </button>
    </div>
  );
};

export default Home;
