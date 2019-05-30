import React, {Component} from "react";
import requireAuth from "../requireAuth";
import decode from "jwt-decode";
import axios from "axios";
import UserProfileForm from "./components/UserProfileForm";
import {Button, Col, Container, Row} from "react-bootstrap";
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

const ListingItem = ({listingDescription, price, currency, createdAt, updatedAt, removeOnClick}) => (
  <SSectionListing>
    <Container>
      <Row>
        <Col sm="10">
          <SSectinHeaderWrapper>
            <SSectionH5>{listingDescription}</SSectionH5>
          </SSectinHeaderWrapper>
        </Col>
        <Col sm="2" className="to-right">
          <SSectinHeaderWrapper>
            <SSectionH5>{price} {currency}</SSectionH5>
          </SSectinHeaderWrapper>
        </Col>
      </Row>
      <Row>
        <Col sm={"10"}>
          <Row>
            <Col><h6 className={"tiny-description"}>{new Date(createdAt).toDateString()}</h6></Col>
          </Row>
          <Row>
            <Col><h6 className={"tiny-description"}>{new Date(updatedAt).toDateString()}</h6></Col>
          </Row>
        </Col>
        <Col sm={"2"}>
          <Link to="/property/new">
            <Button variant="primary"
                    onClick={removeOnClick}>
              Remove listing
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  </SSectionListing>
);

class ProfileAdsListing extends Component {
  render() {
    return (
      <Container>
        <ListingItem/>
        <ListingItem/>
        <ListingItem/>
      </Container>
    );
  }
}

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
      },
      profileListings: [],
    };
  }

  componentWillMount() {
    const {auth} = this.props;

    // Decode JWT data and get User Id
    let token = decode(auth);
    this.setState({
      userId: token.UserId
    });

    console.log("User JWT Token", token);
    console.log("User data from the profile", token);


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
          },
          profileListings: response.data.listings,
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
      this.setState({isEditing: value});
    } else {
      this.setState(prevState => {
        return {isEditing: !prevState.isEditing};
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
    if (this.state.userProfile.profileDescription.length === 0) {
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

  };

  render() {
    console.log("Profile listings ", this.state.profileListings);
    console.log("Length", this.state.userProfile.profileDescription.length);
    let descriptionPart;
    let listings;

    if (this.state.userProfile.profileDescription.length === 0) {
      descriptionPart = (
        <p>
          You can add profile description. It helps you to find new customers.
        </p>
      );
    } else {
      descriptionPart = <p>{this.state.userProfile.profileDescription}</p>;
    }

    if (this.state.profileListings.length > 0) {
      listings = this.state.profileListings.map((l) =>
        <ListingItem key={l.property_id}
                     listingDescription={l.listing_description}
                     price={l.listing_price}
                     currency={l.listing_currency}
                     createdAt={l.created_at}
                     updatedAt={l.updated_at}
        />
      )
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
                <Col md="10" sm={"10"}>{descriptionPart}</Col>
                <Col md="2" sm={"2"} className="to-right">
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
        <SSectionZMargin>
          <Container>
            <Row>
              <Col md="10" sm="10">
                <SSectinHeaderWrapper>
                  <SSectionH4>Added listings</SSectionH4>
                </SSectinHeaderWrapper>
              </Col>
              <Col md="2" sm="2" className="to-right">
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
        </SSectionZMargin>

        {/*  Listings*/}
        {listings}
        {/*  Lisitings ending*/}
      </SPageBase>

    );
  }
}


{/*<Container>*/
}
{/*  <Style>*/
}
{/*    <Col>*/
}
{/*      <Jumbotron className="profile-name">*/
}
{/*        <h3>{this.state.userName}</h3>*/
}
{/*      </Jumbotron>*/
}
{/*    </Col>*/
}
{/*    <hr />*/
}
{/*    <Col>*/
}
{/*      <h4>Profile Description</h4>*/
}
{/*    </Col>*/
}


{/*    <Row>*/
}
{/*      <Col md="10">*/
}
{/*        <h4>Your listings</h4>*/
}
{/*      </Col>*/
}
{/*      <Col className="to-right">*/
}
{/*        <Link to="/property/new">*/
}
{/*          <Button variant="primary"*/
}
{/*                  onClick={this.handleAddProperty}>*/
}
{/*            Add Property*/
}
{/*          </Button>*/
}
{/*        </Link>*/
}
{/*      </Col>*/
}
{/*    </Row>*/
}
{/*    <Row>*/
}
{/*      <Col><hr/></Col>*/
}
{/*    </Row>*/
}

{/*    <ProfileAdsListing />*/
}
{/*    <Row />*/
}
{/*  </Style>*/
}
{/*</Container>*/
}

// function mapStateToProps(state) {
//   return { loggedUser: state.auth };
// }
export default requireAuth(UserProfile);
