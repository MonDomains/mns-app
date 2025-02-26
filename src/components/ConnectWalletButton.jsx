import { useAccount, useSwitchChain } from 'wagmi';
import { useAppKit } from '@reown/appkit/react'
import { obscureAddress } from "../helpers/String";
import { useChainId } from 'wagmi'
import WarningLogo from '../assets/images/warning-icon.svg';
import { ChevronBarDown, ChevronDown, Wallet2 } from 'react-bootstrap-icons';

export default function ConnectWalletButton({props}) {
  const { open } = useAppKit()
  const { address, isConnected  } = useAccount() 
  const { switchChain } = useSwitchChain() 
  const chainId = useChainId()
  const SUPPORTED_CHAIN_ID = Number(import.meta.env.VITE_APP_SUPPORTED_CHAIN_ID);
  if(isConnected) { 
    return (<>  { SUPPORTED_CHAIN_ID !== chainId ?
        <button {...props} className="btn btn-danger fs-5" onClick={() => switchChain({ chainId: SUPPORTED_CHAIN_ID })}> Wrong Network <img src={WarningLogo} /></button>  
        : 
        <button {...props} className="btn fw-bold fs-5" onClick={() => open()}>
          <span> {obscureAddress( address) } </span> 
          <ChevronDown className='fw-bold' />
        </button> 
    }</>)
  } else {
    return (
        <>
          <button {...props} className="btn btn-primary fs-5" onClick={() => open()}><span>Connect Wallet</span></button>
        </>
      )
  }
}