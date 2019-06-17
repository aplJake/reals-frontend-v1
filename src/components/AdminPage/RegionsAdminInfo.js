import requireAuth from "../requireAuth";
import decode from "jwt-decode";
import Axios from "axios";
import {Alert, Button, Col, Form, Table} from "react-bootstrap";
import React, {Fragment, useState} from "react"
import {AdminWrapper} from "./index";
import styled from "styled-components";
import {Formik,} from "formik";
import * as Yup from "yup";

const SWarningMsg = styled.h5`
  margin-top: 80px;
`;

const schema = Yup.object({
  region_name: Yup.string()
    .matches(
      /^[a-zA-Z \-]*$/,
      'City name must contain only character letters'
    )
    .min(3, 'City name must be at least 3 characters')
    .max(100, 'City name max length is 100 characters')
    .required("City is required field"),
  city_id: Yup.string().required("Country must be chosen")
});

//= ({handlerSubmit, defaultValues, cityList})
class FormExample extends React.PureComponent {
  //

  render() {
    let cityOptions;

    if (this.props.cityList) {
      console.log("##23", this.props.cityList);

      cityOptions = this.props.cityList.map((city) =>
        <option key={city.city_id}
                value={city.city_id}
        >
          {city.city_name}
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
                <Form.Label>City</Form.Label>
                <Form.Control
                  as={"select"}
                  placeholder="City name"
                  name="city_id"
                  value={values.city_id}
                  // defaultValue={this.props.cityList[0]}
                  onChange={handleChange}
                  isInvalid={!!errors.city_id}
                >
                  { cityOptions }
                </Form.Control>

                <Form.Control.Feedback type="invalid">
                  {errors.city_id}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationFormik04">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Region name"
                  name="region_name"
                  value={values.region_name}
                  onChange={handleChange}
                  isInvalid={!!errors.region_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.region_name}
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


class RegionsAdminInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onEditMode: false,
      regionOnEdit: {
        country_id: "",
        city_id: "",
        city_name: "",
      },
      regions: [],
      cityDropdownList: [],
      message: null,
    }
  }

  componentWillMount() {
    const {auth} = this.props;
    let token = decode(auth);
    this.setState({
      ...this.state,
      tokenPayload: token
    });

    // get info about regions for the table
    Axios
      .get(`http://localhost:2308/api/regions`)
      .then(response => {
        console.log("Countries resp", response.data.regions);
        this.setState({
          ...this.state,
          regions: response.data.regions,
        }, () => {
          console.log("Countries", this.state.regions)
        })
      })
      .catch(error => console.log(error));

    console.log("Result of API Get", this.state);
    // additonaly get data about all cities

    Axios
      .get(`http://localhost:2308/api/cities`)
      .then(response => {
        console.log("Countries resp", response.data.cities);
        this.setState({
          ...this.state,
          cityDropdownList: response.data.cities,
        }, () => {
          console.log("CitiesDropdownList", this.state.cityDropdownList)
        })
      })
      .catch(error => console.log(error));
  }

  handleRegionAddSubmit = (jsonedCity) => {
    console.log("Country to send", jsonedCity);

    if(this.state.onEditMode) {
      console.log("on edit mode");
      Axios
        .put(`http://localhost:2308/api/regions`,
          jsonedCity
        )
        .then(response => {
          console.log("POST23", response);
        })
        .catch(error => console.log(error));
    } else {
      console.log("on simple mode");
      Axios
        .post(`http://localhost:2308/api/regions`, jsonedCity)
        .then(response => {
          console.log("Add new Country", response);
        })
        .catch(error => console.log(error));
    }
  };

  deleteCountryHandler = (cityID) => {
    Axios
      .delete(`http://localhost:2308/api/regions/${cityID}`)
      .then(response => {
        console.log("City deleted status: ", response);
        this.setState({
          message: response.data.message,
        })

        // setTimeout(() => this.setState({
        //   message: this.state.message.filter(m => m !== message)
        // }), 5000);
      })
      .catch(error => console.log(error));
  };

  // Delete admin action
  editCountryHandler = (city) => {
    console.log("On edit country: ", city);

    this.setState({
      regionOnEdit: city
    }, () => {
      console.log("Editable country", this.state.regionOnEdit)
    });

    this.setState({
      onEditMode: !this.state.onEditMode
    })
  };

  handleCloseWarningMsg = () => {
    this.setState({
      message: null,
    })
  };

  render() {
    if (this.state.regions != null && this.state.regions.length > 0) {
      return (
        <AdminWrapper adminUserType={this.state.tokenPayload.UserType}>
          {this.state.onEditMode ? (
            <Fragment>
              <h3>Edit mode</h3>
              {/*<SWarningMsg>{this.state.message}</SWarningMsg>*/}
              {this.state.message && (
                <Alert variant="danger"
                       onClose={this.handleCloseWarningMsg}
                       dismissible>
                  {this.state.message}
                </Alert>
              )}
              <FormExample handlerSubmit={this.handleRegionAddSubmit}
                           defaultValues={this.state.regionOnEdit}
                           cityList={this.state.cityDropdownList}
              />
            </Fragment>
          ) : (
            <Fragment>
              {this.state.message && (
                <Alert variant="danger"
                       onClose={this.handleCloseWarningMsg}
                       dismissible>
                  {this.state.message}
                </Alert>
              )}
              <FormExample handlerSubmit={this.handleRegionAddSubmit}
                           cityList={this.state.cityDropdownList}
              />
            </Fragment>
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
            {this.state.regions.map(item => (
              <ListingTableItem key={item.region_id}
                                region={item}
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
          <SWarningMsg>Regions info is empty</SWarningMsg>
        </AdminWrapper>
      )
    }
  }
}

const ListingTableItem = ({region, editCountryHandler, deleteCountryHandler}) => (
  <tr>
    <td>{region.region_id}</td>
    <td>{region.region_name}</td>
    <td>{region.city_id}</td>
    <td>
      <Button className={"on-full-width"} onClick={() => editCountryHandler(region)}>Edit</Button>
    </td>
    <td>
      <Button className={"on-full-width"} onClick={() => deleteCountryHandler(region.region_id)}>Delete</Button>
    </td>
  </tr>
);

export default requireAuth(RegionsAdminInfo);
