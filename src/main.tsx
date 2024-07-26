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
import { Books } from "./pages";

const client = new ApolloClient({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
