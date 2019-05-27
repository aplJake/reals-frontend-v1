import React, { Component } from "react";
import requireAuth from "../requireAuth";
import decode from "jwt-decode";
import axios from "axios";
import UserProfileForm from "./components/UserProfileForm";
import { Container, Col, Button, Row, Jumbotron } from "react-bootstrap";
import styled from "styled-components";
import {Link} from "react-router-dom";

const ListingItemStyle = styled.div`
  margin: 8px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  h4 {
    font-size: 20px;
    font-weight: 600;
    color: #565656;
  }
  h5 {
    font-weight: 500;
    font-size: 16px;
    color: #333333;
  }

  h6 {
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    margin-top: 6px;
  }

  .listing-wrapper {
    padding: 10px;
  }

  .h-listing-name {
    margin-top: 6px;
    // margin-left: 10px;
  }

  .h-listing-facilities {
    margin-right: 10px;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
`;
const ListingItem = ({ listingData }) => (
  <ListingItemStyle>
    <div className="listing-wrapper">
      <Row className="h-listing-name">
        <Col md="10">
          <h5>Listing long description text about the apratment</h5>
        </Col>
        <Col className="h-listing-price to-right">
          <h4 className="to-right">$2500</h4>
        </Col>
      </Row>
      <Row className="h-listing-name">
        <Col>
          <span className="h-listing-facilities">2bd</span>
          <span className="h-listing-facilities">Bathroom</span>
          <span className="h-listing-facilities">TV</span>
        </Col>
      </Row>
      <Row className="h-listing-name">
        <Col md="10">
          <h6>Added: 25-08-2018</h6>
        </Col>
        <Col className="to-right">
          <Button className="to-right" variant="outline-dark">
            Remove
          </Button>
        </Col>
      </Row>
    </div>
  </ListingItemStyle>
);

class ProfileAdsListing extends Component {
  render() {
    return (
      <Container>
        <ListingItem />
        <ListingItem />
        <ListingItem />
      </Container>
    );
  }
}

const Style = styled.div`
  h5 {
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-weight: 600;
  }

  p {
    font-size: 16px;
    color: #404040;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 15px;
    margin-right: 15px;
  }

  .btn {
    margin: 2px 5px;
    padding: 3px 9px;
    font-size: 16px;
  }

  .to-right {
    float: right;
  }

  .col-md-2 {
    padding-right: 0;
  }

  .row {
    margin-right: 0;
    margin-left: 0;
  }

  .profile-name {
    padding: 40px 15px;
  }
`;

const SPageBase = styled.div`
  background: #f6f6f6;
`
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
`

const SSectinHeaderWrapper = styled.div`
    padding: 20px 20px 20px 0;

`
const SSectionH4 = styled.h4`
  font-weight: 400;
