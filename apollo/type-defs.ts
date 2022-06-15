import { gql } from '@apollo/client'

export const typeDefs = gql`
  type User {
    username: String!
    name: String!
    lastname: String!
  }
  
  input SignUpInput {
    username: String!
    password: String!
    name: String!
    last_name: String!
    email: String!
  }
  input SignInInput {
    username: String!
    password: String!
  }
  type SignUpPayload {
    user: User!
  }
  type SignInPayload {
    user: User!
  }

  type Query {
    user(id: ID!): User!
    users: [User]!
    viewer: User
  }
  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
  }

`