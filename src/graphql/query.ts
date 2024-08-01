import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query GetBooks {
    findManyBooks {
      id
      image
      link
      pages
      readedPages
      type
      finished
      releaseDate
      index
      translations {
        id
        title
        description
        author
        languageCode
        booksId
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: String!) {
    book(where: { id: $id }) {
      id
      index
      pages
      readedPages
      type
      image
      link
      finished
      translations {
        id
        title
        description
        author
        languageCode
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
  query archives {
    archives {
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
  query findManyMainProjects {
    findManyMainProjects {
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
        markdown
        createdAt
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
  query findManyBlogs {
    findManyBlogs {
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
        markdown
      }
    }
  }
`;

export const GET_GITHUBREPOS = gql`
  query FindManyGithubRepos {
    findManyGithubRepos {
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

export const GET_LINKEDIN = gql`
  query findFirstLinkedin {
    findFirstLinkedin {
      banner
      createdAt
      id
      image
      link
      posts {
        linkedinId
        link
        likes
        image
        id
        createdAt
        commentsSum
        updatedAt
        translations {
          description
          id
          languageCode
          postsId
          reatedAt
          updatedAt
        }
      }
      topSkills {
        updatedAt
        linkedinId
        id
        createdAt
        translations {
          id
          createdAt
          languageCode
          name
          topSkillsId
          updatedAt
        }
      }
      updatedAt
      translations {
        updatedAt
        name
        university
        linkedinId
        languageCode
        id
        createdAt
        company
        bio
      }
    }
  }
`;

export const GET_POSTS = gql`
  query findManyPosts {
    findManyPosts {
      translations {
        updatedAt
        reatedAt
        postsId
        languageCode
        id
        description
      }
      updatedAt
      linkedinId
      link
      image
      likes
      id
      createdAt
      commentsSum
    }
  }
`;

export const GET_PROFILE = gql`
  query findFirstProfile {
    findFirstProfile {
      image
      age
      createdAt
      id
      mail
      resume
      updatedAt
      translations {
        updatedAt
        universityAbout
        university
        surname
        profession
        profileId
        name
        languageCode
        location
        id
        experience
        createdAt
        aboutMe
      }
    }
  }
`;

export const GET_QUESTIONS = gql`
  query findManyQuestions {
    findManyQuestions {
      updatedAt
      profileId
      id
      createdAt
      translations {
        updatedAt
        questionsId
        question
        languageCode
        id
        createdAt
        answer
      }
    }
  }
`;

export const GET_SOCIALS = gql`
  query findManySocials {
    findManySocials {
      updatedAt
      profileId
      name
      link
      id
    }
  }
`;

export const GET_HOBBYS = gql`
  query findManyHobbys {
    findManyHobbys {
      updatedAt
      profileId
      image
      id
      createdAt
      translations {
        updatedAt
        languageCode
        id
        hobbysId
        hobby
        createdAt
        aboutHobby
      }
    }
  }
`;

export const GET_RECOMMENDATIONS = gql`
  query findManyRecommendations {
    findManyRecommendations {
      createdAt
      date
      id
      updatedAt
      image
      translations {
        updatedAt
        role
        recommendationsId
        name
        languageCode
        id
        description
        createdAt
        bio
      }
    }
  }
`;

export const GET_SERVICES = gql`
  query findManyServices {
    findManyServices {
      updatedAt
      order
      id
      createdAt
      background
      translations {
        servicesId
        updatedAt
        name
        languageCode
        id
        description
        createdAt
      }
    }
  }
`;

export const GET_SKILLS = gql`
  query findManySkills {
    findManySkills {
      updatedAt
      translations {
        updatedAt
        name
        languageCode
        skillsId
        id
        createdAt
        about
      }
      link
      image
      id
      createdAt
      color
    }
  }
`;

export const GET_TOPSKILLS = gql`
  query findManyTopSkills {
    findManyTopSkills {
      updatedAt
      linkedinId
      id
      createdAt
      translations {
        updatedAt
        topSkillsId
        name
        languageCode
        id
        createdAt
      }
    }
  }
`;
