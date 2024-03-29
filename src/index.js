import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import {BrowserRouter, Route} from "react-router-dom";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";
import App from "./components/App";
import Signup from "./components/auth/Signup";
import Signout from "./components/auth/Signout";
import Signin from "./components/auth/Signin";
import UserProfile from "./components/UserProfile";
import PropertyForm from "./components/PropertForm";
import AdminPage from "./components/AdminPage";
import UsersAdminInfo from "./components/AdminPage/UsersAdminInfo";
import CountriesAdminInfo from "./components/AdminPage/CountriesAdminInfo";
import HomePage from "./components/MainPage";
import ApartmentsPage from "./components/MainPage/ApartmentsPage";
import HomesPage from "./components/MainPage/HomesPage";
import PropertyPage from "./components/PropertyPage";
import AdminsAdminInfo from "./components/AdminPage/AdminsAdminInfo";
import CitiesAdminInfo from "./components/AdminPage/CitiesAdminInfo";
import UpdatePropertyForm from "./components/PropertForm/UpdatePropertyForm";
import RegionsAdminInfo from "./components/AdminPage/RegionsAdminInfo";
import NotificationPage from "./components/NotificationPage";

const store = createStore(
  reducers,
  {
    auth: {authenticated: localStorage.getItem("token")}
  },
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/apartments" component={ApartmentsPage}/>
        <Route exact path="/homes" component={HomesPage}/>
        <Route exact path="/listing/:id"
               component={PropertyPage}/>

        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/signin" component={Signin}/>
        <Route exact path="/signout" component={Signout}/>
        <Route exact path="/profile" component={UserProfile}/>
        <Route exact path="/property/new" component={PropertyForm}/>
        <Route exact path="/property/update/:id" component={UpdatePropertyForm}/>
        <Route exact path="/notifications" component={NotificationPage}/>


        <Route exact path="/admin" component={AdminPage}/>
        <Route exact path="/admin/users" component={UsersAdminInfo}/>
        <Route exact path="/admin/admins" component={AdminsAdminInfo}/>
        <Route exact path="/admin/countries" component={CountriesAdminInfo}/>
        <Route exact path="/admin/cities" component={CitiesAdminInfo}/>
        <Route exact path="/admin/regions" component={RegionsAdminInfo}/>
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector("#root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
