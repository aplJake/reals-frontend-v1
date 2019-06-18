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
      'Floor number not matches',
      function (value) {
        const {path, createError} = this;
        let maxFloor = parseInt(this.parent.max_floor_number, 10);
        let valueInteger = parseInt(value, 10);

        if (valueInteger > maxFloor) {
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
  country_id: Yup.number()
    .required('Please specify the value'),
  city_id: Yup.number()
    .required('Please specify the value'),
  region_id: Yup.string(),
});

class UpdatePropertyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      cityList: [],
      regionsList: [],
      choosedCountryId: '',
      choosedCityId: '',
      user_id: '',
      propertyInitData: null,
    }
  }

  componentDidMount() {
    // Decode JWT data and get User Id
    const {auth} = this.props;
    let token = decode(auth);
    this.setState({
      user_id: token.UserId
    });

    // Get init data for the formik
    const {id} = this.props.match.params;
    Axios.get(`http://localhost:2308/api/property/update/${id}`)
      .then(response => {
        console.log(response);

        this.setState({
          propertyInitData: response.data.listing,
        }, () => {
          this.getCountries();
        });
      })
      .catch(error => console.log(error));

    // GET request for countries and city for the first country in the state

    // if (this.state.countryList[0] != null) {
    //   this.getCitiesByCountry(this.state.propertyInitData.country_id);
    // }
  }

  getCountries = () => {
    Axios.get(`http://localhost:2308/api/countries/with-cities`)
      .then(response => {
        this.setState({
          countryList: response.data.countries,
        }, () => {
          this.getCitiesByCountry(this.state.propertyInitData.country_id);
        });
      })
      .catch(error => console.log(error));

    console.log("List c", this.state.countryList);
  };

  getCitiesByCountry = e => {
    Axios.get(`http://localhost:2308/api/countries/${e}/cities`)
      .then(response => {
        this.setState({
          cityList: response.data.cities
        }, () => {
          this.getRegionsByCity(this.state.cityList[0].city_id)
        });
      })
      .catch(error => console.log(error));
    console.log("cities are", this.state.cityList);
  };

  getRegionsByCity = cityID => {
    Axios.get(`http://localhost:2308/api/cities/${cityID}/regions`)
      .then(response => {
        this.setState({
          regionsList: response.data.regions
        });
      })
      .catch(error => console.log(error));
    console.log("regions are", this.state.regionsList);
  };

  formikFormSubmit = (propertyModel, errors) => {
    if (Object.entries(errors).length === 0 && Object.entries(propertyModel).length > 6) {
      // e.preventDefault();

      let jsonValues = JSON.stringify(propertyModel, null, 2);
      Axios
        .put(`http://localhost:2308/api/property/update`,
          jsonValues
        )
        .then(response => {
          console.log(response);
          // TODO: ADD REDIRECT TO THE HOME PAGE
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    console.log("Countries render", this.state.countryList);
    let countryOptions, cityOptions, regionsOptions;

    if (this.state.countryList && this.state.countryList.length > 0) {
      countryOptions = this.state.countryList.map((country) =>
        <option key={country.country_id}
                value={country.country_id}>
          {country.country_name}
        </option>
      )
    }

    if (this.state.choosedCountryId != null && this.state.cityList != null && this.state.cityList.length > 0) {
      cityOptions = this.state.cityList.map((city) =>
        <option key={city.city_id}
                id={city.city_id}
                value={city.city_id}>
          {city.city_name}
        </option>
      )
    }

    if (this.state.regionsList && this.state.regionsList.length > 0) {
      regionsOptions = this.state.regionsList.map((region) =>
        <option key={region.region_id}
                id={region.region_id}
                value={region.region_id}>
          {region.region_name}
        </option>
      )
    }


    console.log("init values ", this.state.propertyInitData);

    if (this.state.propertyInitData) {

      return (
        <Style>
          <SSection>
            <Container>
              <SSectinHeaderWrapper>
                <SSectionH4>Update Listing</SSectionH4>
              </SSectinHeaderWrapper>
              {/*Formik form*/}

              <Formik
                validationSchema={schema}
                onSubmit={console.log}
                initialValues={this.state.propertyInitData}
              >
                {({
                    handleChange,
                    values,
                    errors,
                  }) => (
                  <Form noValidate onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Values in submit", values);
                    this.formikFormSubmit(values, errors)
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
                        <Form.Control as="select"
                                      name={"room_number"}
                                      value={values.room_number}
                                      onChange={handleChange}
                                      isInvalid={!!errors.room_number}
                        >
                          <option value="1 bd">1 bedroom</option>
                          <option value="2 bd">2 bedroom</option>
                          <option value="3 bd">3 bedroom</option>
                          <option value="more than 3 db">more than 3 bedroom</option>
                        </Form.Control>
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
                          <option value={null}>Choose country</option>
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
                          <option value={null}>Choose city</option>
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
                        <Form.Control as="select"
                                      name={"region_id"}
                                      value={values.region_id}
                                      onChange={handleChange}
                                      isInvalid={!!errors.region_id}
                        >
                          <option value={null}>Choose region</option>
                          {regionsOptions}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.region_id}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Button type="submit">Add listings</Button>
                  </Form>
                )}
              </Formik>

              {/* End of Formik form */}
            </Container>
          </SSection>
        </Style>
      );
    } else {
      return null
    }
  }
}

export default requireAuth(UpdatePropertyForm);