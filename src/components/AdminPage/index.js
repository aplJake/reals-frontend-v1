import React, {useState, useEffect, Fragment} from "react"
import requireAuth from "../requireAuth";
import Axios from "axios";
import decode from "jwt-decode";
import {Link, Redirect} from "react-router-dom";
import styled from "styled-components";
import {Button, Table} from "react-bootstrap";

export const SideNav = styled.div`
  padding-top: 80px;
  padding-left: 80px;
  height: 100%;
  width: 200px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #f7f6f6;
  overflow-x: hidden;
  
  a {
    padding: 8px 15px 8px 0;
    // text-decoration: none;
    font-size: 16px;
    color: black;
    display: block;
  }
 
`;

export const MainSidebarContent = styled.div`
  margin-left: 200px;
  padding: 0 60px;
  table {
    margin-top: 30px;
    tr, td, th {
      padding: 5px;
      font-size: 16px;
    }
    
    button {
      &.on-full-width {
         width: 100%;
      }
      margin-right: 5px;
    }
  }
  
`;




export const ListingsAdminInfo = ({props}) => (
  <AdminWrapper>
    Listings info
  </AdminWrapper>
);

export const CountriesAdminInfo = ({props}) => (
  <AdminWrapper>
    Countries info
  </AdminWrapper>
);

const WrapperDiv = styled.div`
  margin-top: 80px;
`
export const AdminWrapper = ({children, adminUserType}) => (
  <WrapperDiv>
    <SideNav>
      {adminUserType === 'SUPER_USER' && (
        <Fragment>
          <Link to={`/admin/users`}>Users</Link>
          <Link to={`/admin/admins`}>Admins</Link>
        </Fragment>
      )}
      <Link to={`/admin/countries`}>Countries</Link>
      <Link to={`/admin/cities`}>Cities</Link>
    </SideNav>
    <MainSidebarContent>
      {children}
    </MainSidebarContent>
  </WrapperDiv>
);

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageAccess: false,
      userId: "",
      tokenPayload: "",
    }
  }

  componentDidMount() {
    const { auth } = this.props;

    // Decode JWT data and get User Id
    let token = decode(auth);

    this.setState({
      userId: token.UserId,
      tokenPayload: token,
      pageAccess: token.IsAdmin,
    });


    if (token.IsAdmin) {
      console.log("Is Authenticated")

      if(token.UserId == null) {
        console.log("Token iss null")
      } else {

        // Axios
        //   .get(`http://localhost:2308/api/admin/${token.UserId}`)
        //   .then(response => {
        //     console.log(response);
        //     // if (this.isMounted()) {
        //     //   this.setState({
        //     //     userId: token.UserId,
        //     //     pageAccess: token.IsAdmin,
        //     //   })
        //     // }
        //   })
        //   .catch(error => console.log(error));
        console.log("Admin User:", token);
      }

    } else {
      console.log("Is not Authenticated", auth)
    }

  }

  componentWillMount() {
    const { auth } = this.props;

    // Decode JWT data and get User Id
    let token = decode(auth);

    this.setState({
      userId: token.UserId,
      tokenPayload: token,
      pageAccess: token.IsAdmin,
    });
  };

  render() {
    const {pageAccess, tokenPayload} = this.state;

    if(pageAccess && tokenPayload) {
      return(
        <AdminWrapper adminUserType={tokenPayload.UserType}>
          {/*<SideNav>*/}
          {/*  <Link to={`${this.props.match.url}/users`}>Users</Link>*/}
          {/*  <Link to={`${this.props.match.url}/listings`}>Listings</Link>*/}
          {/*  <Link to={`${this.props.match.url}/countries`}>Countries</Link>*/}
          {/*</SideNav>*/}
          <h3>Admin Control Page</h3>
        </AdminWrapper>

      )
    } else {
      // return         <div>You are not an Admin user</div>
      return <Redirect to='/' />
    }

  }
}
export default requireAuth(AdminPage);