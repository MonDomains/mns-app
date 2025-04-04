import React from "react";  
import { useAccount } from "wagmi";
import MyNames from "../components/MyNames";

const Account = () => {
  const { address, isConnected } = useAccount();
  return (
    <>    
      <MyNames address={address} />
    </>
  )
};

export default Account;