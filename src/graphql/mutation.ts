import { gql } from "@apollo/client";

export const CREATE_BOOK = gql`
  mutation createOneBooks($data: BooksCreateInput!) {
    createOneBooks(data: $data) {
      id
      finished
      type
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation updateOneBooks($id: String!, $data: BooksUpdateInput!) {
    updateOneBooks(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const DELETE_BOOKS = gql`
  mutation DeleteOneBooks($id: String!) {
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
  mutation createOneBlogs($data: BlogsCreateInput!) {
    createOneBlogs(data: $data) {
      id
    }
  }
`;

export const DELETE_BLOGS = gql`
  mutation DeleteOneBlogs($id: String!) {
    deleteOneBlogs(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_BLOGS = gql`
  mutation UpdateOneBlogs($id: String!, $data: BlogsUpdateInput!) {
    updateOneBlogs(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_ARCHIVE = gql`
  mutation createOneArchive($input: ArchiveCreateInput!) {
    createOneArchive(data: $input) {
      id
    }
  }
`;

export const DELETE_ARCHIVE = gql`
  mutation DeleteOneArchive($id: String!) {
    deleteOneArchive(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_ARCHIVE = gql`
  mutation UpdateOneArchive($data: ArchiveUpdateInput!, $id: String!) {
    updateOneArchive(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_MAINPROJECT = gql`
  mutation createOneMainProjects($input: MainProjectsCreateInput!) {
    createOneMainProjects(data: $input) {
      id
    }
  }
`;

export const DELETE_MAINPROJECTS = gql`
  mutation deleteOneMainProjects($id: String!) {
    deleteOneMainProjects(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_MAINPROJECT = gql`
  mutation updateOneMainProjects(
    $data: MainProjectsUpdateInput!
    $id: String!
  ) {
    updateOneMainProjects(data: $data, where: { id: $id }) {
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

export const UPDATE_ABOUTME = gql`
  mutation UpdateOneAboutMe($data: AboutMeInput!, $where: AboutMeInput!) {
    updateOneAboutMe(data: $data, where: $where) {
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

export const DELETE_GITHUBREPOS = gql`
  mutation DeleteOneGithubRepos($id: IdInput!) {
    deleteOneGithubRepos(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_GITHUBREPO = gql`
  mutation UpdateOneGithubRepos(
    $data: GithubRepoInput!
    $where: GithubRepoInput!
  ) {
    updateOneGithubRepos(data: $data, where: $where) {
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

export const UPDATE_LINKEDIN = gql`
  mutation UpdateOneLinkedin($data: LinkedinInput!, $where: LinkedinInput!) {
    updateOneLinkedin(data: $data, where: $where) {
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

export const UPDATE_PROFILE = gql`
  mutation UpdateOneProfile($data: ProfileInput!, $where: ProfileInput!) {
    updateOneProfile(data: $data, where: $where) {
      id
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: PostInput!) {
    createPost(data: $input) {
      id
    }
  }
`;

export const DELETE_POSTS = gql`
  mutation DeleteOnePosts($id: IdInput!) {
    deleteOnePosts(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_POSTS = gql`
  mutation UpdateOnePosts($data: PostsInput!, $where: PostsInput!) {
    updateOnePosts(data: $data, where: $where) {
      id
    }
  }
`;

export const CREATE_RECOMMENDATION = gql`
  mutation CreateRecommendation($input: RecommendationInput!) {
    createRecommendation(data: $input) {
      id
    }
  }
`;

export const DELETE_RECOMMENDATIONS = gql`
  mutation DeleteOneRecommendations($id: IdInput!) {
    deleteOneRecommendations(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_RECOMMENDATIONS = gql`
  mutation UpdateOneRecommendations(
    $data: RecommendationsInput!
    $where: RecommendationsInput!
  ) {
    updateOneRecommendations(data: $data, where: $where) {
      id
    }
  }
`;

export const CREATE_SERVICES = gql`
  mutation CreateServices($input: ServicesInput!) {
    createServices(data: $input) {
      id
    }
  }
`;

export const DELETE_SERVICES = gql`
  mutation DeleteOneServices($id: IdInput!) {
    deleteOneServices(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_SERVICES = gql`
  mutation UpdateOneServices($data: ServicesInput!, $where: ServicesInput!) {
    updateOneServices(data: $data, where: $where) {
      id
    }
  }
`;

export const CREATE_SKILLS = gql`
  mutation CreateSkills($input: SkillsInput!) {
    createSkills(data: $input) {
      id
    }
  }
`;

export const DELETE_SKILLS = gql`
  mutation DeleteOneSkills($id: IdInput!) {
    deleteOneSkills(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_SKILLS = gql`
  mutation UpdateOneSkills($data: SkillsInput!, $where: SkillsInput!) {
    updateOneSkills(data: $data, where: $where) {
      id
    }
  }
`;

export const CREATE_TOPSKILL = gql`
  mutation CreateTopSkill($input: TopSkillInput!) {
    createTopSkill(data: $input) {
      id
    }
  }
`;

export const DELETE_TOPSKILLS = gql`
  mutation DeleteOneTopSkills($id: IdInput!) {
    deleteOneTopSkills(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_TOPSKILLS = gql`
  mutation UpdateOneTopSkills($data: TopSkillsInput!, $where: TopSkillsInput!) {
    updateOneTopSkills(data: $data, where: $where) {
      id
    }
  }
`;
