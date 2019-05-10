import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";

const Style = styled.div`
  h4 {
    font-size: 16px;
  }
  .desc {
    font-size: 14px;
    color: darkgrey;
  }
`;
export const UserProfile = ({ userName, isProfile, createdAt, updatedAt }) => (
  <Style>
      <Col>
        <h3>
          {userName}
        </h3>
      </Col>
    {/* <Row>

      <Col md="3">
        <h4 className="desc">Created at{createdAt}</h4>
      </Col>
      <Col md="3">
        <h4 className="desc">Last update{updatedAt}</h4>
      </Col>
    </Row> */}
    {/* {isProfile && ( )} */}
  </Style>
);
