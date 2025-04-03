import { WagmiProvider } from 'wagmi'
import { rainbowConfig } from "../config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { useState } from 'react';

const queryClient = new QueryClient();

export function Web3Modal({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme == "dark" ? darkTheme() : lightTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}