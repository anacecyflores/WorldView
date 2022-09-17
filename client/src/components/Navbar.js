import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Mason from '../assets/screenshots/mason.jpeg';
import Cristian from '../assets/screenshots/cristian.jpeg';
import Ana from '../assets/screenshots/ana.jpeg';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_MOMENT } from '../utils/mutations';
import { removeMomentId, saveMomentIds } from '../utils/localStorage';



const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  let historyArr = [];

  var historyData = JSON.parse(localStorage.getItem('historyKey')) || [];
  if (historyData) {
    historyArr.push(historyData);
  }

  //load saved events
  const { error, loading, data } = useQuery(QUERY_ME);
  // const [removeMoment, { error }] = useMutation(REMOVE_MOMENT);

  // console.log(data);
  const userData = data?.me || {};
  // console.log(userData);
  const cristianGithubLink = 'www.github.com/vcristian1'

  if (loading) {
    return <h2>LOADING...</h2>;
  }

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
                    {' '}
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
        <Tab.Container defaultActiveKey="login">
          <Modal.Header className="bg-dark">
            <Modal.Title
              id="signup-modal"
              style={{
                textAlign: 'center',
                fontFamily: 'Space Mono',
              }}
            >
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link className="bg-dark" eventKey="login">
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="bg-dark" eventKey="signup">
                    Sign Up
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              backgroundColor: 'darkgray',
              fontFamily: 'Space Mono',
            }}
          >
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
        style={{
          color: 'white',
        }}
        show={showAboutModal}
        onHide={() => setShowAboutModal(false)}
        aria-labelledby="about-modal"
      >
        {/* tab container to do either signup or login component */}
        <Modal.Header className="bg-dark">
          <Modal.Title
            style={{
              textAlign: 'center',
              fontFamily: 'Space Mono',
            }}
          >
            What is WorldView and How to Use It?
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            backgroundColor: 'darkgray',
            fontFamily: 'Space Mono',
          }}
        >
          <Card id='card' >
            <Card.Body style={{ width: '21rem' }}>
              <Card.Text style={{
                color: 'black',
                width: '27rem'
              }}>
              🌎 WorldView is an educational application created using React.js,
              GraphQL, MongoDB, Three.js, and React-three-fiber, a React renderer for
              Three.js. This application functions as visual educational resource
              for students of all ages to learn about historical moments that
              occured in different centuries around the globe. Be sure to create an
              account so you can save your favorite moments in history.
              </Card.Text>
            </Card.Body>
            <Card.Body>
              <Card.Text style={{
                color: 'black'
              }}>
              <p>
                Creators: Ana Cecy Flores, Cristian Vargas, Mason
                Benson
              </p>
              </Card.Text>
              <Row>
                <Col sm>
                  <img src={Ana} className="img-fluid rounded" alt="example" />
                </Col>
                <Col sm>
                  <img
                    src={Cristian}
                    className="img-fluid rounded"
                    alt="example"
                  />
                </Col>
                <Col sm>
                  <img
                    src={Mason}
                    className="img-fluid rounded"
                    alt="example"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      {/* set modal data up */}
      <Modal
        size="lg"
        show={showSavedModal}
        style={{
          color: 'white',
        }}
        onHide={() => setShowSavedModal(false)}
        aria-labelledby="saved-modal"
      >
        {/* tab container to do either signup or login component */}
        <Modal.Header className="bg-dark">
          <Modal.Title
            style={{
              textAlign: 'center',
              fontFamily: 'Space Mono',
            }}
          >
            Saved Events
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: 'darkgray',
            fontFamily: 'Space Mono',
          }}
        >
          <Card id='card'>
            <Card.Body style={{ width: '21rem' }}>
              <Card.Title style={{
                color: 'black'
              }}>🌎 {historyData.header}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{historyData.location}, {historyData.date}</Card.Subtitle>
              <Card.Text style={{
                color: 'black',
                width: '27rem'
              }}>
              {historyData.summary}
              <a
                className="btn btn-success"
                href={historyData.link}
                rel="noreferrer"
                target={'_blank'}
              >
                Learn More
              </a>
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
