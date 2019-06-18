import axios from "axios";
import {AUTH_ERROR, AUTH_USER} from "./types";

export const signup = (formProps, callback) => async dispatch => {
  let response;
  try {
    response = await axios.post(
      "http://localhost:2308/api/signup",
      formProps
    );

    console.log("signup token", response.data);


    dispatch({type: AUTH_USER, payload: response.data.account.token});
    localStorage.setItem("token", response.data.account.token);
    callback();
  } catch (e) {
    dispatch({type: AUTH_ERROR, payload: response.data.message});
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

    dispatch({type: AUTH_USER, payload: response.data.account.token});
    localStorage.setItem("token", response.data.account.token);
    callback();
  } catch (e) {
    dispatch({type: AUTH_ERROR, payload: "Invalid login credentials"});
  }
};

export const signout = () => {
  localStorage.removeItem("token");

  return {
    type: AUTH_USER,
    payload: ""
  };
};
