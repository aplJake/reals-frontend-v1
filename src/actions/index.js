import axios from "axios";
import { AUTH_USER, AUTH_ERROR } from "./types";

export const signup = (formProps, callback) => async dispatch => {
  try {
    const response = await axios.post(
      "http://localhost:2308/api/signup",
      formProps
    );

    // console.log("signup", response);
    // console.log("signup token", response.data);
    // console.log("signup a token", response.data.account);
    // console.log("signup a 2 token", response.data.account.token);


    // console.log("signup token", response.data.token);
      

    dispatch({ type: AUTH_USER, payload: response.data.account.token });
    localStorage.setItem("token", response.data.account.token);
    callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Email in use" });
  }
};

export const signin = (formProps, callback) => async dispatch => {
  try {
    const response = await axios.post(
      "http://localhost:2308/api/signin",
      formProps
    );

    console.log("signin", response);
    console.log("signin token", response.data.token);

    dispatch({ type: AUTH_USER, payload: response.data.account.token });
    localStorage.setItem("token", response.data.account.token);
    callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Invalid login credentials" });
  }
};

export const signout = () => {
  localStorage.removeItem("token");

  return {
    type: AUTH_USER,
    payload: ""
  };
};