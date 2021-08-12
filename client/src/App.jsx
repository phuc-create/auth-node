import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
const App = ({ children }) => {
  return <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
    <ToastContainer />
    {children}</div>;
};

export default App;
