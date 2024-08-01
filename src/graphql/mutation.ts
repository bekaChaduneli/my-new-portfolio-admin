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
  mutation CreateOneAboutMe($input: AboutMeCreateInput!) {
    createOneAboutMe(data: $input) {
      id
    }
  }
`;

export const DELETE_ABOUTME = gql`
  mutation DeleteOneAboutMe($id: String!) {
    deleteOneAboutMe(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_ABOUTME = gql`
  mutation updateOneAboutMe($data: AboutMeUpdateInput!, $id: String!) {
    updateOneAboutMe(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_WORK = gql`
  mutation createOneWorks($input: WorksCreateInput!) {
    createOneWorks(data: $input) {
      id
    }
  }
`;

export const DELETE_WORKS = gql`
  mutation deleteOneWorks($id: String!) {
    deleteOneWorks(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_WORKS = gql`
  mutation updateOneWorks($data: WorksUpdateInput!, $id: String!) {
    updateOneWorks(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_EDUCATION = gql`
  mutation createOneEducations($input: EducationsCreateInput!) {
    createOneEducations(data: $input) {
      id
    }
  }
`;

export const DELETE_EDUCATIONS = gql`
  mutation deleteOneEducations($id: String!) {
    deleteOneEducations(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_EDUCATIONS = gql`
  mutation updateOneEducations($data: EducationsUpdateInput!, $id: String!) {
    updateOneEducations(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_LANGUAGE = gql`
  mutation createOneLanguages($input: LanguagesCreateInput!) {
    createOneLanguages(data: $input) {
      id
    }
  }
`;

export const DELETE_LANGUAGES = gql`
  mutation deleteOneLanguages($id: String!) {
    deleteOneLanguages(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_LANGUAGES = gql`
  mutation updateOneLanguages($data: LanguagesUpdateInput!, $id: String!) {
    updateOneLanguages(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_GITHUBREPO = gql`
  mutation createOneGithubRepos($input: GithubReposCreateInput!) {
    createOneGithubRepos(data: $input) {
      id
    }
  }
`;

export const DELETE_GITHUBREPOS = gql`
  mutation deleteOneGithubRepos($id: String!) {
    deleteOneGithubRepos(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_GITHUBREPO = gql`
  mutation updateOneGithubRepos($data: GithubReposUpdateInput!, $id: String!) {
    updateOneGithubRepos(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_LINKEDIN = gql`
  mutation createOneLinkedin($input: LinkedinCreateInput!) {
    createOneLinkedin(data: $input) {
      id
    }
  }
`;

export const DELETE_LINKEDIN = gql`
  mutation deleteOneLinkedin($id: String!) {
    deleteOneLinkedin(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_LINKEDIN = gql`
  mutation updateOneLinkedin($data: LinkedinUpdateInput!, $id: String!) {
    updateOneLinkedin(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation createOneQuestions($input: QuestionsCreateInput!) {
    createOneQuestions(data: $input) {
      id
    }
  }
`;

export const DELETE_QUESTIONS = gql`
  mutation DeleteOneQuestions($id: String!) {
    deleteOneQuestions(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_QUESTIONS = gql`
  mutation UpdateOneQuestions($data: QuestionsUpdateInput!, $id: String!) {
    updateOneQuestions(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_HOBBY = gql`
  mutation createOneHobbys($input: HobbysCreateInput!) {
    createOneHobbys(data: $input) {
      id
    }
  }
`;

export const DELETE_HOBBYS = gql`
  mutation DeleteOneHobbys($id: String!) {
    deleteOneHobbys(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_HOBBYS = gql`
  mutation UpdateOneHobbys($data: HobbysUpdateInput!, $id: String!) {
    updateOneHobbys(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_SOCIAL = gql`
  mutation createOneSocials($input: SocialsCreateInput!) {
    createOneSocials(data: $input) {
      id
    }
  }
`;

export const DELETE_SOCIALS = gql`
  mutation DeleteOneSocials($id: String!) {
    deleteOneSocials(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_SOCIALS = gql`
  mutation UpdateOneSocials($data: SocialsUpdateInput!, $id: String!) {
    updateOneSocials(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_POST = gql`
  mutation createOnePosts($input: PostsCreateInput!) {
    createOnePosts(data: $input) {
      id
    }
  }
`;

export const DELETE_POSTS = gql`
  mutation DeleteOnePosts($id: String!) {
    deleteOnePosts(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_POSTS = gql`
  mutation UpdateOnePosts($data: PostsUpdateInput!, $id: String!) {
    updateOnePosts(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation createOneProfile($input: ProfileCreateInput!) {
    createOneProfile(data: $input) {
      id
    }
  }
`;

export const DELETE_PROFILE = gql`
  mutation deleteOneProfile($id: String!) {
    deleteOneProfile(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateOneProfile($data: ProfileUpdateInput!, $id: String!) {
    updateOneProfile(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_RECOMMENDATION = gql`
  mutation createOneRecommendations($input: RecommendationsCreateInput!) {
    createOneRecommendations(data: $input) {
      id
    }
  }
`;

export const DELETE_RECOMMENDATIONS = gql`
  mutation deleteOneRecommendations($id: String!) {
    deleteOneRecommendations(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_RECOMMENDATIONS = gql`
  mutation UpdateOneRecommendations(
    $data: RecommendationsUpdateInput!
    $id: String!
  ) {
    updateOneRecommendations(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_SERVICES = gql`
  mutation createOneServices($input: ServicesCreateInput!) {
    createOneServices(data: $input) {
      id
    }
  }
`;

export const DELETE_SERVICES = gql`
  mutation deleteOneServices($id: String!) {
    deleteOneServices(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_SERVICES = gql`
  mutation UpdateOneServices($data: ServicesUpdateInput!, $id: String!) {
    updateOneServices(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_SKILLS = gql`
  mutation createOneSkills($input: SkillsCreateInput!) {
    createOneSkills(data: $input) {
      id
    }
  }
`;

export const DELETE_SKILLS = gql`
  mutation deleteOneSkills($id: String!) {
    deleteOneSkills(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_SKILLS = gql`
  mutation updateOneSkills($data: SkillsUpdateInput!, $id: String!) {
    updateOneSkills(data: $data, where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_TOPSKILL = gql`
  mutation createOneTopSkills($input: TopSkillsCreateInput!) {
    createOneTopSkills(data: $input) {
      id
    }
  }
`;

export const DELETE_TOPSKILLS = gql`
  mutation deleteOneTopSkills($id: String!) {
    deleteOneTopSkills(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_TOPSKILLS = gql`
  mutation updateOneTopSkills($data: TopSkillsUpdateInput!, $id: String!) {
    updateOneTopSkills(data: $data, where: { id: $id }) {
      id
    }
  }
`;
