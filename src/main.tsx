import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "@components/layout/Layout";
import AboutMe from "@pages/AboutMe";
import Archive from "@pages/Archive";
import Blogs from "@pages/Blogs";
import GithubRepos from "@pages/GithubRepos";
import MainProjects from "@pages/MainProjects";
import Linkedin from "@pages/Linkedin";
import Profile from "@pages/Profile";
import Recommendations from "@pages/Recommendations";
import Services from "@pages/Services";
import Skills from "@pages/Skills";
import { Books } from "@pages/Books";
import Posts from "@pages/Posts";
import TopSkills from "@pages/TopSkills";
import Hobbys from "@pages/Hobbys";
import Socials from "@pages/Socials";
import Questions from "@pages/Questions";
import Works from "@pages/Works";
import Education from "@pages/Education";
import Languages from "@pages/Languages";
import Certificates from "@pages/Certificates";

const client = new ApolloClient({
  uri: import.meta.env.backendUrl || "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
const router = createBrowserRouter([
  {
    element: (
      <ApolloProvider client={client}>
        <Layout />
      </ApolloProvider>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/books" />,
      },
      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/about-me",
        element: <AboutMe />,
      },
      {
        path: "/archive",
        element: <Archive />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/github-repos",
        element: <GithubRepos />,
      },
      {
        path: "/main-projects",
        element: <MainProjects />,
      },
      {
        path: "/works",
        element: <Works />,
      },
      {
        path: "/educations",
        element: <Education />,
      },
      {
        path: "/languages",
        element: <Languages />,
      },
      {
        path: "/certificates",
        element: <Certificates />,
      },
      {
        path: "/linkedin",
        element: <Linkedin />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
      {
        path: "/top-skills",
        element: <TopSkills />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/hobbys",
        element: <Hobbys />,
      },

      {
        path: "/socials",
        element: <Socials />,
      },
      {
        path: "/questions",
        element: <Questions />,
      },
      {
        path: "/recommendations",
        element: <Recommendations />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/skills",
        element: <Skills />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
