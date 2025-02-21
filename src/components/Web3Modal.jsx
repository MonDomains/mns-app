import { WagmiProvider } from 'wagmi'
import { wagmiAdapter, chains, projectId } from "../config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react' 

const queryClient = new QueryClient() 
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