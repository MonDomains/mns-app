import { http } from 'wagmi';
import { monadTestnet } from 'wagmi/chains';
import { ApolloClient, InMemoryCache } from "@apollo/client"; 
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export const chainId = import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
export const mnsRegistry = import.meta.env.VITE_APP_REGISTRY;
export const registrarController = import.meta.env.VITE_APP_REGISTER_CONTROLLER;
export const publicResolver = import.meta.env.VITE_APP_PUBLIC_RESOLVER;
export const universalResolver = import.meta.env.VITE_APP_UNIVERSAL_RESOLVER;
export const projectId = import.meta.env.VITE_APP_PROJECT_ID;
export const NODE_PROVIDER_URL = import.meta.env.VITE_APP_NODE_PROVIDER_URL;

export const rainbowConfig = getDefaultConfig({
  appName: 'Mon Name Service',
  projectId: projectId,
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(NODE_PROVIDER_URL),
  },
});

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_APP_GRAPHAPI_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_APP_GRAPHAPI_BEARER;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

