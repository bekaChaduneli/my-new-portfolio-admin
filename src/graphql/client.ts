import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: process.env.backendUrl
    ? process.env.backendUrl
    : "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});
