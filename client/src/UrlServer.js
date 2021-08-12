export const urlServer =
  process.env.NODE_ENV === "production"
    ? "https://node-login-v2.herokuapp.com/api"
    : "http://localhost:5000/api";
