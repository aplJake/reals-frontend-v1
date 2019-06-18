import React, {Component} from "react";
import {connect} from "react-redux";
import * as actions from "../../actions";
import {AuthWrapper} from "./AuthWrapper";

class Signout extends Component {
  componentDidMount() {
    this.props.signout();
  }

  render() {
    return (
      <AuthWrapper>
        <h3>Hope to see you again</h3>
      </AuthWrapper>
    );
  }
}

export default connect(
  null,
  actions
)(Signout);
