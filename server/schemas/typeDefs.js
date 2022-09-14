const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    momentCount: Int
    savedMoment: [Moment]
  }

  type Moment {
    momentId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
  }

  type Events {
    eventId: ID!
    location: String
    date: [String]
    longitude: [String]
    latitude: [String]
    summary: String
    link: String
    header: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input MomentInput {
    authors: [String]
    description: String!
    momentId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveMoment(momentData: MomentInput!): User
    removeMoment(momentId: ID!): User
  }
`;

module.exports = typeDefs;
