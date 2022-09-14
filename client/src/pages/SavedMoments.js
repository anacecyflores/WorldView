import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_MOMENT } from "../utils/mutations";
import { removeMomentId } from "../utils/localStorage";

import Auth from "../utils/auth";

const SavedMoments = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeMoment, { error }] = useMutation(REMOVE_MOMENT);

  const userData = data?.me || {};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteMoment = async (momentId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeMoment({
        variables: { momentId },
      });

      // upon success, remove book's id from localStorage
      removeMomentId(momentId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData.username}'sevents!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedMoments?.length
            ? `Viewing ${userData.savedMoments.length} saved ${
                userData.savedMoments.length === 1 ? "event" : "event"
              }:`
            : "You have no saved events!"}
        </h2>
        <CardColumns>
          {userData.savedMoments?.map((moment) => {
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
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteMoment(moment.momentId)}
                  >
                    Delete this event!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedMoments;
