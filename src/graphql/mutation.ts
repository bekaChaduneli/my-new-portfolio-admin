import { gql } from "@apollo/client";

export const CREATE_BOOK = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(input: $input) {
      id
      title
      author
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteOneBooks($id: BookInput!) {
    deleteOneBooks(where: { id: $id }) {
      id
    }
  }
`;

export const LOGIN = gql`
  mutation loginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      token
      admin {
        id
      }
    }
  }
`;

export const VALIDATE_TOKEN = gql`
  mutation validateToken($token: String!) {
    validateToken(token: $token) {
      isValid
      token
      admin {
        id
      }
    }
  }
`;

export const CREATE_BLOG = gql`
  mutation CreateBLOG($input: BlogInput!) {
    createBlogs(data: $input) {
      id
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation DeleteOneBlogs($id: BookInput!) {
    deleteOneBlogs(where: { id: $id }) {
      id
    }
  }
`;
