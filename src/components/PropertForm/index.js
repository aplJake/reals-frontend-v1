import React from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import styled from "styled-components";
import Axios from "axios";
import decode from "jwt-decode";
import requireAuth from "../requireAuth";
import {Formik,} from "formik";
import * as Yup from "yup";

const Style = styled.div`
  .prop-name {
    margin: 55px 0;
  }
`;

const SSection = styled.div`
  min-height: 100px;
  background: white;
  margin-bottom: 5px;
  padding: 10px 0;
  
  label {
    font-size: 18px;
    font-weight: 300;
  }
  
  button {
    width: 180px;
  }
`;

const SSectinHeaderWrapper = styled.div`
    padding: 20px 20px 20px 0;

`;
const SSectionH4 = styled.h4`
  font-weight: 400;
`;



const schema = Yup.object({
  construction_type: Yup.string()
    .default("apartment"),
  area: Yup.number()
    .max(10, 'Area should be less than 10 signs')
    .required('Please specify the property area'),
  room_number: Yup.number()
    .max(4, 'Apartment with more that 4 rooms will be automatically added into special group "more than 4 db"')
    .required("Please specify property room number"),
  bathroom_number: Yup.number()
    .max(20, 'Max number of bathrooms in apartment is 20')
    .required("Please specify the number of bathrooms in your apartment"),
  max_floor_number: Yup.number()
    .max(4, 'Max number of integer signs is 4')
    .required('Please specify max floor number'),
  property_floor_number: Yup.number()
    .max(4, 'Max number of integer signs is 4')
    .required('Please specify max floor number'),
  listing_description: Yup.string()
    .max(200, 'Mux number of characters in the description is 200')
    .required('Please specify the listing description'),
  listing_price: Yup.number()
    .max(11, 'Mux number of digits in the price is 11')
    .required('Please specify the listing price of the prperty'),
  listing_currency: Yup.string().default('usd'),
  listing_is_active: Yup.bool().default(true),
  street_name: Yup.string()
    .min(4, 'Min name of the street is 4')
    .max(150, 'Max number of the street is 150')
    .required('Please specify property street'),
  street_number: Yup.number()
    .max(10, 'Max number of digits in the street number is 10')
    .required('lease specify the street number'),
  city_id: Yup.number(),
  country_id: Yup.number(),
});

class PropertyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      cityList: [],
      choosedCountryId: 1,
      choosedCityId: 1,
      newProperty: {
        user_id: "",
        construction_type: "apartment",
        area: "",
        room_number: "",
        bathroom_number: "",
        max_floor_number: "",
        property_floor_number: "",
        listing_description: "",
        listing_price: "",
        listing_currency: "usd",
        listing_is_active: "true",
        addresses: {
          street_name: "",
          street_number: "",
          city_id: "",
          country_id: "",
        }
      }
    }
  }

  handleSelectPropTypeChange = e => {
    // let value = e.target.value;
    // let name = e.target.name;
    // e.preventDefault();
    // let {newProperty} = {...this.state};
    // let currentPropertyState = newProperty;
    const {name, value} = e.target;
    //
    // currentPropertyState[name] = value;
    this.setState({
      newProperty: {
        ...this.state.newProperty,
        value: name,
      }
    });
    console.log("Name", name, "Value", value);
    console.log(this.state)
  };

  handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      prevState => ({
        newProperty: {
          ...prevState.newProperty,
          [name]: value
        }
      }),
      () => console.log(this.state.newProperty)
    );
  };

  handleInputCountry = (e) => {
    this.handlerInputAddress(e);

    // var country = this.state.countryList.find(country => country.country_name === e.target.value);

    this.setState({
      choosedCountryId: e.target.value,
    }, () => {
      this.getCitiesByCountry();
    });


    // console.log("event", country);
  };

  handlerInputAddress = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      prevState => ({
        newProperty: {
          ...prevState.newProperty,
          addresses: {
            ...prevState.newProperty.addresses,
            [name]: value,
          }
        }
      }),
      () => console.log(this.state.newProperty)
    );
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

    console.log("Request", this.state.newProperty);

    Axios
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
    this.getCountries();
    // GET REQUEST FOR ALL CITIES DATA
    this.getCitiesByCountry();
  }

  getCountries = async () => {
    const response = await Axios.get(`http://localhost:2308/api/countries`);
    let countries = await response.data.countries;
    this.setState({
      countryList: countries,
    });

    this.setState(
      prevState => ({
        newProperty: {
          ...prevState.newProperty,
          addresses: {
            ...prevState.newProperty.addresses,
            country_id: countries[0].country_id,
          }
        }
      })
    );
    console.log("List c", this.state.countryList);
  };

  getCitiesByCountry = async () => {
    const response = await Axios.get(`http://localhost:2308/api/countries/${this.state.choosedCountryId}/cities`);
    let cities = await response.data.cities;
    this.setState({
      cityList: response.data.cities
    })

    this.setState(
      prevState => ({
        newProperty: {
          ...prevState.newProperty,
          addresses: {
            ...prevState.newProperty.addresses,
            city_id: cities[0].city_id,
          }
        }
      })
    );
    console.log("cities are", this.state.cityList);
  };

  render() {
    console.log("Countries render", this.state.countryList);
    let countryOptions;
    let cityOptions;

    if (this.state.countryList.length > 0) {
      countryOptions = this.state.countryList.map((country) =>
        <option key={country.country_id}
                value={country.country_id}>
          {country.country_name}
        </option>
      )
    }

    if (this.state.choosedCountryId != null && this.state.cityList.length > 0) {
      cityOptions = this.state.cityList.map((city) =>
        <option key={city.city_id}
                id={city.city_id}
                value={city.city_id}>
          {city.city_name}
        </option>
      )
    }

    return (
      <Style>
        <SSection>
          <Container>
            <SSectinHeaderWrapper>
              <SSectionH4>New Listing</SSectionH4>
            </SSectinHeaderWrapper>

            <Form onSubmit={this.onFormSubmit}>

              <Form.Group as={Row} controlId="formGridConstructionType">
                <Form.Label column sm={3}>Type</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    as="select"
                    value={this.state.newProperty.construction_type}
                    name={"construction_type"}
                    onChange={this.handleInput}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formGridArea">
                <Form.Label column sm={3}>Area</Form.Label>
                <Col sm={9}>
                  <Form.Control type="text"
                                placeholder="Property area"
                                for={this.state.newProperty.area}
                                name={"area"}
                                onChange={this.handleInput}/>
                </Col>
              </Form.Group>

              {/* ROOM NUMBER AND BATHROOM NUMBER */}
              <Form.Group as={Row} controlId="formGridRoomNumber">
                <Form.Label column sm={3}>Rooms</Form.Label>
                <Col sm={5}>
                  <Form.Control type="text"
                                placeholder="Room number"
                                for={this.state.newProperty.room_number}
                                name={"room_number"}
                                onChange={this.handleInput}/>
                </Col>
                <Col sm={4}>
                  <Form.Control type="text"
                                placeholder="Bathroom number"
                                for={this.state.newProperty.bathroom_number}
                                name={"bathroom_number"}
                                onChange={this.handleInput}/>
                </Col>
              </Form.Group>

              {/* FLOOR NUMBER */}
              <Form.Group as={Row} controlId="formGridMaxFloor">
                <Form.Label column sm={3}>Floors</Form.Label>
                <Col sm={5}>
                  <Form.Control type="text"
                                placeholder="Max floor"
                                for={this.state.newProperty.max_floor_number}
                                name={"max_floor_number"}
                                onChange={this.handleInput}/>
                </Col>
                <Col sm={4}>
                  <Form.Control type="text"
                                placeholder="Property floor"
                                for={this.state.newProperty.property_floor_number}
                                name={"property_floor_number"}
                                onChange={this.handleInput}/>
                </Col>
              </Form.Group>

              {/* PROPERTY DESCRIPTION */}
              <Form.Group as={Row} md={3}>
                <Form.Label column sm={3}>Listing Description</Form.Label>
                <Col sm={9}>
                  <Form.Control type="text"
                                placeholder="Describe your property"
                                for={this.state.newProperty.listing_description}
                                name={"listing_description"}
                                onChange={this.handleInput}/>
                </Col>
              </Form.Group>

              {/* PROPERTY PRICE AND CURRENCY */}
              <Form.Group as={Row} md={3}>
                <Form.Label column sm={3}>Listing Price</Form.Label>
                <Col sm={5}>
                  <Form.Control type="text"
                                placeholder="Enter selling price"
                                for={this.state.newProperty.listing_price}
                                name={"listing_price"}
                                onChange={this.handleInput}/>
                </Col>
                <Col sm={4}>
                  <Form.Control as="select"
                                value={this.state.newProperty.listing_currency}
                                defaultValue="usd"
                                name={"listing_currency"}
                                onChange={this.handleInput}
                  >
                    <option value={"usd"}>USD</option>
                    <option value={"hrv"}>HRV</option>
                    <option value={"eur"}>EUR</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              {/* COUNTRY */}
              <Form.Group as={Row} md={3}>
                <Form.Label column sm={3}>Country</Form.Label>
                <Col sm={5}>
                  <Form.Control as="select"
                                value={this.state.newProperty.addresses.country_id}
                                defaultValue={this.state.countryList[0]}
                                name={"country_id"}
                                onChange={this.handleInputCountry}
                  >
                    {countryOptions}
                  </Form.Control>
                </Col>
                <Col sm={4}>
                  <Form.Control as="select"
                                value={this.state.newProperty.addresses.city_id}
                                defaultValue={this.state.cityList[0]}
                                name={"city_id"}
                                onChange={this.handlerInputAddress}
                  >
                    {cityOptions}
                  </Form.Control>
                </Col>
              </Form.Group>

              {/* ADDRESS*/}
              <Form.Group as={Row} md={3}>
                <Form.Label column sm={3}>Address</Form.Label>
                <Col sm={5}>
                  <Form.Control type="text"
                                placeholder="Enter property address"
                                for={this.state.newProperty.addresses.street_name}
                                name={"street_name"}
                                onChange={this.handlerInputAddress}/>
                </Col>
                <Col sm={4}>
                  <Form.Control type="text"
                                placeholder="Enter property building"
                                for={this.state.newProperty.addresses.street_number}
                                name={"street_number"}
                                onChange={this.handlerInputAddress}/>
                </Col>
              </Form.Group>


              {/* SUMIT FORM */}

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Container>
        </SSection>


        {/*<Container>*/}
        {/*  <Form onSubmit={this.onFormSubmit}>*/}
        {/*      <Form.Group as={Row} controlId="formGridConstructionType">*/}
        {/*        <Form.Label column sm={3}>Type</Form.Label>*/}
        {/*        <Col sm={9}>*/}
        {/*          <Form.Control*/}
        {/*            as="select"*/}
        {/*            value={this.state.newProperty.construction_type}*/}
        {/*            name={"construction_type"}*/}
        {/*            onChange={this.handleSelectPropTypeChange}*/}
        {/*          >*/}
        {/*            <option defaultValue="apartment">Apartment</option>*/}
        {/*            <option value="house">House</option>*/}
        {/*          </Form.Control>*/}
        {/*        </Col>*/}
        {/*      </Form.Group>*/}


        {/*<Form.Group as={Col} controlId="formGridArea">*/}
        {/*  <Form.Label>Area</Form.Label>*/}
        {/*  <Form.Control type="text"*/}
        {/*                placeholder="Property area"*/}
        {/*                for={this.state.newProperty.area}*/}
        {/*                name={"area"}*/}
        {/*                onChange={this.handleSelectPropTypeChange}/>*/}
        {/*</Form.Group>*/}

        {/*<Form.Row>*/}
        {/*  <Form.Group as={Col} controlId="formGridRoomNumber">*/}
        {/*    <Form.Label>Rooms</Form.Label>*/}
        {/*    <Form.Control type="text"*/}
        {/*                  placeholder="Room number"*/}
        {/*                  for={this.state.newProperty.room_number}*/}
        {/*                  name={"room_number"}*/}
        {/*                  onChange={this.handleSelectPropTypeChange}/>*/}
        {/*  </Form.Group>*/}

        {/*  <Form.Group as={Col} controlId="formGridBathroomNumber">*/}
        {/*    <Form.Label>Bathrooms</Form.Label>*/}
        {/*    <Form.Control type="text"*/}
        {/*                  placeholder="Bathroom number"*/}
        {/*                  for={this.state.newProperty.bathroom_number}*/}
        {/*                  name={"bathroom_number"}*/}
        {/*                  onChange={this.handleSelectPropTypeChange}/>*/}
        {/*  </Form.Group>*/}

        {/*  <Form.Group as={Col} controlId="formGridMaxFloor">*/}
        {/*    <Form.Label>Max Floor</Form.Label>*/}
        {/*    <Form.Control type="text"*/}
        {/*                  placeholder="Floor number"*/}
        {/*                  for={this.state.newProperty.max_floor_number}*/}
        {/*                  name={"max_floor_number"}*/}
        {/*                  onChange={this.handleSelectPropTypeChange}/>*/}
        {/*  </Form.Group>*/}

        {/*  <Form.Group as={Col} controlId="formGridPropertyFloor">*/}
        {/*    <Form.Label>Property Floor</Form.Label>*/}
        {/*    <Form.Control type="text"*/}
        {/*                  placeholder="Floor number"*/}
        {/*                  for={this.state.newProperty.property_floor_number}*/}
        {/*                  name={"property_floor_number"}*/}
        {/*                  onChange={this.handleSelectPropTypeChange}/>*/}
        {/*  </Form.Group>*/}
        {/*</Form.Row>*/}

        {/*<Form.Row>*/}
        {/*  <Form.Group as={Col} md={3}>*/}
        {/*    <Form.Label>Kids</Form.Label>*/}
        {/*    <Form.Control*/}
        {/*      as="select"*/}
        {/*      value={this.state.newProperty.kids_allowed}*/}
        {/*      name={"kids_allowed"}*/}
        {/*      onChange={this.handleSelectPropTypeChange}*/}
        {/*    >*/}
        {/*      <option value={"true"}>Are allowed</option>*/}
        {/*      <option value={"false"}>Are not allowed</option>*/}
        {/*    </Form.Control>*/}
        {/*  </Form.Group>*/}
        {/*</Form.Row>*/}

        {/*<Form.Row>*/}
        {/*  <Form.Group as={Col} md={3}>*/}
        {/*    <Form.Label>Kids</Form.Label>*/}
        {/*    <Form.Control*/}
        {/*      as="select"*/}
        {/*      value={this.state.newProperty.pets_allowed}*/}
        {/*      name={"pets_allowed"}*/}
        {/*      onChange={this.handleSelectPropTypeChange}*/}
        {/*    >*/}
        {/*      <option value={"true"}>Are allowed</option>*/}
        {/*      <option value={"false"}>Are not allowed</option>*/}
        {/*    </Form.Control>*/}
        {/*  </Form.Group>*/}
        {/*</Form.Row>*/}

        {/*<Form.Group controlId="formGridListingDescription">*/}
        {/*  <Form.Label>Listing Description</Form.Label>*/}
        {/*  <Form.Control type="text"*/}
        {/*                placeholder="Describe your property"*/}
        {/*                for={this.state.newProperty.listing_description}*/}
        {/*                name={"listing_description"}*/}
        {/*                onChange={this.handleSelectCurrencyTypeChange}/>*/}
        {/*</Form.Group>*/}

        {/*<Form.Row>*/}
        {/*  <Form.Group as={Col} controlId="formGridListingPrice">*/}
        {/*    <Form.Label>Listing Price</Form.Label>*/}
        {/*    <Form.Control type="text"*/}
        {/*                  placeholder="Enter selling price"*/}
        {/*                  for={this.state.newProperty.listing_price}*/}
        {/*                  name={"listing_price"}*/}
        {/*                  onChange={this.handleSelectCurrencyTypeChange}/>*/}
        {/*  </Form.Group>*/}

        {/*  <Form.Group as={Col} controlId="formGridCurrencyType">*/}
        {/*    <Form.Label>Currency</Form.Label>*/}
        {/*    <Form.Control as="select"*/}
        {/*                  value={this.state.newProperty.listing_currency}*/}
        {/*                  defaultValue="usd"*/}
        {/*                  name={"listing_currency"}*/}
        {/*                  onChange={this.handleSelectCurrencyTypeChange}*/}
        {/*                  >*/}
        {/*      <option value={"usd"}>USD</option>*/}
        {/*      <option value={"hrv"}>HRV</option>*/}
        {/*      <option value={"eur"}>EUR</option>*/}
        {/*    </Form.Control>*/}
        {/*  </Form.Group>*/}
        {/*</Form.Row>*/}


        {/*<Form.Row>*/}
        {/*  <Form.Group as={Col} controlId="formGridCity">*/}
        {/*    <Form.Label>City</Form.Label>*/}
        {/*    <Form.Control/>*/}
        {/*  </Form.Group>*/}

        {/*  <Form.Group as={Col} controlId="formGridCountry">*/}
        {/*    <Form.Label>State</Form.Label>*/}
        {/*    <Form.Control as="select">*/}
        {/*      <option>Choose...</option>*/}
        {/*      <option>...</option>*/}
        {/*    </Form.Control>*/}
        {/*  </Form.Group>*/}

        {/*  <Form.Group as={Col} controlId="formGridZip">*/}
        {/*    <Form.Label>Zip</Form.Label>*/}
        {/*    <Form.Control/>*/}
        {/*  </Form.Group>*/}
        {/*</Form.Row>*/}

        {/*<Form.Group>*/}
        {/*  <Form.Check*/}
        {/*    required*/}
        {/*    label="Agree to terms and conditions"*/}
        {/*    feedback="You must agree before submitting."*/}
        {/*  />*/}
        {/*</Form.Group>*/}

        {/*    <Button variant="primary" type="submit">*/}
        {/*      Submit*/}
        {/*    </Button>*/}
        {/*  </Form>*/}
        {/*</Container>*/}
      </Style>
    );
  }
}

export default requireAuth(PropertyForm);