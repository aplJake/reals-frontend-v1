import React from "react";
import {Button, Container, Row} from "react-bootstrap";
import styled from "styled-components";
import Axios from "axios";
import Col from "react-bootstrap/Col";


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
const SSectinWrapper = styled.div`
    margin: 10px auto;
`;

const SContainer = styled.div`
  button {
    min-width: 100px;
    width: 100%;
  }
  
  .btn-wrapper {
    margin: 0 auto;
  }
  .container {
    margin: 20px 10px;
    padding: 0 20px 20px;
    max-width: 300px;
    position: fixed;
    background: red;
    border-radius: 5px;
    background: #f5f5f5;
    -webkit-box-shadow: 0 4px 5px -6px #999;
    -moz-box-shadow: 0 4px 5px -6px #999;
    box-shadow: 0 4px 5px -6px #999;
  }
`;

class PropertyQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      queueData: {
        profile: {},
        queue: [],
      },
    }
  };

  handleButtonClick = () => {
    if(!this.state.isOpened) {
      this.setState({isOpened: true});
    } else {
      this.getQueueData();
    }
  };

  getQueueData = () => {
    Axios
      .get(`http://localhost:2308/api/pages/data/${this.props.propertyID}/queue`)
      .then(response => {
        console.log(response);

        this.setState({
          queueData: response.data.queue_data,
        }, () => {console.log("queued data", this.state.queueData)});
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <Col>
        <SContainer>
          <Container>
            <Row>
              <SSectinWrapper>
                <SSectionH4>PropertyQueue</SSectionH4>
              </SSectinWrapper>
            </Row>
            {this.state.isOpened && (
              <Row>
                <h4>Some hidden data</h4>
              </Row>
            )}
            <Row>
              <Col sm={8} md={8} className={"btn-wrapper"}>
                <Button primary onClick={()=>{this.handleButtonClick()}}>
                  {this.state.isOpened ? ("Add"):("Show")}
                </Button>
              </Col>
            </Row>
          </Container>
        </SContainer>
      </Col>
    );
  }
}

export default PropertyQueue;