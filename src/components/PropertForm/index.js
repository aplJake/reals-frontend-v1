import React from "react";
import {Button, Col, Container, Form} from "react-bootstrap";
import styled from "styled-components";
import axios from "axios";
import decode from "jwt-decode";
import requireAuth from "../requireAuth";

const Style = styled.div`
  .prop-name {
    margin-bottom: 20px;
  }
`;

/*
PropertyForm fields
RoomNumber
Construction Type   (list)
KidsAllowed         (bool)
PetsAllowed         (bool)
Area
BathroomNumber      (list)
MaxFloorNumber
PropertyFloor

Listing Description
ListingPrice
ListingCurrency     (list)
 */
class PropertyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      newProperty: {
        user_id: "",
        construction_type: "apartment",
        area: "",
        room_number: "",
        bathroom_number: "",
        max_floor_number: "",
        property_floor_number: "",
        kids_allowed: false,
        pets_allowed: false,
        listing_description: "",
        listing_price: "",
        listing_currency: "usd",
        listing_is_active: true,
        addresses: {
          street_name: "",
          street_number: "",
          city_name: "",
          country_name: "",
          zip_code: "",
        }
      }
    }
  }

  handleSelectPropTypeChange = e => {
    e.preventDefault();
    let {newProperty} = {...this.state};
    let currentPropertyState = newProperty;
    const {name, value} = e.target;

    currentPropertyState[name] = value;

    console.log("Name", name, "Value", value);
    console.log(this.state)
  };

  // Listing (FOR CURRENCY TYPE)
  handleSelectCurrencyTypeChange = e => {
    e.preventDefault();
    let {newProperty} = {...this.state};
    let currentListingState = newProperty;
    const {name, value} = e.target;

    currentListingState[name] = value;

    console.log("Name", name, "Value", value);
    console.log(this.state.newProperty)
  };

  // `http://localhost:2308/api/${this.state.user_id}/property/new`
  onFormSubmit = e => {
    e.preventDefault();

    console.log("Request", this.state.newProperty)

    axios
      .post(`http://localhost:2308/api/${this.state.newProperty.user_id}/property/new`,
        this.state.newProperty
      )
      .then(response => {
        console.log(response);
        // TODO: ADD REDIRECT TO THE HOME PAGE
      })
      .catch(error => console.log(error));
  };

  componentDidMount() {
    const {auth} = this.props;

    // Decode JWT data and get User Id
    let token = decode(auth);
    this.setState({
      newProperty: {
        ...this.state.newProperty,
        user_id: token.UserId
      }
    });

    // GET REQUEST FOR ALL COUNTRY DATA
    // SET STATE countryList
  }


  render() {
    return (
      <Style>
        <Container>
          <h4 className={"prop-name"}>New property</h4>

          <Form onSubmit={this.onFormSubmit}>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridConstructionType">
                <Form.Label>Construction Type</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.newProperty.construction_type}
                  name={"construction_type"}
                  onChange={this.handleSelectPropTypeChange}
                >
                  <option defaultValue="apartment">Apartment</option>
                  <option value="house">House</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridArea">
                <Form.Label>Area</Form.Label>
                <Form.Control type="text"
                              placeholder="Property area"
                              for={this.state.newProperty.area}
                              name={"area"}
                              onChange={this.handleSelectPropTypeChange}/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridRoomNumber">
                <Form.Label>Rooms</Form.Label>
                <Form.Control type="text"
                              placeholder="Room number"
                              for={this.state.newProperty.room_number}
                              name={"room_number"}
                              onChange={this.handleSelectPropTypeChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridBathroomNumber">
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control type="text"
                              placeholder="Bathroom number"
                              for={this.state.newProperty.bathroom_number}
                              name={"bathroom_number"}
                              onChange={this.handleSelectPropTypeChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridMaxFloor">
                <Form.Label>Max Floor</Form.Label>
                <Form.Control type="text"
                              placeholder="Floor number"
                              for={this.state.newProperty.max_floor_number}
                              name={"max_floor_number"}
                              onChange={this.handleSelectPropTypeChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPropertyFloor">
                <Form.Label>Property Floor</Form.Label>
                <Form.Control type="text"
                              placeholder="Floor number"
                              for={this.state.newProperty.property_floor_number}
                              name={"property_floor_number"}
                              onChange={this.handleSelectPropTypeChange}/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md={3}>
                <Form.Label>Kids</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.newProperty.kids_allowed}
                  name={"kids_allowed"}
                  onChange={this.handleSelectPropTypeChange}
                >
                  <option value={"true"}>Are allowed</option>
                  <option value={"false"}>Are not allowed</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md={3}>
                <Form.Label>Kids</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.newProperty.pets_allowed}
                  name={"pets_allowed"}
                  onChange={this.handleSelectPropTypeChange}
                >
                  <option value={"true"}>Are allowed</option>
                  <option value={"false"}>Are not allowed</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridListingDescription">
              <Form.Label>Listing Description</Form.Label>
              <Form.Control type="text"
                            placeholder="Describe your property"
                            for={this.state.newProperty.listing_description}
                            name={"listing_description"}
                            onChange={this.handleSelectCurrencyTypeChange}/>
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridListingPrice">
                <Form.Label>Listing Price</Form.Label>
                <Form.Control type="text"
                              placeholder="Enter selling price"
                              for={this.state.newProperty.listing_price}
                              name={"listing_price"}
                              onChange={this.handleSelectCurrencyTypeChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCurrencyType">
                <Form.Label>Currency</Form.Label>
                <Form.Control as="select"
                              value={this.state.newProperty.listing_currency}
                              defaultValue="usd"
                              name={"listing_currency"}
                              onChange={this.handleSelectCurrencyTypeChange}
                              >
                  <option value={"usd"}>USD</option>
                  <option value={"hrv"}>HRV</option>
                  <option value={"eur"}>EUR</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>


            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCountry">
                <Form.Label>State</Form.Label>
                <Form.Control as="select">
                  <option>Choose...</option>
                  <option>...</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control/>
              </Form.Group>
            </Form.Row>

            <Form.Group>
              <Form.Check
                required
                label="Agree to terms and conditions"
                feedback="You must agree before submitting."
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Container>
      </Style>
    );
  }
}

export default requireAuth(PropertyForm);