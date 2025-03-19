import { http } from 'wagmi';
import { monadTestnet } from 'wagmi/chains';
import { ApolloClient, InMemoryCache } from "@apollo/client"; 
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export const chainId = import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
export const registrarController = import.meta.env.VITE_APP_REGISTER_CONTROLLER;
export const publicResolver = import.meta.env.VITE_APP_PUBLIC_RESOLVER;
export const universalResolver = import.meta.env.VITE_APP_UNIVERSAL_RESOLVER;
export const projectId = import.meta.env.VITE_APP_PROJECT_ID;
export const NODE_PROVIDER_URL = import.meta.env.VITE_APP_NODE_PROVIDER_URL;
export const chains = [monadTestnet];
export const rainbowConfig = getDefaultConfig({
  appName: 'Mon Name Service',
  projectId: projectId,
  chains: chains,
  transports: {
    [monadTestnet.id]: http(NODE_PROVIDER_URL),
  },
});
export const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_APP_GRAPHAPI_URL,
  cache: new InMemoryCache()
});
