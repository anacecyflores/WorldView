import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_MOMENT = gql`
  mutation saveMoment($momentData: MomentInput!) {
    saveMoment(momentData: $momentData) {
      _id
      username
      email
      savedMoments {
        momentId
        location
        header
        summary
        lattitude
        longitude
        link
      }
    }
  }
`;

export const REMOVE_MOMENT = gql`
  mutation removeMoment($momentId: ID!) {
    removeMoment(momentId: $momentId) {
      _id
      username
      email
      savedMoments {
        momentId
        location
        header
        summary
        lattitude
        longitude
        link
      }
    }
  }
`;
