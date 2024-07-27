import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query findManyBooks($orderBy: [BookInput!], $where: BookInput) {
    findManyBooks(orderBy: $orderBy, where: $where) {
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
    findManyBooks(where: { type: { equals: $type } }) {
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
`;

export const GET_ABOUTME = gql`
  query aboutMe($id: AboutMeInput) {
    aboutMe(where: { id: $id }) {
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
`;

export const GET_ARCHIVES = gql`
  query archives($orderBy: [ArchiveInput!], $where: ArchiveInput) {
    archives(orderBy: $orderBy, where: $where) {
      updatedAt
      translations {
        updatedAt
        name
        location
        languageCode
        id
        description
        createdAt
        archiveId
      }
      skills
      link
      isReal
      id
      github
      createdAt
      background
    }
  }
`;

export const GET_ARCHIVE = gql`
  query archive($id: ArchiveInput!) {
    archive(where: { id: $id }) {
      updatedAt
      skills
      link
      isReal
      id
      github
      createdAt
      background
      translations {
        updatedAt
        name
        location
        languageCode
        description
        id
        createdAt
        archiveId
      }
    }
  }
`;

export const GET_ARCHIVES_BY_REAL = gql`
  query archives($real: ArchiveInput!) {
    archives(where: { isReal: { equals: $real } }) {
      updatedAt
      translations {
        updatedAt
        name
        location
        languageCode
        id
        description
        createdAt
        archiveId
      }
      skills
      link
      isReal
      id
      github
      createdAt
      background
    }
  }
`;

export const GET_MAINPROJECT = gql`
  query findUniqueMainProjects($id: MainProjectInput!) {
    findUniqueMainProjects(where: { id: $id }) {
      video
      updatedAt
      skills
      mobileBackgrounds
      link
      isReal
      images
      id
      github
      createdAt
      background
      translations {
        name
        updatedAt
        mainProjectsId
        location
        languageCode
        description
        id
        createdAt
        archiveId
        about
      }
    }
  }
`;

export const GET_MAINPROJECTS = gql`
  query findManyMainProjects(
    $orderBy: [MainProjectOrderByWithRelationInput!]
    $where: MainProjectInputWhereInput
  ) {
    findManyMainProjects(orderBy: $orderBy, where: $where) {
      video
      updatedAt
      translations {
        updatedAt
        name
        mainProjectsId
        location
        languageCode
        id
        description
        createdAt
        archiveId
        about
      }
      skills
      mobileBackgrounds
      link
      isReal
      images
      id
      github
      createdAt
      background
    }
  }
`;

export const GET_BLOGS = gql`
  query findManyBlogs($orderBy: [BlogInput!], $where: BlogInput) {
    findManyBlogs(orderBy: $orderBy, where: $where) {
      updatedAt
      link
      id
      createdAt
      background
      translations {
        updatedAt
        languageCode
        id
        headline
        createdAt
        blogsId
        about
      }
    }
  }
`;

export const GET_GITHUBREPOS = gql`
  query FindManyGithubRepos(
    $orderBy: [GithubRepoInput!]
    $where: GithubRepoInput
  ) {
    findManyGithubRepos(orderBy: $orderBy, where: $where) {
      updatedAt
      translations {
        updatedAt
        title
        languageCode
        id
        githubReposId
        description
        createdAt
      }
      stars
      link
      language
      id
      createdAt
    }
  }
`;
