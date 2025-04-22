import React from "react";  
import { useEnsName } from "wagmi";
import Names from "../components/Names";
import { isAddress } from "viem";
import { monadTestnet } from "viem/chains";
import { universalResolver } from "../config";
import { useParams } from "react-router";

const Address = () => {
  
  const { address } = useParams(); 
  const {data: mnsName} =  useEnsName({
      address: address,
      universalResolverAddress: universalResolver,
      chainId: monadTestnet.id
  });

  if(!isAddress(address))
    return (<div className="alert alert-danger">Error: Invalid Address</div>)
   
  return (<Names address={address} name={mnsName} mode={"view"} />)
};

export default Address;