import { useAccount, useReadContract, useSwitchChain } from 'wagmi';
import { getLabelHash, getNameHash, obscureAddress, obscureName } from "../helpers/String";
import { useChainId } from 'wagmi'
import WarningLogo from '../assets/images/warning-icon.svg';
import { ChevronBarDown, ChevronDown, Wallet2 } from 'react-bootstrap-icons';
import { readContract } from '@wagmi/core'
import { monadTestnet } from 'viem/chains';
import { keccak256, namehash } from 'viem'
import { useState } from 'react';
import { chains, rainbowConfig } from "../config";
import { useAccountModal, useConnectModal, useChainModal } from '@rainbow-me/rainbowkit';
import { ExclamationCircle } from "react-bootstrap-icons";

 
export default function ConnectWalletButton({props}) {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected, chainId  } = useAccount() 
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal() 
  const [name, setName] = useState(null);
  const SUPPORTED_CHAIN_ID = Number(import.meta.env.VITE_APP_SUPPORTED_CHAIN_ID);

  async function reverseLookkup(addr) {

    

    const abi = [
      {
        type: "function",
        name: "name",
        stateMutability: "view",
        inputs: [{ name: "node", type: "bytes32" }],
        outputs: [{ type: "string" }]
      }, 
    ]
  
    const result = await readContract(rainbowConfig, {
        abi,
        functionName: 'name',
        address: import.meta.env.VITE_APP_PUBLIC_RESOLVER,
        args: [getNameHash( addr.slice(2) +".addr.reverse")],
        chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
    });

    if(result) setName(result);
  }

   
  if(isConnected) { 
  
    reverseLookkup(address); 

    return (<>  { !chains.map(t=> t.id).includes(chainId) ?
          <button {...props} className="btn btn-danger fs-5 border-0" onClick={() => openChainModal()}> Wrong Network <ExclamationCircle /> </button>
        : 
        <button {...props} className="btn fw-bold fs-5 border-0" onClick={openAccountModal}>
          <span> { name ? obscureName(name, 12) : obscureAddress(address) } </span> 
          <ChevronDown className='fw-bold' />
        </button> 
    }</>)
  } else {
    return (
        <>
          <button {...props} className="btn btn-primary fs-5 border-0" onClick={openConnectModal}><span>Connect Wallet</span></button>
        </>
      )
  }
}