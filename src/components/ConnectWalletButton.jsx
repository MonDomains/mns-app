import { useAccount, useReadContract, useSwitchChain } from 'wagmi';
import { useAppKit } from '@reown/appkit/react'
import { getLabelHash, getNameHash, obscureAddress, obscureName } from "../helpers/String";
import { useChainId } from 'wagmi'
import WarningLogo from '../assets/images/warning-icon.svg';
import { ChevronBarDown, ChevronDown, Wallet2 } from 'react-bootstrap-icons';
import { readContract } from '@wagmi/core'
import { monadTestnet } from 'viem/chains';

import { keccak256, namehash } from 'viem'



export default function ConnectWalletButton({props}) {
  const { open } = useAppKit()
  const { address, isConnected  } = useAccount() 
  const { switchChain } = useSwitchChain() 
  const chainId = useChainId()
  const SUPPORTED_CHAIN_ID = Number(import.meta.env.VITE_APP_SUPPORTED_CHAIN_ID);

   
  if(isConnected) { 

     

    const abi = [
      {
        type: "function",
        name: "name",
        stateMutability: "view",
        inputs: [{ name: "node", type: "bytes32" }],
        outputs: [{ type: "string" }],
      }, 
    ]
 
    const publicResolverConfig = {
        address: import.meta.env.VITE_APP_PUBLIC_RESOLVER,
        abi: abi
    };
  
    const { data: name, error } = useReadContract({
        ...publicResolverConfig,
        functionName: 'name',
        args: [getNameHash( address.slice(2) +".addr.reverse")],
        chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
    });
    
    return (<>  { SUPPORTED_CHAIN_ID !== chainId ?
        <button {...props} className="btn btn-danger fs-5 border-0" onClick={() => switchChain({ chainId: SUPPORTED_CHAIN_ID })}> Wrong Network <img src={WarningLogo} /></button>  
        : 
        <button {...props} className="btn fw-bold fs-5 border-0" onClick={() => open()}>
          <span> { name ? obscureName(name) : obscureAddress(address) } </span> 
          <ChevronDown className='fw-bold' />
        </button> 
    }</>)
  } else {
    return (
        <>
          <button {...props} className="btn btn-primary fs-5 border-0" onClick={() => open()}><span>Connect Wallet</span></button>
        </>
      )
  }
}