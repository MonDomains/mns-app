import { http, createConfig } from 'wagmi'
import { monadTestnet } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'
import { ApolloClient, InMemoryCache } from "@apollo/client"; 
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

export const projectId = import.meta.env.VITE_APP_PROJECT_ID
export const NODE_PROVIDER_URL = import.meta.env.VITE_APP_NODE_PROVIDER_URL

export const metadata = {
  name: 'Monad Domains',
  description: ''
}

export const chains = [monadTestnet];



export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId: projectId,
  transports: { 
    [monadTestnet.id]: http(NODE_PROVIDER_URL),
  },
  connectors: [
    
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name
    })
  ]
})

export const config = wagmiAdapter.wagmiConfig

/* 
export const wagmiConfig = createConfig({
    chains: chains,
    transports: { 
      [mainnet.id]: http(),
      [monadTestnet.id]: http(NODE_PROVIDER_URL),
    },
    connectors: [
      walletConnect({ projectId, metadata, showQrModal: true }),
      injected({ shimDisconnect: true }),
      coinbaseWallet({
        appName: metadata.name
      })
    ]
});
*/

export const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_APP_GRAPHAPI_URL,
  cache: new InMemoryCache()
})
