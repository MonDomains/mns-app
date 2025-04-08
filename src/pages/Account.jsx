import React from "react";  
import { useAccount, useEnsName } from "wagmi";
import MyNames from "../components/MyNames";
import { Alert } from "react-bootstrap";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { namehash } from "viem";
import { getLabelHash } from "../helpers/String";
import { monadTestnet } from "viem/chains";
import { universalResolver } from "../config";

const Account = () => {
  const { address, isConnected } = useAccount();
 
  const {data: mnsName} =  useEnsName({
      address: address,
      universalResolverAddress: universalResolver,
      chainId: monadTestnet.id
    }); 
 
  if (!isConnected)
    return ( 
          <Alert key={"warning"} variant={"warning"} className="d-flex flex-column flex-lg-row gap-3 w-100 p-4 align-items-center justify-content-center">
            You need to connect wallet first to see your domains. 
            <ConnectWalletButton></ConnectWalletButton>
          </Alert> 
    ) 

  return (
    <>    
      <MyNames address={address} name={mnsName} />
    </>
  )
};

export default Account;