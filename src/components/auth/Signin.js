import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { Button, FormGroup, Form } from "react-bootstrap";
import { BootstrapReduxField, AuthWrapper } from "./AuthWrapper";

class Signin extends Component {
  onSubmit = formProps => {
    this.props.signin(formProps, () => {
      this.props.history.push("/feature");
    });
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <AuthWrapper>
        <h3>Sign In</h3>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <FormGroup controlId="email" bsSize="large">
            <Form.Label>Email</Form.Label>
            <Field
              name="email"
              type="text"
              component={BootstrapReduxField}
              placeholder="Enter your email"
              min="5"
              autoComplete="none"
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <Form.Label>Password</Form.Label>
            <Field
              name="password"
              type="password"
              component={BootstrapReduxField}
              placeholder="Enter your password"
              min="6"
              autoComplete="none"
            />
            <Form.Text className="text-muted">
              {this.props.errorMessage}
            </Form.Text>
          </FormGroup>
          <Button variant="primary" type="submit">
            Sign In
          </Button>
        </form>
      </AuthWrapper>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.errorMessage };
}

export default compose(
  connect(
    mapStateToProps,
    actions
  ),
  reduxForm({ form: "signin" })
)(Signin);