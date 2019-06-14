import requireAuth from "../requireAuth";
import decode from "jwt-decode";
import Axios from "axios";
import {Button, Col, Form, Table} from "react-bootstrap";
import React, {Fragment, useState} from "react"
import {AdminWrapper} from "./index";
import styled from "styled-components";
import {Formik,} from "formik";
import * as Yup from "yup";

const SWarningMsg = styled.h5`
  margin-top: 80px;
`;

const schema = Yup.object({
    city_name: Yup.string()
      .matches(
        /^[a-zA-Z \-]*$/,
        'City name must contain only character letters'
      )
      .min(3, 'City name must be at least 3 characters')
      .max(100, 'City name max length is 100 characters')
      .required("City is required field"),
    country_id: Yup.string().required("Country must be chosen")
});

//= ({handlerSubmit, defaultValues, countryList})
class FormExample extends React.PureComponent {
  //

  render() {
    let countryOptions;

    if (this.props.countryList) {
      console.log("##23", this.props.countryList);

      countryOptions = this.props.countryList.map((country) =>
        <option key={country.country_id}
                value={country.country_id}
        >
          {country.country_name}
        </option>
      );
    }

    return (
      <Formik
        validationSchema={schema}
        onSubmit={console.log}
        initialValues={this.props.defaultValues}
      >
          {({
                handleChange,
                values,
                errors,
            }) => (
            <Form noValidate onSubmit={e => {
                e.preventDefault();
                console.log("On submit form", JSON.stringify(values, null, 2));
                this.props.handlerSubmit(JSON.stringify(values, null, 2));
            }}>
                <Form.Row>
                    <Form.Group as={Col} md="4" controlId="validationFormik03">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          as={"select"}
                          placeholder="Country name"
                          name="country_id"
                          value={values.country_id}
                          defaultalue={this.props.countryList[0]}
                          onChange={handleChange}
                          isInvalid={!!errors.country_id}
                        >
                          { countryOptions }
                        </Form.Control>

                        <Form.Control.Feedback type="invalid">
                            {errors.country_id}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationFormik04">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="City name"
                          name="city_name"
                          value={values.city_name}
                          onChange={handleChange}
                          isInvalid={!!errors.city_name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.city_name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Button type="submit">Submit form</Button>
            </Form>
          )}
      </Formik>
    );
  }
};


class CitiesAdminInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onEditMode: false,
            countryOnEdit: {
                country_id: "",
                city_id: "",
                city_name: "",
            },
            cities: [],
            countryDropdownList: [],
        }
    }

    componentWillMount() {
        const {auth} = this.props;
        let token = decode(auth);
        this.setState({
            ...this.state,
            tokenPayload: token
        });

        // get info about cities for the table
        Axios
          .get(`http://localhost:2308/api/cities`)
          .then(response => {
              console.log("Countries resp", response.data.cities);
              this.setState({
                  ...this.state,
                  cities: response.data.cities,
              }, () => {
                  console.log("Countries", this.state.cities)
              })
          })
          .catch(error => console.log(error));

        console.log("Result of API Get", this.state);
      // additonaly get data about all countries

      Axios
        .get(`http://localhost:2308/api/countries`)
        .then(response => {
          console.log("Countries resp", response.data.countries);
          this.setState({
            ...this.state,
            countryDropdownList: response.data.countries,
          }, () => {
            console.log("CountriesDropdownList", this.state.countryDropdownList)
          })
        })
        .catch(error => console.log(error));
    }

    handleCountryAddSubmit = (jsonedCity) => {
        console.log("Country to send", jsonedCity);

        if(this.state.onEditMode) {
            console.log("on edit mode");
            Axios
              .put(`http://localhost:2308/api/cities`,
                jsonedCity
              )
              .then(response => {
                  console.log("POST23", response);
              })
              .catch(error => console.log(error));
        } else {
            console.log("on simple mode");
            Axios
              .post(`http://localhost:2308/api/cities`, jsonedCity)
              .then(response => {
                  console.log("Add new Country", response);
              })
              .catch(error => console.log(error));
        }
    };

    deleteCountryHandler = (cityID) => {
        Axios
          .delete(`http://localhost:2308/api/cities/${cityID}`)
          .then(response => {
              console.log("City deleted status: ", response);
          })
          .catch(error => console.log(error));
    };

    // Delete admin action
    editCountryHandler = (city) => {
        console.log("On edit country: ", city);

        this.setState({
            countryOnEdit: city
        }, () => {
            console.log("Editable country", this.state.countryOnEdit)
        });

        this.setState({
            onEditMode: !this.state.onEditMode
        })
    };

    render() {
        if (this.state.cities != null && this.state.cities.length > 0) {
            return (
              <AdminWrapper adminUserType={this.state.tokenPayload.UserType}>
                  {this.state.onEditMode ? (
                    <Fragment>
                        <h3>Edit mode</h3>
                      <FormExample handlerSubmit={this.handleCountryAddSubmit}
                                   defaultValues={this.state.countryOnEdit}
                                   countryList={this.state.countryDropdownList}
                      />
                    </Fragment>
                  ) : (
                    <FormExample handlerSubmit={this.handleCountryAddSubmit}
                                 countryList={this.state.countryDropdownList}
                    />
                  )}
                  <Table responsive striped bordered hover>
                      <thead>
                      <tr>
                          <th>City ID</th>
                          <th>City</th>
                          <th>Country ID</th>
                          <th>Edit</th>
                          <th>Delete</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.cities.map(item => (
                        <ListingTableItem key={item.city_id}
                                          city={item}
                                          adminId={this.state.tokenPayload.UserId}
                                          editCountryHandler={this.editCountryHandler}
                                          deleteCountryHandler={this.deleteCountryHandler}
                        />
                      ))}
                      </tbody>
                  </Table>
              </AdminWrapper>
            )
        } else {
            return (
              <AdminWrapper adminUserType={this.state.tokenPayload.UserType}>
                  <SWarningMsg>Countries info is empty</SWarningMsg>
              </AdminWrapper>
            )
        }
    }
}

const ListingTableItem = ({city, editCountryHandler, deleteCountryHandler}) => (
  <tr>
      <td>{city.city_id}</td>
      <td>{city.city_name}</td>
      <td>{city.country_id}</td>
      <td>
          <Button className={"on-full-width"} onClick={() => editCountryHandler(city)}>Edit</Button>
      </td>
      <td>
          <Button className={"on-full-width"} onClick={() => deleteCountryHandler(city.city_id)}>Delete</Button>
      </td>
  </tr>
);

export default requireAuth(CitiesAdminInfo);