`

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      userName: "",
      userId: "",
      userProfile: {
        profileDescription: "",
        createdAt: "",
        updatedAt: ""
      }
    };
  }

  componentWillMount() {
    const { auth } = this.props;

    // Decode JWT data and get User Id
    let token = decode(auth);
    this.setState({
      userId: token.UserId
    });

    console.log("User JWT Token", token)
    console.log("User data from the profile", token)


    axios
      .get(`http://localhost:2308/api/${token.UserId}`)
      .then(response => {
        console.log(response);

        this.setState({
          userName: response.data.profile.user_name,
          userId: response.data.profile.user_id,
          userProfile: {
            // userName: response.data.profile.user_name,
            profileDescription: response.data.profile.profile_description,
            createdAt: response.data.profile.created_at,
            updatedAt: response.data.profile.updated_at
          }
        });
      })
      .catch(error => console.log(error));

    console.log("User id is", token.UserId);
  }

  updateDescription = newProfile => {
    console.log("New profile", newProfile.profileDescription);

    axios
      .put(`http://localhost:2308/api/${this.state.userId}`, {
        user_id: this.state.userId,
        profile_description: newProfile.profileDescription
      })
      .then(response => {
        console.log("POST", response);
        // update userProfile data
        this.setState({
          userProfile: {
            profileDescription: newProfile.profileDescription
          }
        });
      })
      .catch(error => console.log(error));
  };

  handleFormClose = value => {
    if (value) {
      this.setState({ isEditing: value });
    } else {
      this.setState(prevState => {
        return { isEditing: !prevState.isEditing };
      });
    }
  };

  onChangeDescription = e => {
    let value = e.target.value;
    // let value = "3";

    this.setState(
      prevState => ({
        userProfile: {
          ...prevState.userProfile,
          profileDescription: value
        }
      }),
      () => console.log(this.state.userProfile)
    );
  };


  profileDescription = () => {
    if (this.state.userProfile.profileDescription.length == 0) {
      return (
        <p>
          You can add profile description. It helps you to find new customers.
        </p>
      );
    } else {
      return <p>{this.state.userProfile.profileDescription}</p>;
    }
  };

  handleAddProperty = () => {

  }

  render() {
    console.log("Length", this.state.userProfile.profileDescription.length);
    let descriptionPart;
    if (this.state.userProfile.profileDescription.length == 0) {
      descriptionPart = (
        <p>
          You can add profile description. It helps you to find new customers.
        </p>
      );
    } else {
      descriptionPart = <p>{this.state.userProfile.profileDescription}</p>;
    }

    return (
      <SPageBase>
        <SSection>
          <Container>
            <SSectinHeaderWrapper>
              <SSectionH4>{this.state.userName}</SSectionH4>
            </SSectinHeaderWrapper>
          </Container>
        </SSection>
        <SSection>
          <Container>
            <Row>
              <Col>
                <SSectinHeaderWrapper>
                  <SSectionH4>About</SSectionH4>
                </SSectinHeaderWrapper>
              </Col>
            </Row>
              {this.state.isEditing ? (
                <UserProfileForm
                  currentProfile={this.state.userProfile}
                  handleFormClose={this.handleFormClose}
                  updateDescription={this.updateDescription}
                />
              ) : (
                <Row>
                  <Col md="10">{descriptionPart}</Col>
                  <Col md="2" className="to-right">
                    <Button
                      onClick={() => this.handleFormClose(true)}
                      className="to-right"
                    >
                      Change
                    </Button>
                  </Col>
                </Row>
              )}
          </Container>
        </SSection>
        <SSection>
          <Container>
            <Row>
              <Col md="10">
                <SSectinHeaderWrapper>
                  <SSectionH4>Added listings</SSectionH4>
                </SSectinHeaderWrapper>
              </Col>
              <Col md="2" className="to-right">
                <SSectinHeaderWrapper>
                  <Link to="/property/new">
                    <Button variant="primary"
                            onClick={this.handleAddProperty}>
                      Add Property
                    </Button>
                  </Link>
                </SSectinHeaderWrapper>
              </Col>
            </Row>

          </Container>
        </SSection>
      </SPageBase>

    );
  }
}


{/*<Container>*/}
{/*  <Style>*/}
{/*    <Col>*/}
{/*      <Jumbotron className="profile-name">*/}
{/*        <h3>{this.state.userName}</h3>*/}
{/*      </Jumbotron>*/}
{/*    </Col>*/}
{/*    <hr />*/}
{/*    <Col>*/}
{/*      <h4>Profile Description</h4>*/}
{/*    </Col>*/}


{/*    <Row>*/}
{/*      <Col md="10">*/}
{/*        <h4>Your listings</h4>*/}
{/*      </Col>*/}
{/*      <Col className="to-right">*/}
{/*        <Link to="/property/new">*/}
{/*          <Button variant="primary"*/}
{/*                  onClick={this.handleAddProperty}>*/}
{/*            Add Property*/}
{/*          </Button>*/}
{/*        </Link>*/}
{/*      </Col>*/}
{/*    </Row>*/}
{/*    <Row>*/}
{/*      <Col><hr/></Col>*/}
{/*    </Row>*/}

{/*    <ProfileAdsListing />*/}
{/*    <Row />*/}
{/*  </Style>*/}
{/*</Container>*/}

// function mapStateToProps(state) {
//   return { loggedUser: state.auth };
// }
export default requireAuth(UserProfile);
