import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Mason from '../assets/screenshots/mason.jpeg'
import Cristian from '../assets/screenshots/cristian.jpeg'
import Ana from '../assets/screenshots/ana.jpeg'



const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  return (
    <>
      <Navbar bg="bg-black" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
          🌎 WorldView 
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
                    Saved Events
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
        style={{
          color: 'black',
          
          
        }}
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login" >
          <Modal.Header className="bg-dark">
            <Modal.Title id="signup-modal"
            style={{
              textAlign: 'center',
              fontFamily: 'Space Mono',
              
            }}>
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link className="bg-dark" eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="bg-dark" eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
          style={{
            backgroundColor: 'darkgray',
            fontFamily: 'Space Mono'
            
          }}>
            <Tab.Content >
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
        style={{
          color: 'white',
          
          
        }}
        show={showAboutModal}
        onHide={() => setShowAboutModal(false)}
        aria-labelledby="about-modal"
      >
        {/* tab container to do either signup or login component */}
        <Modal.Header className="bg-dark">
          <Modal.Title style={{
          textAlign: 'center',
          fontFamily: 'Space Mono'
          
        }}>What is WorldView, and how do we use it?</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{
          backgroundColor: 'darkgray',
          fontFamily: 'Space Mono'
        }}>
          <p>
            🌎 WorldView is an eductional application, using React.js, GraphQL, Three.js,
            React-three-fiber which is a React renderer for three.js. This application
            functions as visual eductional resource for students to learn about
            historical moments that occured in different centuries around the world. Hover over any coordinate on
            the globe to see the title of the event that occured, and click to see more!
            Be sure to create an account so you can save your favorite moments in history.
          </p>
          <br></br>
          <p>
            <strong>Creators </strong>Ana Cecy Flores, Cristian Vargas, Mason
            Benson
          </p>
          <Row>
            <Col sm>
              <img
              src={Ana}
              className='img-fluid rounded'
              alt='example'
              />
            </Col>
            <Col sm>
              <img
              src={Cristian}
              className='img-fluid rounded'
              alt='example'
              />
            </Col>
            <Col sm>
              <img
              src={Mason}
              className='img-fluid rounded'
              alt='example'
              />
            </Col>
          </Row>
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
          <Modal.Title>Saved Events</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>No Saved Events!</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
