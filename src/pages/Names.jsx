import React from "react";  
import { useAccount, useEnsName } from "wagmi";
import Names from "../components/Names";
import NotConnected from "../partials/NotConnected";
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
    return (<NotConnected />) 

  return (<Names address={address} name={mnsName} mode={"edit"} />)
};

export default Account;