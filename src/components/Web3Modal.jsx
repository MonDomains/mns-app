import { WagmiProvider } from 'wagmi'
import { chains, rainbowConfig } from "../config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient();

export function Web3Modal({ children }) {
  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}