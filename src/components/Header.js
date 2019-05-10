import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./HeaderStyle.css";
import { Nav, Navbar, Button, Container } from "react-bootstrap";
import styled from "styled-components";

const Style = styled.div`
  .navbar-brand {
    font-weight: 600;
  }

  .navbar-light .navbar-nav .nav-link {
    color: black;
    font-size: 16px;
    font-weight: 500;
    margin: 0 5px;
  }

  .btn {
    margin: 2px 5px;
    padding: 3px 9px;
    font-size: 16px;
  }
`;

class Header extends Component {
  renderLinks() {
    if (this.props.authenticated) {
      return (
        <Fragment>
          <Nav.Item>
            <Link to="/signout">
              <Button variant="outline-primary">Sign Out</Button>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/profile">
              <Button variant="primary">My Profile</Button>
            </Link>
          </Nav.Item>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Nav.Item>
            <Link to="/signup">
              <Button variant="outline-primary">Sign Up</Button>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/signin">
              <Button variant="primary">Sign In</Button>
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
    return (
      <Style>
        <Container>
          <Navbar expand="lg">
            <Link to="/">
              <Navbar.Brand>Reals</Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
                <Nav.Item>
                  <Nav.Link as={Link} to="/new-buildings">
                    New Buildings
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/new-buildings">
                    New Buildings
                  </Nav.Link>
                </Nav.Item>
                {this.renderLinks()}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </Style>

      // <Link to="/">Redux Auth</Link>
      // {this.renderLinks()}
    );
  }
}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps)(Header);
