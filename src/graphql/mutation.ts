import { gql } from "@apollo/client";

export const CREATE_BOOK = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(data: $input) {
      id
      title
      author
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteOneBooks($id: IdInput!) {
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
  mutation DeleteOneBlogs($id: IdInput!) {
    deleteOneBlogs(where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_ARCHIVE = gql`
  mutation CreateArchive($input: ArchiveInput!) {
    createArchive(data: $input) {
      id
    }
  }
`;

export const DELETE_ARCHIVE = gql`
  mutation DeleteOneArchives($id: IdInput!) {
    deleteOneArchive(where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_MAINPROJECT = gql`
  mutation CreateMainProject($input: MainProjectInput!) {
    createMainProject(data: $input) {
      id
    }
  }
`;

export const DELETE_MAINPROJECT = gql`
  mutation DeleteOneMainProjects($id: IdInput!) {
    deleteOneMainProjects(where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_ABOUTME = gql`
  mutation CreateAboutMe($input: AboutMeInput!) {
    createAboutMe(data: $input) {
      id
    }
  }
`;

export const DELETE_ABOUTME = gql`
  mutation DeleteOneAboutMe($id: IdInput!) {
    deleteOneAboutMe(where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_GITHUBREPO = gql`
  mutation CreateGithubRepo($input: GithubRepoInput!) {
    createGithubRepo(data: $input) {
      id
    }
  }
`;

export const DELETE_GITHUBREPO = gql`
  mutation DeleteOneGithubRepo($id: IdInput!) {
    deleteOneGithubRepo(where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_LINKEDIN = gql`
  mutation CreateLinkedin($input: LinkedinInput!) {
    createLinkedin(data: $input) {
      id
    }
  }
`;

export const DELETE_LINKEDIN = gql`
  mutation DeleteOneLinkedin($id: IdInput!) {
    deleteOneLinkedin(where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CreateProfile($input: ProfileInput!) {
    createProfile(data: $input) {
      id
    }
  }
`;

export const DELETE_PROFILE = gql`
  mutation DeleteOneProfile($id: IdInput!) {
    deleteOneProfile(where: { id: $id }) {
      id
    }
  }
`;
