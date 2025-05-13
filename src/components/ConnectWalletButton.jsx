import { useAccount, useDisconnect, useEnsName as useMnsName } from 'wagmi';
import { obscureAddress, obscureName } from "../helpers/String";
import { universalResolver } from "../config";
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit';
import { BoxArrowRight, Check, Copy, ExclamationCircle } from "react-bootstrap-icons";
import { monadTestnet } from 'viem/chains';
import { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import avatar from "../assets/images/avatar.svg";
import Avatar from './Misc/Avatar';
import PrimaryName from './Misc/PrimaryName';
import ProfileBox from './Misc/ProfileBox';

export default function ConnectWalletButton({ }) {
  
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const { address, isConnected, chainId  } = useAccount() 
  const { openChainModal } = useChainModal() 
  const [copyStatus, setCopyStatus] = useState(false);
  const [mnsName, setMnsName] = useState(null);

  function copyAddress(address) {
    navigator.clipboard.writeText(address);
    setCopyStatus(true);
    setTimeout(()=> {
      setCopyStatus(false);
    }, 2000);
  }
  
  if(isConnected) {  

    return (
        <> { monadTestnet.id != chainId ? 
          <Button className="btn btn-danger fs-6 border-0" onClick={() => openChainModal()}> 
            Wrong Network <ExclamationCircle /> 
          </Button>
        :  
        <Dropdown>
          <Dropdown.Toggle className='p-0' variant='none' size='lg'>
            <ProfileBox 
              address={address} 
              name={mnsName} 
              onPrimaryNameResolved={(primaryNme)=> setMnsName(primaryNme)} />
          </Dropdown.Toggle> 
          <Dropdown.Menu className='mt-1'>
            {mnsName ?
              <Dropdown.Item className={"fs-5"} href={`/${mnsName}`}>
                Profile
              </Dropdown.Item>
              :<></>
            }
            <Dropdown.Item className={"fs-5"} href={`/names`}>
              My Names
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.ItemText className='pt-2 pb-2 fs-6 fw-bold text-truncate' role='button' onClick={()=> copyAddress(address)}>
              { !copyStatus ? <Copy /> : <Check /> } {obscureAddress(address)}
            </Dropdown.ItemText>
            <Dropdown.Item href='#' className='text-danger pt-2 pb-2 fs-6 fw-bold' onClick={() => disconnect()}>
               <BoxArrowRight /> Disconnect 
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    }</>)

  } else {
    return (
        <>
          <Button className="btn btn-primary fs-5 border-0 me-2" onClick={openConnectModal}>
            Connect Wallet
          </Button>
        </>
      )
  }
}