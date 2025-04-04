import React, { useState } from "react";  
import { useAccount } from "wagmi";
import { GET_MY_DOMAINS } from "../graphql/Domain";
import { gql, useQuery } from "@apollo/client";
import { getExpires } from "../helpers/String";
import moment from "moment";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { Alert, Button } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import { NavLink } from "react-router";
import searchIcon from '../assets/images/search-icon.svg';
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