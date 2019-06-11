import requireAuth from "../requireAuth";
import decode from "jwt-decode";
import Axios from "axios";
import {Button, Table} from "react-bootstrap";
import React from "react"
import {AdminWrapper} from "./index";
import styled from "styled-components";

const SWarningMsg = styled.h5`
  margin-top: 80px;
`

class AdminsAdminInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
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
            .get(`http://localhost:2308/api/admin/${token.UserId}/admins`)
            .then(response => {
                console.log(response);
                this.setState({
                    ...this.state,
                    users: response.data.admins,
                }, () => {console.log("User Admin info is ", this.state.users)})
            })
            .catch(error => console.log(error));

        console.log("Result of API Get", this.state)
    }



    render() {
        if(this.state.users != null && this.state.users.length > 0) {
            return(
                <AdminWrapper>
                    <Table responsive striped bordered hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map(item => (
                            <UserTableItem key={item.user_id} user={item} adminId={this.state.tokenPayload.UserId} />
                        ))}
                        </tbody>
                    </Table>

                </AdminWrapper>
            );
        } else {
            return (
                <AdminWrapper>
                    <SWarningMsg>Admin info is empty</SWarningMsg>
                </AdminWrapper>
            )
        }

    }
};

class UserTableItem extends React.Component {
    constructor(props) {
        super(props);
    }

    createAdminUserHandler = () => {
        console.log("Current user is ", this.props.user)
        // Axios
        //     .delete(`http://localhost:2308/api/admin/${this.props.adminId}/admins`,
        //         {user_id: this.props.user.user_id}
        //     )
        //     .then(response => {
        //         console.log("On DELETE response", response);
        //     })
        //     .catch(error => console.log(error));

        Axios
            .delete(`http://localhost:2308/api/admin/${this.props.adminId}/admins/${this.props.user.user_id}`)
            .then(response => {
                console.log("POST", response);
            })
            .catch(error => console.log(error));
    };

    render() {
        return(
            <tr>
                <td>{this.props.user.user_id}</td>
                <td>{this.props.user.user_name}</td>
                <td>{this.props.user.email}</td>
                <td>
                    <Button onClick={this.createAdminUserHandler}>Remove Admin</Button>
                </td>
            </tr>
        )
    }
}
export default requireAuth(AdminsAdminInfo);
