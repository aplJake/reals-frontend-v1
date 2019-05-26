import React from "react";
import { Col, Container, Jumbotron, FormControl } from "react-bootstrap";

export const BootstrapReduxField = ({ type, placeholder, input, min }) => (
  <FormControl
    type={type}
    placeholder={placeholder}
    value={input.value}
    min={min}
    onChange={input.onChange}
  />
);

export const AuthWrapper = props => (
  <Jumbotron>
    <Container>
      <Col md={{ span: 3, offset: 4 }}>{props.children}</Col>
    </Container>
  </Jumbotron>
);
