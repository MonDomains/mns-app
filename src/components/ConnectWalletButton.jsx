import { useAccount, useSwitchChain } from 'wagmi';
import WalletIcon from '../assets/images/wallet-icon.svg';
import ChevronDown from '../assets/images/chevron-down.svg';
import WarningLogo from '../assets/images/warning-icon.svg';
//import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAppKit } from '@reown/appkit/react'
import { obscureAddress } from "../helpers/String";
import { useChainId } from 'wagmi'

export default function ConnectWalletButton({props}) {

  const { open } = useAppKit()
  const { address, isConnected  } = useAccount() 
  const { switchChain } = useSwitchChain() 
  const chainId = useChainId()

  const SUPPORTED_CHAIN_ID = Number(import.meta.env.VITE_APP_SUPPORTED_CHAIN_ID);
  
  if(isConnected) { 
    return (<>  { SUPPORTED_CHAIN_ID !== chainId ?
        <button {...props} className="wallet-connect wrongAlert" onClick={() => switchChain({ chainId: SUPPORTED_CHAIN_ID })}> Wrong Network <img src={WarningLogo} /></button>  
        : 
        <button {...props} className="wallet-connect btn-light border-0" onClick={() => open()}><span> {obscureAddress( address) } </span> <img width={16} height={16} src={ChevronDown}/> <img width={16} height={16} className='text-white' src={WalletIcon}/> </button> 
    }</>)
  } else {
    return (
        <>
          <button {...props} className="wallet-connect btn-primary text-white" onClick={() => open()}><span>Connect Wallet</span></button>
        </>
      )
  }
  
}