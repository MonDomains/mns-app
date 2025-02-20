import { WagmiProvider } from 'wagmi'
import { wagmiAdapter, chains, projectId } from "../config";
//import { createWeb3Modal } from '@web3modal/wagmi/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 
import { createAppKit } from '@reown/appkit/react'



const queryClient = new QueryClient()
 
//createWeb3Modal({ wagmiConfig, projectId, chains })


createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  projectId: projectId
 })
 
export function Web3Modal({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}