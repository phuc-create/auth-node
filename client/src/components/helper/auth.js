import cookie from "js-cookie";
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, {
      expires: 1,
    });
  }
};
export const getCookie = (key) => {
  if (window !== "undefined") {
    const check = cookie.get(key);
    if (check) {
      return true;
    } else {
      return false;
    }
  }
};
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("token", response.data.user);
  next();
};
export const signOut = () => {
  removeCookie("token");
  removeLocalStorage("token");
};
export const isAuth = () => {
  if (window !== "undefined") {
    let cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("token")) {
        return JSON.parse(localStorage.getItem("token"));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};
export const updateUserData = (response, next) => {
  if (window !== "undefined") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response.data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
