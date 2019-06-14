import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import SideProfile from "./SideProfile";
import PropertyQueue from "./PropertyQueue";
import Axios from "axios";
import styled from "styled-components";
import requireAuth from "../requireAuth";
import decode from "jwt-decode";

const Style = styled.div`
  .prop-name {
    margin: 55px 0;
  }
`;

const SPageBase = styled.div`
  background: #f6f6f6;
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

const SSectinWrapper = styled.div`
    padding: 25px 20px 5px 0;

`;
const SSectionH4 = styled.h4`
  font-weight: 500;
  font-size: 18px;
  color: #353535;
`;
const SSectionH5 = styled.h5`
  font-weight: 400;
  font-size: 14px;
  line-height: 12px;
  color: #333333;
  &.primary-h {
    color: blue;
    font-weight: 400;
  }
`;

const SContainer = styled.div`
  .sectioned-row {
    border-bottom: 1px solid #d0cccc;
  }
  
  .col {
    padding: 10px 0;
  }
  .col-date {
    padding-bottom: 0;
  }
`

const PropertyDescription = ({listingData, propertyData, streetData}) => {
  return(
    <SContainer>
      <Container>
        <Row>
          <SSectinWrapper>
            <SSectionH4>{listingData.listing_description}</SSectionH4>
          </SSectinWrapper>
        </Row>
        <Row>
          <SSectionH5 className="primary-h">{propertyData.construction_type.charAt(0).toUpperCase() + propertyData.construction_type.slice(1)}</SSectionH5>
        </Row>
        <Row>
          <Col md={2} className={"col"}>
            <SSectionH5>{listingData.listing_price} {listingData.listing_currency}</SSectionH5>
          </Col>
          <Col md={2} className={"col"}>
            <SSectionH5>{propertyData.room_number.replace(/"/g,"")} | {propertyData.bathroom_number} bthr</SSectionH5>
          </Col>
        </Row>
        <Row>
          <SSectionH5>{propertyData.property_floor_number}/{propertyData.max_floor_number} floor</SSectionH5>
        </Row>

        <Row className="sectioned-row">
          <SSectinWrapper>
            <SSectionH4>Location</SSectionH4>
          </SSectinWrapper>
        </Row>
        <Row>
          <Col className={"col"}>
            <SSectionH5>Street: {streetData.street_name}, b.{streetData.street_number}</SSectionH5>
          </Col>
        </Row>

        <Row className="sectioned-row">
          <SSectinWrapper>
            <SSectionH4>Listing activity</SSectionH4>
          </SSectinWrapper>
        </Row>
        <Row>
          <Col className={"col col-date"}>
            <SSectionH5> {listingData.listing_is_active.valueOf() ? "Listing is active" : "Listing not active any more"}</SSectionH5>
          </Col>
        </Row>
        <Row>
          <Col className={"col col-date"}>
            <SSectionH5>Added {new Date(listingData.created_at).toDateString()}</SSectionH5>
          </Col>
        </Row>
        <Row>
          <Col className={"col col-date"}>
            <SSectionH5>Updated {new Date(listingData.updated_at).toDateString()}</SSectionH5>
          </Col>
        </Row>

      </Container>
    </SContainer>
  );
};

class PropertyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPayload: "",
      listingData: {
        property_listing: {
          property_id: "",
          addresses_id: "",
          user_id: "",
          listing_description: "",
          listing_price: "",
          listing_currency: "usd",
          listing_is_active: true,
          created_at: "",
          updated_at: "",
          addresses: {
            street_name: "",
            street_number: "",
            city_id: "",
            country_id: "",
          }
        },
        property: {
          property_id: "",
          room_number: "",
          construction_type: "",
          kids_allowed: false,
          pets_allowed: false,
          area: "",
          bathroom_number: "",
          max_floor_number: "",
          property_floor_number: ""
        },
        address: {
          addresses_id: "",
          street_name: "",
          street_number: "",
          city_id: "",
        },
        listingQueue: {
          queue: [],

        }
      }
    }
  }

  componentWillMount() {
    const {auth} = this.props;

    // Decode JWT data and get User Id
    let token = decode(auth);
    this.setState({
      userPayload: token
    });

    const {id} = this.props.match.params;
    console.log("property id is", id);


    Axios
      .get(`http://localhost:2308/api/pages/data/${id}`)
      .then(response => {
        console.log(response);

        this.setState({
          listingData: response.data.listing_data,
        }, () => {console.log("listing data", this.state.listingData)});
      })
      .catch(error => console.log(error));
  }

  render() {
    return(
      <Container>
        <Row>
          <Col sm={12} md={8}>
            <PropertyDescription
              listingData={this.state.listingData.property_listing}
              propertyData={this.state.listingData.property}
              streetData={this.state.listingData.address}
            />
          </Col>
          <Col sm={12} md={4}>
            <Row>
              <PropertyQueue
                propertyID={this.props.match.params.id}
                />
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default requireAuth(PropertyPage);