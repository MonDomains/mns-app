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
export const baseRegistrar = import.meta.env.VITE_APP_BASE_REGISTRAR;
export const nameWrapper = import.meta.env.VITE_APP_NAME_WRAPPER;
export const universalResolver = import.meta.env.VITE_APP_UNIVERSAL_RESOLVER;
export const bulkRenewal = import.meta.env.VITE_APP_BULK_RENEWAL;
export const projectId = import.meta.env.VITE_APP_PROJECT_ID;
export const NODE_PROVIDER_URL = import.meta.env.VITE_APP_NODE_PROVIDER_URL;
export const explorerUrl = import.meta.env.VITE_APP_EXPLORER_URL;
export const gracePeriod = import.meta.env.VITE_APP_GRACE_PERIOD;
export const reverseRegistrar = import.meta.env.VITE_APP_REVERSE_REGISTRAR;
export const zeroAddress = "0x0000000000000000000000000000000000000000";
export const twitterUrl = import.meta.env.VITE_APP_TWITTER_URL;
export const githubUrl = import.meta.env.VITE_APP_GITHUB_URL;
export const discordUrl = import.meta.env.VITE_APP_DISCORD_URL;

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

const options = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: options
});

