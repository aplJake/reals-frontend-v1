import React from "react";
import {Col, Row} from "react-bootstrap";
import SideProfile from "./SideProfile";
import PropertyQueue from "./PropertyQueue";
import Axios from "axios";

const PropertyDescription = ({props}) => (
  <div>Property description</div>
)
class PropertyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listingData: {
        listing: {},
        property: {},
        queue: {},
        sellerProfile: {},
      }
    }
  }

  componentWillMount() {
    const {id} = this.props.match.params;
    console.log("property id is", id);


    Axios
      .get(`http://localhost:2308/api/pages/data/${id}`)
      .then(response => {
        console.log(response);

        this.setState({
          listingData: response.data.listing_data,
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    return(
      <div>
        <Row>
          <Col sm={8} md={8}>
            <PropertyDescription />
          </Col>
          <Col sm={2} md={2}>
            <Row>
              <SideProfile />
            </Row>
            <Row>
              <PropertyQueue />
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PropertyPage;