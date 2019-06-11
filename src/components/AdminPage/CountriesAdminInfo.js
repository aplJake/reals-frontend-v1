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
  country_name: Yup.string()
    .matches(
      /^[a-zA-Z \-]*$/,
      'Country name must contain only character letters'
    )
    .min(3, 'Country name must be at least 3 characters')
    .max(100, 'Country name max length is 100 characters')
    .required("Country is required field"),
  country_code: Yup.string()
    .matches(
      /^[0-9]*$/,
      'Zip Code must contain only numbers'
    )
    .max(8, 'Max zip code length is 8 characters'),
});

const FormExample = ({handlerSubmit, defaultValues}) => {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={defaultValues}
    >
      {({
          handleChange,
          values,
          errors,
        }) => (
        <Form noValidate onSubmit={e => {
          e.preventDefault();
          console.log("On submit form", JSON.stringify(values, null, 2));
          handlerSubmit(JSON.stringify(values, null, 2));
        }}>
          <Form.Row>
            <Form.Group as={Col} md="4" controlId="validationFormik03">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country"
                name="country_name"
                value={values.country_name}
                onChange={handleChange}
                isInvalid={!!errors.country_name}
              />

              <Form.Control.Feedback type="invalid">
                {errors.country_name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik04">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Zip Code"
                name="country_code"
                value={values.country_code}
                onChange={handleChange}
                isInvalid={!!errors.country_code}
              />
              <Form.Control.Feedback type="invalid">
                {errors.country_code}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Button type="submit">Submit form</Button>
        </Form>
      )}
    </Formik>
  );
};


class CountriesAdminInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onEditMode: false,
      countryOnEdit: {
        country_id: "",
        country_name: "",
        country_code: "",
      }
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
      .get(`http://localhost:2308/api/countries`)
      .then(response => {
        console.log("Countries resp", response.data.countries);
        this.setState({
          ...this.state,
          countries: response.data.countries,
        }, () => {
          console.log("Countries", this.state.countries)
        })
      })
      .catch(error => console.log(error));

    console.log("Result of API Get", this.state)
  }

  handleCountryAddSubmit = (jsonedCountry) => {
    console.log("Country to send", jsonedCountry);

    if(this.state.onEditMode) {
      console.log("on edit mode");
      Axios
        .put(`http://localhost:2308/api/admin/${this.props.adminId}/listings`,
          jsonedCountry
        )
        .then(response => {
          console.log("POST23", response);
        })
        .catch(error => console.log(error));
    } else {
      console.log("on simple mode");
      Axios
        .post(`http://localhost:2308/api/countries`, jsonedCountry)
        .then(response => {
          console.log("Add new Country", response);
        })
        .catch(error => console.log(error));
    }
  };

  deleteCountryHandler = (countryID) => {
    Axios
      .delete(`http://localhost:2308/api/countries/${countryID}`)
      .then(response => {
        console.log("Country deleted status: ", response);
      })
      .catch(error => console.log(error));
  };

  // Delete admin action
  editCountryHandler = (country) => {
    console.log("On edit country: ", country);

    this.setState({
      countryOnEdit: country
    }, () => {
      console.log("Editable country", this.state.countryOnEdit)
    });

    this.setState({
      onEditMode: !this.state.onEditMode
    })
  };

  render() {
    if (this.state.countries != null && this.state.countries.length > 0) {
      return (
        <AdminWrapper>
          {this.state.onEditMode ? (
            <Fragment>
              <h3>Edit mode</h3>
              <FormExample handlerSubmit={this.handleCountryAddSubmit}
                           defaultValues={this.state.countryOnEdit}
              />
            </Fragment>
          ) : (
            <FormExample handlerSubmit={this.handleCountryAddSubmit}/>
          )}
          <Table responsive striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Country</th>
              <th>Zip Code</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {this.state.countries.map(item => (
              <ListingTableItem key={item.country_id}
                                country={item}
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
        <AdminWrapper>
          <SWarningMsg>Countries info is empty</SWarningMsg>
        </AdminWrapper>
      )
    }
  }
}

const ListingTableItem = ({country, editCountryHandler, deleteCountryHandler}) => (
  <tr>
    <td>{country.country_id}</td>
    <td>{country.country_name}</td>
    <td>{country.country_code}</td>
    <td>
      <Button onClick={() => editCountryHandler(country)}>Edit</Button>
      <Button onClick={() => deleteCountryHandler(country.country_id)}>Remove</Button>
    </td>
  </tr>
);

// class ListingTableItem extends React.Component {
//   constructor(props) {
//     super(props);
//
//   }
//
//   render() {
//     return(
//       <tr>
//         <td>{this.props.country.country_id}</td>
//         <td>{this.props.country.country_name}</td>
//         <td>{this.props.country.country_code}</td>
//         <td>
//           <Button onClick={() => this.props.editCountryHandler(this.props.country)}>Edit</Button>
//           <Button onClick={() => this.props.deleteCountryHandler(this.props.country.country_id) }>Remove</Button>
//         </td>
//       </tr>
//     )
//   }
// }
export default requireAuth(CountriesAdminInfo);
