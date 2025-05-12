import React from "react";  
import { useAccount, useEnsName as useMnsName } from "wagmi";
import Names from "../components/Names";
import NotConnected from "../partials/NotConnected";
import { universalResolver } from "../config"; 

const Account = () => {
  const { address, isConnected } = useAccount();
  const { data: mnsName } = useMnsName({
      address: address,
      universalResolverAddress: universalResolver
  });
  
  if (!isConnected)
    return (<NotConnected />) 

  return (<Names 
            address={address} 
            primaryName={mnsName} 
            mode={"edit"} />)
};

export default Account;