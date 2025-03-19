import { useAccount, useEnsName as useMnsName } from 'wagmi';
import { obscureAddress, obscureName } from "../helpers/String";
import { ChevronDown } from 'react-bootstrap-icons';
import { chains, universalResolver } from "../config";
import { useAccountModal, useConnectModal, useChainModal } from '@rainbow-me/rainbowkit';
import { ExclamationCircle } from "react-bootstrap-icons";
import { monadTestnet } from 'viem/chains';

export default function ConnectWalletButton({props}) {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected, chainId: cid  } = useAccount() 
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal() 
   
 
  if(isConnected) { 
 
    const {data: mnsName} =  useMnsName({
      address: address,
      universalResolverAddress: universalResolver,
      chainId: monadTestnet.id
    });
  
    return (<>  { !chains.map(t=> t.id).includes(cid) ?
          <button {...props} className="btn btn-danger fs-5 border-0" onClick={() => openChainModal()}> Wrong Network <ExclamationCircle /> </button>
        : 
        <button {...props} className="btn fw-bold fs-5 border-0" onClick={openAccountModal}>
          <span> { mnsName ? obscureName(mnsName, 12) : obscureAddress(address) } </span> 
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