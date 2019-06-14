import React from "react";
import {Button, Container, Row} from "react-bootstrap";
import styled from "styled-components";
import Axios from "axios";
import Col from "react-bootstrap/Col";


const SSectionH4 = styled.h4`
  font-weight: 500;
  font-size: 18px;
  color: #353535;
`;
const SSectionH5 = styled.h5`
  font-weight: 400;
  font-size: 14px;
  line-height: 12px;
  color: #333333;
  &.primary-h {
    color: blue;
    font-weight: 400;
  }
`;
const SSectinWrapper = styled.div`
    margin: 10px auto;
`;

const SContainer = styled.div`
  button {
    min-width: 100px;
    width: 100%;
  }
  
  .btn-wrapper {
    margin: 0 auto;
  }
  .container {
    margin: 20px 10px;
    padding: 0 30px 30px;
    max-width: 300px;
    position: fixed;
    background: red;
    border-radius: 5px;
    background: #f5f5f5;
    -webkit-box-shadow: 0 4px 5px -6px #999;
    -moz-box-shadow: 0 4px 5px -6px #999;
    box-shadow: 0 4px 5px -6px #999;
  }
`;

class PropertyQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      profileData: {
          queue: [],
          profile: {
            profile_description: {string: "", valid: ""},
            telephone_number: {string: "", valid: ""},
            user_name: "",
            user_email: "",
          }
      },
    }
  };

  handleButtonClick = () => {
    if(!this.state.isOpened) {
      this.setState({isOpened: true});
      this.getQueueData();
    } else {
      this.addNewUserToQueue();
    }
  };

  getQueueData = () => {
    Axios
      .get(`http://localhost:2308/api/pages/data/${this.props.propertyID}/queue`)
      .then(response => {
        console.log(response);

        this.setState({
          profileData: response.data.property_queue_data,
        }, () => {console.log("queued data", this.state.profileData)});
      })
      .catch(error => console.log(error));

    // console.log("value", this.state.profileData.profile.profile_description.String)
  };

  addNewUserToQueue = () => {

  };

  renderProfileNullableData = () => {
    if(this.state.isOpened && this.state.profileData.profile.user_name.length > 0) {
      return (
        <React.Fragment>
          <Row>
            <Col>{this.state.profileData.profile.telephone_number.string}</Col>
          </Row>
          <Row>
            <Col>{this.state.profileData.profile.profile_description.string}</Col>
          </Row>
        </React.Fragment>
      )
    }
  };

  render() {
    let queueProfile = null;
    let queueMap;

    if(this.state.isOpened && this.state.profileData.queue != null && this.state.profileData.queue.length > 0) {
      queueMap = this.state.profileData.queue.map((q) =>
          <Row key={q.user_name}>
            <Col md={4}><SSectionH5>{q.user_name}</SSectionH5></Col>
            <Col md={8}><SSectionH5>{new Date(q.queue_time).toLocaleTimeString()}</SSectionH5></Col>
          </Row>
      )
    }

    let {user_name, user_email, telephone_number, profile_description} = this.state.profileData.profile;
    return (
      <Col>
        <SContainer>
          <Container>
            <Row>
              <SSectinWrapper>
                <SSectionH4>PropertyQueue</SSectionH4>
              </SSectinWrapper>
            </Row>
            {this.state.isOpened && (
              <React.Fragment>
                <Row>
                  <Col>
                    <Row>
                      <Col md={4}><SSectionH5 className={"primary-h"}>Seller</SSectionH5></Col>
                      <Col md={8}><SSectionH5>{user_name}</SSectionH5></Col>
                    </Row>
                    <Row>
                      <Col md={4}><SSectionH5 className={"primary-h"}>Email</SSectionH5></Col>
                      <Col md={8}><SSectionH5>{user_email}</SSectionH5></Col>
                    </Row>
                    {this.renderProfileNullableData}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr/>
                    <Row>
                      <Col md={4}><SSectionH5 className={"primary-h"}>Buyer</SSectionH5></Col>
                      <Col md={8}><SSectionH5 className={"primary-h"}>Watch time</SSectionH5></Col>
                    </Row>
                    {queueMap}
                  </Col>
                </Row>
              </React.Fragment>
            )}
            <Row>
              <Col sm={8} md={8} className={"btn-wrapper"}>
                <Button primary onClick={()=>{this.handleButtonClick()}}>
                  {this.state.isOpened ? ("Add"):("Show")}
                </Button>
              </Col>
            </Row>
          </Container>
        </SContainer>
      </Col>
    );
  }
}

export default PropertyQueue;