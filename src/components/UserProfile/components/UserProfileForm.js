import React, {Component} from "react";
import {Button, Col, FormControl, FormGroup, Row} from "react-bootstrap";

export default class UserProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      newProfile: {
        profileDescription: "",
        createdAt: "",
        updatedAt: ""
      }
    };
  }

  componentDidMount() {
    this.setState({
      newProfile: {
        // userId: this.props.currentProfile.userId,
        profileDescription: this.props.currentProfile.profileDescription,
      }
    });
  }

  handleInput = e => {
    let value = e.target.value;
    // let name = e.target.name;
    this.setState(
      prevState => ({
        newProfile: {
          ...prevState.newProfile,
          profileDescription: value
        }
      }),
      () => console.log(this.state.newProfile)
    );
  };

  submitForm = () => {
    this.props.updateDescription(this.state.newProfile);
    console.log("change");
    this.props.handleFormClose(false)
  };

  render() {
    return (
      <Row>
        <Col md="10" sm={"10"}>
          <form
          >
            <FormGroup controlId="profile_description">
              <FormControl
                autoComplete="off"
                type="text"
                placeholder="Enter your profile description"
                value={this.state.newProfile.profileDescription}
                onChange={this.handleInput}
              />
            </FormGroup>
          </form>
        </Col>
        <Col md="2" sm={"2"} className="to-right">
          <Button
            type="submit"
            onClick={this.submitForm}
            className="to-right"
          >
            Add
          </Button>
        </Col>
      </Row>
    );
  }
}