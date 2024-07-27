import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query findManyBooks {
    findManyBooks {
      finished
      id
      image
      index
      link
      pages
      readedPages
      releaseDate
      type
      translations(where: {}) {
        updatedAt
        title
        description
        createdAt
        booksId
        author
        id
        languageCode
      }
    }
  }
`;

export const GET_BOOK = gql`
  query findUniqueBooks($id: BookInput!) {
    findUniqueBooks(where: { id: $id }) {
      finished
      id
      image
      index
      link
      pages
      readedPages
      releaseDate
      type
      translations {
        updatedAt
        title
        languageCode
        id
        description
        createdAt
        booksId
        author
      }
    }
  }
`;

export const GET_BOOK_BY_TYPE = gql`
  query findManyBooks($type: BookType!) {
    findManyBooks(where: {type: {equals: $type}}) {
    finished
    id
    image
    index
    link
    pages
    readedPages
    releaseDate
    type
    translations {
      updatedAt
      title
      description
      createdAt
      booksId
      author
      id
      languageCode
    }
  }
  }
`

