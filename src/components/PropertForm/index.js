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
  user_id: Yup.string(),
  construction_type: Yup.string()
    .default("apartment"),
  area: Yup.string()
    .matches(
      /^[0-9]*$/,
      'This field should contain only numbers'
    )
    .max(9999999999, 'Area should be less than 10 digits')
    .required('Please specify the property area'),
  room_number: Yup.string()
    .matches(
      /^[0-9]*$/,
      'This field should contain only numbers'
    )
    .max(4, 'Apartment with more that 4 rooms will be automatically added into special group "more than 4 db"')
    .required("Please specify property room number"),
  bathroom_number: Yup.string()
    .matches(
      /^[0-9]*$/,
      'This field should contain only numbers'
    )
    .max(20, 'Max number of bathrooms in apartment is 20')
    .required("Please specify the number of bathrooms in your apartment"),
  max_floor_number: Yup.string()
    .matches(
      /^[0-9]*$/,
      'This field should contain only numbers'
    )
    .max(9999, 'Max number of integer signs is 4')
    .required('Please specify max floor number'),
  property_floor_number: Yup.string()
    .test(
      'Floor numbers matches',
      'Max floor is greater than your property floor',
      function(value) {
        const {path, createError } = this;
        let maxFloor = this.parent.max_floor_number;

        if(value > maxFloor) {
          return createError(path, "Message");
        } else {
          return true;
        }
    })
    .matches(
      /^[0-9]*$/,
      'This field should contain only numbers'
    )
    .max(9999, 'Max number of digets is 4')
    .required('Please specify max floor number'),
  listing_description: Yup.string()
    .matches(
      /^[a-zA-Z \.-]*$/,
      'Country name must contain only character letters'
    )
    .max(200, 'Max number of characters in the description is 200')
    .required('Please specify the listing description'),
  listing_price: Yup.string()
    .matches(
      /^[0-9]*$/,
      'This field should contain only numbers'
    )
    .max(11, 'Mux number of digits in the price is 11')
    .required('Please specify the listing price of the prperty'),
  listing_currency: Yup.string().default('usd'),
  listing_is_active: Yup.bool().default(true),
  street_name: Yup.string()
    .min(4, 'Min name of the street is 4')
    .max(150, 'Max number of the street is 150')
    .required('Please specify property street'),
  street_number: Yup.string()
    .matches(
      /^[0-9]*$/,
      'This field should contain only numbers'
    )
    .max(9999999999, 'Max number of digits in the street number is 10')
    .required('lease specify the street number'),
  //       // }
  country_id: Yup.number(),
  city_id: Yup.number(),
});

class PropertyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      cityList: [],
      choosedCountryId: 1,
      choosedCityId: 1,
      user_id: "",
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

  componentWillMount() {
    const {auth} = this.props;

    // Decode JWT data and get User Id
    let token = decode(auth);
    this.setState({
      newProperty: {
        ...this.state.newProperty,
        user_id: token.UserId
      },
    });

    this.setState({
      user_id: token.UserId
    });

    // GET REQUEST FOR ALL COUNTRY DATA
    this.getCountries();
    // GET REQUEST FOR ALL CITIES DATA
    if(this.state.addresses.country_id != null) {
      this.getCitiesByCountry(this.state.addresses.country_id);
    }
  }

  getCountries = () => {
    Axios.get(`http://localhost:2308/api/countries`)
      .then(response => {
        this.setState({
          countryList: response.data.countries,
        });

        this.setState(
          prevState => ({
            newProperty: {
              ...prevState.newProperty,
              addresses: {
                ...prevState.newProperty.addresses,
                country_id: response.data.countries[0].country_id,
              }
            }
          })
        );
      })
      .catch(error => console.log(error));

    console.log("List c", this.state.countryList);
  };

  getCitiesByCountry = e => {
    console.log('Event', e);

    Axios.get(`http://localhost:2308/api/countries/${e}/cities`)
      .then(response => {
        this.setState({
          cityList: response.data.cities
        });

        this.setState(
          prevState => ({
            newProperty: {
              ...prevState.newProperty,
              addresses: {
                ...prevState.newProperty.addresses,
                city_id: response.data.cities[0].city_id,
              }
            }
          })
        );
      })
      .catch(error => console.log(error));


    console.log("cities are", this.state.cityList);
  };

  formikFormSubmit = (propertyModel) => {
    console.log("Property Model to add", propertyModel);

    Axios
      .post(`http://localhost:2308/api/${this.state.newProperty.user_id}/property/new`,
        propertyModel
      )
      .then(response => {
        console.log(response);
        // TODO: ADD REDIRECT TO THE HOME PAGE
      })
      .catch(error => console.log(error));
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
            {/*Formik form*/}

            <Formik
              validationSchema={schema}
              onSubmit={console.log}
              initialValues={{
                user_id: this.state.user_id,
                construction_type: "apartment",
                listing_currency: "usd",
                listing_is_active: "true",
              }}
            >
              {({
                handleChange,
                values,
                errors,
              }) => (
                <Form noValidate onSubmit={(e) => {
                  e.preventDefault();
                  this.formikFormSubmit(JSON.stringify(values, null, 2))
                }
                }>

                  {/* Construction type*/}
                  <Form.Group as={Row} controlId="formGridConstructionType">
                    <Form.Label column sm={3}>Type</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="select"
                        value={values.construction_type}
                        name={"construction_type"}
                        onChange={handleChange}
                        isInvalid={!!errors.construction_type}
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.country_name}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  {/* Property Area*/}
                  <Form.Group as={Row} controlId="formGridArea">
                    <Form.Label column sm={3}>Area</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text"
                                    placeholder="Property area"
                                    name={"area"}
                                    value={values.area}
                                    onChange={handleChange}
                                    isInvalid={!!errors.area}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.area}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  {/* Number of rooms in bedroom and bathroom */}
                  <Form.Group as={Row} controlId="formGridRoomNumber">
                    <Form.Label column sm={3}>Rooms</Form.Label>
                    <Col sm={5}>
                      <Form.Control type="text"
                                    placeholder="Room number"
                                    name={"room_number"}
                                    value={values.room_number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.room_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.room_number}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={4}>
                      <Form.Control type="text"
                                    placeholder="Bathroom number"
                                    name={"bathroom_number"}
                                    value={values.bathroom_number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.bathroom_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bathroom_number}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  {/* Floors number */}
                  <Form.Group as={Row} controlId="formGridMaxFloor">
                    <Form.Label column sm={3}>Floors</Form.Label>
                    <Col sm={5}>
                      <Form.Control type="text"
                                    placeholder="Max floor"
                                    name={"max_floor_number"}
                                    value={values.max_floor_number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.max_floor_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.max_floor_number}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={4}>
                      <Form.Control type="text"
                                    placeholder="Property floor"
                                    name={"property_floor_number"}
                                    value={values.property_floor_number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.property_floor_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.property_floor_number}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  {/* Listing description */}
                  <Form.Group as={Row} md={3}>
                    <Form.Label column sm={3}>Listing Description</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text"
                                    placeholder="Describe your property"
                                    name={"listing_description"}
                                    value={values.listing_description}
                                    onChange={handleChange}
                                    isInvalid={!!errors.listing_description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.listing_description}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  {/* Listing price and currency */}
                  <Form.Group as={Row} md={3}>
                    <Form.Label column sm={3}>Listing Price</Form.Label>
                    <Col sm={5}>
                      <Form.Control type="text"
                                    placeholder="Enter selling price"
                                    name={"listing_price"}
                                    value={values.listing_price}
                                    onChange={handleChange}
                                    isInvalid={!!errors.listing_price}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.listing_price}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={4}>
                      <Form.Control as="select"
                                    name={"listing_currency"}
                                    value={values.listing_currency}
                                    onChange={handleChange}
                                    isInvalid={!!errors.listing_currency}
                      >
                        <option value={"usd"}>USD</option>
                        <option value={"hrv"}>HRV</option>
                        <option value={"eur"}>EUR</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.listing_currency}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} md={3}>
                    <Form.Label column sm={3}>Country</Form.Label>
                    <Col sm={5}>
                      <Form.Control as="select"
                                    name={"country_id"}
                                    value={values.country_id}
                                    onChange={e => {
                                      handleChange(e);
                                      this.getCitiesByCountry(e.target.value)
                                    }}
                                    isInvalid={!!errors.country_id}
                      >
                        {countryOptions}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.country_id}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={4}>
                      <Form.Control as="select"
                                    name={"city_id"}
                                    value={values.city_id}
                                    onChange={handleChange}
                                    isInvalid={!!errors.city_id}
                      >
                        {cityOptions}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.city_id}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  {/* Adresses*/}
                  <Form.Group as={Row} md={3}>
                    <Form.Label column sm={3}>Address</Form.Label>
                    <Col sm={5}>
                      <Form.Control type="text"
                                    placeholder="Enter property address"
                                    name={"street_name"}
                                    value={values.street_name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.street_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.street_name}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={4}>
                      <Form.Control type="text"
                                    placeholder="Enter property building"
                                    name={"street_number"}
                                    value={values.street_number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.street_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.street_number}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Button type="submit">Add listings</Button>
                </Form>
                )}
            </Formik>

            {/* End of Formik form */}







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
      </Style>
    );
  }
}

export default requireAuth(PropertyForm);