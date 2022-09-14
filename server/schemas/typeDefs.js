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
    summary: String
    link: String
    header: String!
    location: String!
    latitude: Number
    longitude: Number
  }

  type Events {
    eventId: ID!
    location: String
    date: [String]
    longitude: Number
    latitude: Number
    summary: String
    link: String
    header: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input MomentInput {
    summary: String
    link: String
    header: String!
    location: String!
    latitude: Number
    longitude: Number
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
