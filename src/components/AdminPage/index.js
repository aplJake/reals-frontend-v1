import React from "react"
import requireAuth from "../requireAuth";
import Axios from "axios";
import decode from "jwt-decode";
import {Link, Redirect} from "react-router-dom";
import styled from "styled-components";
import divWithClassName from "react-bootstrap/es/utils/divWithClassName";
import {Table} from "react-bootstrap";

export const SideNav = styled.div`
  height: 100%;
  width: 200px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #f7f6f6;
  overflow-x: hidden;
  padding-top: 60px;
  
  a {
    padding: 8px 15px;
    // text-decoration: none;
    font-size: 16px;
    color: black;
    display: block;
  }
`;

export const MainSidebarContent = styled.div`
  margin-left: 200px;
  padding: 0 60px;
`;

export const UsersAdminInfo = ({props}) => (
  <AdminWrapper>
    User info
  </AdminWrapper>
);

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

export const AdminWrapper = ({children}) => (
  <div>
    <SideNav>
      <Link to={`/admin/users`}>Users</Link>
      <Link to={`/admin/listings`}>Listings</Link>
      <Link to={`/admin/countries`}>Countries</Link>
    </SideNav>
    <MainSidebarContent>
      {children}
    </MainSidebarContent>
  </div>
);

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageAccess: false,
      userId: "",
    }
  }

  componentDidMount() {
    const { auth } = this.props;

    // Decode JWT data and get User Id
    let token = decode(auth);

    this.setState({
      userId: token.UserId,
      pageAccess: token.IsAdmin,
    });


    if (token.IsAdmin) {
      console.log("Is Authenticated")

      if(token.UserId == null) {
        console.log("Token iss null")
      } else {

        Axios
          .get(`http://localhost:2308/api/admin/${token.UserId}`)
          .then(response => {
            console.log(response);
            // if (this.isMounted()) {
            //   this.setState({
            //     userId: token.UserId,
            //     pageAccess: token.IsAdmin,
            //   })
            // }
          })
          .catch(error => console.log(error));
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
      pageAccess: token.IsAdmin,
    });
  };

  render() {
    const {pageAccess} = this.state;

    if(pageAccess) {
      return(
        <div>
          {/*<SideNav>*/}
          {/*  <Link to={`${this.props.match.url}/users`}>Users</Link>*/}
          {/*  <Link to={`${this.props.match.url}/listings`}>Listings</Link>*/}
          {/*  <Link to={`${this.props.match.url}/countries`}>Countries</Link>*/}
          {/*</SideNav>*/}

          <AdminWrapper>
            <Table responsive striped bordered hover>
              <thead>
              <tr>
                <th>#</th>
                <th>Table heading</th>
                <th>Table heading</th>
                <th>Table heading</th>
                <th>Table heading</th>
                <th>Table heading</th>
                <th>Table heading</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>1</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
              </tr>
              </tbody>
            </Table>
          </AdminWrapper>
        </div>

      )
    } else {
      // return         <div>You are not an Admin user</div>
      return <Redirect to='/' />
    }

  }
}

export default requireAuth(AdminPage);