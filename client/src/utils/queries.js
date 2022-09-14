import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
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
