import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Container from "react-bootstrap/Container";

import { useMutation } from "@apollo/client";
import { SAVE_MOMENT } from "../utils/mutations";
import { saveMomentIds, getSavedMomentIds } from "../utils/localStorage";

import Auth from "../utils/auth";

const SearchMoments = () => {
  // create state for holding returned google api data
  const [searchedMoments, setSearchedMoments] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedMomentIds, setSavedMomentIds] = useState(getSavedMomentIds());

  const [saveMoment, { error }] = useMutation(SAVE_MOMENT);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveMomentIds(savedMomentIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const momentData = items.map((moment) => ({
        momentId: moment.id,
        authors: moment.volumeInfo.authors || ["No author to display"],
        title: moment.volumeInfo.title,
        description: moment.volumeInfo.description,
        image: moment.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedMoments(momentData);
      setSearchInput("");
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
      console.log(savedMomentIds);
      setSavedMomentIds([...savedMomentIds, momentToSave.momentId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1 id="header">Welcome to WorldView!</h1>
          <p className="text-center">
            Find the location of a country's historical moments on the WorldView
            globe! Fill out the form below to begin.
          </p>

          <Form onSubmit={handleFormSubmit}>
            <h5>Country</h5>
            <Form.Row>
              <Col xs={16} md={12}>
                <Form.Control
                  name="countrySearchInput"
                  // value={searchInput}
                  // onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="sm"
                  placeholder="ie: United Kingdom"
                />
              </Col>
            </Form.Row>
            <h5>Moment</h5>
            <Form.Row>
              <Col xs={16} md={12}>
                <Form.Control
                  name="eventSearchInput"
                  // value={searchInput}
                  // onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="sm"
                  placeholder="ie: Queen Elizabeth's II Death"
                />
                <h5>Century</h5>
                <Form.Control as="select" size="sm">
                  <option>Select a Century</option>
                  <option value="1">1800's</option>
                  <option value="2">1900's</option>
                  <option value="3">2000's</option>
                </Form.Control>
              </Col>
              <Col xs={12} md={4} className="mt-2 text-center">
                <Button
                  as="input"
                  type="button"
                  className="text-center"
                  value="Search 🌎"
                  size="med"
                />{" "}
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMoments.length
            ? `Viewing ${searchedMoments.length} results:`
            : ""}
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
                        ? "Event Already Saved!"
                        : "Save This Event!"}
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
