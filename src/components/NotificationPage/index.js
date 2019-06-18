import React from 'react';
import requireAuth from "../requireAuth";
import {Alert, Container} from "react-bootstrap";
import styled from "styled-components";
import Axios from "axios";
import decode from "jwt-decode";

const SPageBase = styled.div`
  background: #f6f6f6;
`;
const SSection = styled.div`
  min-height: 100px;
  background: white;
  margin-bottom: 5px;
  padding: 10px 0;
  
  p {
    margin-top: 5px;
    font-weight: 300;
  }
  
  button {
    width: 180px;
  }
  
  .tiny-description {
    font-size: 13px;
    font-weight: 300;
  }
  
`;

const SSectionZMargin = styled(SSection)`
  margin-bottom: 0;
`;

const SSectionListing = styled(SSectionZMargin)`
  border-bottom: 1px solid #bbbbbb;
  button {
    margin-bottom: 5px;
  };
`;

const SSectinHeaderWrapper = styled.div`
    padding: 20px 20px 20px 0;

`;
const SSectionH4 = styled.h4`
  font-weight: 400;
`;

const SSectionH5 = styled.h5`
  font-weight: 400;
`;

class NotificationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenPayload: '',
      notifications: [],
      update: false,
    }
  }

  componentWillMount() {
    const {auth} = this.props;
    let token = decode(auth);
    this.setState({
      ...this.state,
      tokenPayload: token
    });

    Axios
      .get(`http://localhost:2308/api/notifications/${token.UserId}`)
      .then(response => {
        console.log("Response for notifications", response.data);
        this.setState({
          notifications: response.data.notifications
        })
      })
      .catch(error => console.log(error));
  }

  handleNotificationRemove = (notificationID) => {
    Axios
      .delete(`http://localhost:2308/api/notifications/${notificationID}`)
      .then(response => {
        console.log("Response for notifications", response.data);
        this.setState({
          state: this.state
        })
      })
      .catch(error => console.log(error));
  };

  render() {
    let notificationList;
    if (this.state.notifications.length > 0) {
      notificationList = this.state.notifications.map((n) =>
        <Alert key={n.notification_id}
               variant="danger"
               onClose={() => {
                 this.handleNotificationRemove(n.notification_id)
               }}
               dismissible
        >
          Message: {n.text} Added: {new Date(n.created_at).toDateString()}
        </Alert>
      )
    }


    return (
      <SPageBase>
        <SSection>
          <Container>
            <SSectinHeaderWrapper>
              <SSectionH4>Profile notifications</SSectionH4>
            </SSectinHeaderWrapper>
            {this.state.notifications.length > 0 ? (
              <React.Fragment>
                {notificationList}
              </React.Fragment>
            ) : (
              <SSectionH5>You dont have any messages</SSectionH5>
            )}
          </Container>
        </SSection>

      </SPageBase>
    )
  }
}

export default requireAuth(NotificationPage)