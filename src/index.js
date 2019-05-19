import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";
import App from "./components/App";
import Welcome from "./components/Welcome";
import Signup from "./components/auth/Signup";
import Signout from "./components/auth/Signout";
import Signin from "./components/auth/Signin";
import UserProfile from "./components/UserProfile";
import PropertyForm from "./components/PropertForm";
import AdminPage, {
  AdminWrapper,
  CountriesAdminInfo,
  ListingsAdminInfo,
  SideNav,
  UsersAdminInfo
} from "./components/AdminPage";

const store = createStore(
  reducers,
  {
    auth: { authenticated: localStorage.getItem("token") }
  },
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={Welcome} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/signout" component={Signout} />
        <Route path="/signin" component={Signin} />
        <Route path="/property/new" component={PropertyForm} />
        <Route path="/admin" component={AdminPage}/>
        <Route path="/admin/users" component={UsersAdminInfo}/>
        <Route path="/admin/countries" component={CountriesAdminInfo}/>
        <Route path="/admin/listings" component={ListingsAdminInfo}/>
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector("#root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
