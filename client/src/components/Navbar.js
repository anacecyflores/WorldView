import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            🗺 WorldView
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              <Nav.Link onClick={() => setShowAboutModal(true)}>About</Nav.Link>

              {/* if user is logged in show saved events and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link onClick={() => setShowSavedModal(true)}>
                    {" "}
                    {/* or as={Link} to="/saved" so it goes to another page, SavedMoments*/}
                    Saved Moments
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>
                  Sign Up/ Log In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>

      {/* set modal data up */}
      <Modal
        size="lg"
        show={showAboutModal}
        onHide={() => setShowAboutModal(false)}
        aria-labelledby="about-modal"
      >
        {/* tab container to do either signup or login component */}
        <Modal.Header closeButton>
          <Modal.Title>About</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            WorldView 🌎 is a React and GraphQL application, using react-globe,
            to function as an eductional resource for students to learn about
            historical moments around the world. Hover over any coordinate on
            the interactive globe to learn about a historical moment at that
            location, or fill in the prompt! Be sure to create an account and
            save your favorite moments in history.
          </p>
          <br></br>
          <p>
            <strong>Creators </strong>Ana Cecy Flores, Cristian Vargas, Mason
            Benson
          </p>
        </Modal.Body>
      </Modal>

      {/* set modal data up */}
      <Modal
        size="lg"
        show={showSavedModal}
        onHide={() => setShowSavedModal(false)}
        aria-labelledby="saved-modal"
      >
        {/* tab container to do either signup or login component */}
        <Modal.Header closeButton>
          <Modal.Title>Saved Moments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>No Saved Moments!</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
