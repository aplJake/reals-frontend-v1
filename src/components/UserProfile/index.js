import React, {Component, Fragment} from "react";
import requireAuth from "../requireAuth";
import decode from "jwt-decode";
import axios from "axios";
import UserProfileForm from "./components/UserProfileForm";
import {Button, Col, Container, Row} from "react-bootstrap";
import styled from "styled-components";
import {Link} from "react-router-dom";

const ListingItem = ({listing, removeOnClick}) => (
  <SSectionListing>
    <Container>
      <Row>
        <Col sm="10">
          <SSectinHeaderWrapper>
            <SSectionH5>{listing.listing_description}</SSectionH5>
          </SSectinHeaderWrapper>
        </Col>
        <Col sm="2" className="to-right">
          <SSectinHeaderWrapper>
            <SSectionH5>{listing.listing_price} {listing.listing_currency}</SSectionH5>
          </SSectinHeaderWrapper>
        </Col>
      </Row>
      <Row>
        <Col sm={"10"}>
          <Row>
            <Col><h6 className={"tiny-description"}>{new Date(listing.created_at).toDateString()}</h6></Col>
          </Row>
          <Row>
            <Col><h6 className={"tiny-description"}>{new Date(listing.updated_at).toDateString()}</h6></Col>
          </Row>
        </Col>
        <Col sm={"2"}>
          <Row>
            <Link to={`/property/update/${listing.property_id}`}>
              <Button variant="primary"
              >
                Update
              </Button>
            </Link>
          </Row>
          <Row>
            <Button variant="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      removeOnClick(listing.property_id);
                    }}
            >
              Remove
            </Button>
          </Row>
        </Col>
      </Row>
    </Container>
  </SSectionListing>
);

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
      tokenPayload: "",
      profileListings: [],
    };
  }

  componentWillMount() {
    const {auth} = this.props;
    let token = decode(auth);
    this.setState({
      ...this.state,
      tokenPayload: token,
      userId: token.UserId
    });

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
          profileListings: response.data.countries,
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

  deleteListingHandler = (propertyID) => {
    axios
      .delete(`http://localhost:2308/api/property/delete/${propertyID}`)
      .then(response => {
        console.log("Property deleted status: ", response);
      })
      .catch(error => console.log(error));
  };

  // Delete admin action
  editListingHandler = (listing) => {
    console.log("On edit listing: ", listing);

    // this.setState({
    //   countryOnEdit: country
    // }, () => {
    //   console.log("Editable country", this.state.countryOnEdit)
    // });
    //
    // this.setState({
    //   onEditMode: !this.state.onEditMode
    // })
  };

  render() {
    console.log("Profile countries ", this.state.profileListings);
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

    if (!this.state.tokenPayload.IsAdmin && this.state.profileListings.length > 0) {
      listings = this.state.profileListings.map((l) =>
        <ListingItem key={l.property_id}
                     listing={l}
                     updateOnClick={this.editListingHandler}
                     removeOnClick={this.deleteListingHandler}
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
        <Fragment>
          <SSectionZMargin>
            <Container>
              <Row>
                <Col md="10" sm="10">
                  <SSectinHeaderWrapper>
                    {!this.state.tokenPayload.IsAdmin ? (
                      <SSectionH4>Added listings</SSectionH4>
                    ): (
                      <SSectionH4>Admin Page</SSectionH4>
                    )}
                  </SSectinHeaderWrapper>
                </Col>
                <Col md="2" sm="2" className="to-right">
                  <SSectinHeaderWrapper>
                    {!this.state.tokenPayload.IsAdmin ? (
                      <Link to="/property/new">
                        <Button variant="primary"
                                onClick={this.handleAddProperty}>
                          Add Property
                        </Button>
                      </Link>
                    ): (
                      <Link to="/admin">
                        <Button variant="primary">
                          Admin Page
                        </Button>
                      </Link>
                    )}
                  </SSectinHeaderWrapper>
                </Col>
              </Row>

            </Container>
          </SSectionZMargin>

          {/*  Listings*/}
          {listings}
          {/*  Lisitings ending*/}
        </Fragment>
      </SPageBase>

    );
  }
}

export default requireAuth(UserProfile);
