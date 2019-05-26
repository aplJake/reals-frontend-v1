import requireAuth from "../requireAuth";
import decode from "jwt-decode";
import Axios from "axios";
import {Button, Table} from "react-bootstrap";
import React from "react"
import {AdminWrapper} from "./index";

class CountriesAdminInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      tokenPayload: "",
    }
  }

  componentWillMount() {
    const { auth } = this.props;
    let token = decode(auth);
    this.setState({
      ...this.state,
      tokenPayload: token
    });

    Axios
      .get(`http://localhost:2308/api/admin/${token.UserId}/listings`)
      .then(response => {
        console.log(response);
        this.setState({
          ...this.state,
          listings: response.data.listings,
        })
      })
      .catch(error => console.log(error));

    console.log("Result of API Get", this.state)
  }



  render() {
    return(
      <AdminWrapper>
        <Table responsive striped bordered hover>
          <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {this.state.listings.map(item => (
            <ListingTableItem key={item.user_id} listings={item} adminId={this.state.tokenPayload.UserId} />
          ))}
          </tbody>
        </Table>
      </AdminWrapper>
    );
  }
};

class ListingTableItem extends React.Component {
  constructor(props) {
    super(props);

  }

  // Delete admin action
  createAdminUserHandler = () => {
    Axios
      .post(`http://localhost:2308/api/admin/${this.props.adminId}/listings`,
        this.props.user
      )
      .then(response => {
        console.log("POST23", response);
      })
      .catch(error => console.log(error));
  };

  render() {
    return(
      <tr>
        <td>{this.props.listing.user_id}</td>
        <td>{this.props.listing.user_name}</td>
        <td>{this.props.listing.email}</td>
        <td>{this.props.listing.password}</td>
        <td>
          <Button onClick={this.createAdminUserHandler}>Remove</Button>
        </td>
      </tr>
    )
  }
}
export default requireAuth(CountriesAdminInfo);
