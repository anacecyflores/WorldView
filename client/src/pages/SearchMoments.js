import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import { QUERY_ME } from '../utils/queries.js';
import { useQuery } from '@apollo/client';
import { Stars } from '@react-three/drei';

import { ApolloClient, useMutation } from '@apollo/client';
import { SAVE_MOMENT } from '../utils/mutations';
import { saveMomentIds, getSavedMomentIds } from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchMoments = () => {
  // create state for holding returned google api data
  const [searchedMoments, setSearchedMoments] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedMomentIds, setSavedMomentIds] = useState(getSavedMomentIds());

  const [saveMoment, { error }] = useMutation(SAVE_MOMENT);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveMomentIds(savedMomentIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      //eslint-disable-next-line
      const response = useQuery(QUERY_ME).data;

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = response.json();

      const momentData = items.map((moment) => ({
        momentId: moment.id,
        header: moment.header,
        summary: moment.summary,
      }));

      setSearchedMoments(momentData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveMoment = async (momentId) => {
    // find the book in `searchedBooks` state by the matching id
    const momentToSave = searchedMoments.find(
      (moment) => moment.momentId === momentId
    );

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveMoment({
        variables: { momentData: { ...momentToSave } },
      });
      setSavedMomentIds([...savedMomentIds, momentToSave.momentId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Jumbotron fluid className="text-light">
        <Container>
          <h1 id="header">Welcome to WorldView!</h1>
          <p className="text-center font">
            Spin the Globe and click or hover over any coordinates to learn
            about a historical event in time. Create an account to save your
            favorite historical events, or search for an event by keyword and
            select a century to begin!
          </p>

          <Form
            onSubmit={handleFormSubmit}
            style={{
              textAlign: 'center',
            }}
          >
            <Row>
              <Col>
                {/* <p>Event</p> */}
                <Form.Control
                  name="eventSearchInput"
                  // value={searchInput}
                  // onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="sm"
                  style={{
                    display: 'inline',
                  }}
                  placeholder="ie: Louisiana Purchase, World War I, Pearl Harbor"
                />
              </Col>
              <Col
                className="mt-1"
                style={{
                  textAlign: 'center',
                }}
              >
                {/* <p>Century</p> */}
                <Form.Control
                  as="select"
                  size="sm"
                  style={{
                    display: 'inline',
                  }}
                >
                  <option>Select a Century</option>
                  <option value="1">1800's</option>
                  <option value="2">1900's</option>
                  <option value="3">2000's</option>
                </Form.Control>
              </Col>
            </Row>
            <Button
              as="input"
              type="button"
              value="Search Events 🌎"
              size="med"
              className="mt-1"
            />
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMoments.length
            ? `Viewing ${searchedMoments.length} results:`
            : ''}
        </h2>
        <CardColumns>
          {searchedMoments.map((moment) => {
            return (
              <Card key={moment.momentId} border="dark">
                {moment.image ? (
                  <Card.Img
                    src={moment.image}
                    alt={`The cover for ${moment.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{moment.title}</Card.Title>
                  <p className="small">Authors: {moment.authors}</p>
                  <Card.Text>{moment.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMomentIds?.some(
                        (savedId) => savedId === moment.momentId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveMoment(moment.momentId)}
                    >
                      {savedMomentIds?.some(
                        (savedId) => savedId === moment.momentId
                      )
                        ? 'Event Already Saved!'
                        : 'Save This Event!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchMoments;
