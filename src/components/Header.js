import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import "./HeaderStyle.css";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import styled from "styled-components";

const Style = styled.div`
  .navbar-brand {
    font-weight: 500;
  }

  .navbar-light .navbar-nav .nav-link {
    color: black;
    font-size: 16px;
    font-weight: 400;
    margin: 0 5px;
  }

  .btn {
    margin: 2px 5px;
    padding: 3px 9px;
    font-size: 16px;
  }
  
  .navbar {
    background: white;
    -webkit-box-shadow: 0 8px 6px -6px #999;
    -moz-box-shadow: 0 8px 6px -6px #999;
    box-shadow: 0 4px 7px -6px #999;
  }
  
  a {
    font-weight: 400;
  }
`;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  renderLinks() {
    if (this.props.authenticated) {
      return (
        <Fragment>
          <Nav.Item>
            <Link to="/signout">
              <Button variant="link">Sign Out</Button>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/profile">
              <Button variant="link">My Profile</Button>
            </Link>
          </Nav.Item>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Nav.Item>

            <Link to="/signup">
              <Button variant="link">Sign Up</Button>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/signin">
              <Button variant="link">Sign In</Button>
            </Link>
            {/* <Button as={Link} to="/signin" variant="primary">
              Sign In
            </Button> */}
          </Nav.Item>
        </Fragment>
      );
    }
  }

  render() {
    // if( window.location.pathname === "/signup" ||
    //     window.location.pathname === "/signin" ||
    //     window.location.pathname === "/admin") {
    //   return null
    // }

    return (
      <Style>
        <Navbar expand="lg" className="fixed-top">
          <Container>

            <Link to="/">
              <Navbar.Brand>Reals</Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Item>
                  <Nav.Link as={Link} to="/homes">
                    Homes
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/apartments">
                    Apartments
                  </Nav.Link>
                </Nav.Item>
                {this.renderLinks()}
              </Nav>
            </Navbar.Collapse>
          </Container>

        </Navbar>
      </Style>

      // <Link to="/">Redux Auth</Link>
      // {this.renderLinks()}
    );

  }
}

function mapStateToProps(state) {
  return {authenticated: state.auth.authenticated};
}

export default connect(mapStateToProps)(Header);
