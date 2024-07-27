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
  query findManyBooks($type: BookInput!) {
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

export const GET_ABOUTME = gql`
  query aboutMe($id: AboutMeInput) {
    aboutMe(where: {id: $id}) {
    works {
      updatedAt
      translations {
        worksId
        updatedAt
        role
        locationType
        location
        languageCode
        id
        employmentType
        description
        createdAt
        company
      }
      toDate
      link
      id
      fromDate
      createdAt
      aboutMeId
      aboutMe {
        updatedAt
        translations {
          updatedAt
          role
          name
          languageCode
          createdAt
          id
          country
          city
          aboutMeId
          about
        }
        age
        createdAt
        experience
        id
        image
        projectNum
      }
    }
    age
    certificates {
      aboutMeId
      createdAt
      expirationDate
      image
      id
      issueDate
      link
      translations {
        certificatesId
        createdAt
        description
        id
        languageCode
        name
        organiation
        updatedAt
      }
      updatedAt
    }
    createdAt
    education {
      createdAt
      fromDate
      id
      link
      toDate
      updatedAt
      translations {
        createdAt
        degree
        description
        educationsId
        fieldOfStudy
        gpa
        id
        languageCode
        name
        updatedAt
      }
    }
    experience
    id
    image
    projectNum
    updatedAt
    languages {
      id
      createdAt
      aboutMeId
      updatedAt
      translations {
        updatedAt
        name
        level
        languagesId
        languageCode
        id
        description
        createdAt
      }
    }
    translations {
      updatedAt
      role
      name
      languageCode
      id
      createdAt
      country
      city
      about
    }
  }
  }
`

