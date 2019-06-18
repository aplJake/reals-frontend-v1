import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import styled from "styled-components";


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
  border-bottom: 1px solid #efefef;
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

const ListingItem = ({listingId, listingDescription, price, currency, createdAt, updatedAt, removeOnClick}) => (
  <SSectionListing>
    <Container>
      <Row>
        <Col sm="10">
          <SSectinHeaderWrapper>
            <Link to={`/listing/${listingId}`}>{listingDescription}</Link>
          </SSectinHeaderWrapper>
        </Col>
        <Col sm="2" className="to-right">
          <SSectinHeaderWrapper>
            <SSectionH5>{price} {currency}</SSectionH5>
          </SSectinHeaderWrapper>
        </Col>
      </Row>
      <Row>
        <Col sm={"10"}>
          <Row>
            <Col><h6 className={"tiny-description"}>{new Date(createdAt).toDateString()}</h6></Col>
          </Row>
          <Row>
            <Col><h6 className={"tiny-description"}>{new Date(updatedAt).toDateString()}</h6></Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </SSectionListing>
);

export default ListingItem;