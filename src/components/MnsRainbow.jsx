
import { WagmiProvider } from 'wagmi'
import { ConnectButton, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css';
import { monadTestnet } from 'viem/chains';
 
export const testnet = {
  ...monadTestnet,
  contracts: { 
    ...monadTestnet.contracts,
    ensRegistry: {
      address: "0x6442eC5c3CCDaF112d6B78F9189cD111d516fE1E",
    },
    ensUniversalResolver: {
      address: "0x768be64B577caF84F7D64d0F8e6dc35Dc4737A65"
    }
  }
};
  
const queryClient = new QueryClient();
 
export const rainbowConfig = getDefaultConfig({
  appName: 'Mon Name Service',
  projectId: "a9a5ac582b0b46ca4f1a291c6dd82cba",
  chains: [testnet]
});

// Rainbowkit's ConnectButton includes a built-in user profile!
export const MnsRainbow = () => {
  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
};
