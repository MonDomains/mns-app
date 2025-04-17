import { useLocation, useNavigate, useParams } from "react-router";
import { isValidName, obscureName } from "../helpers/String"; 
import { useAccount, useEnsName, useEnsResolver, useReadContract, useReadContracts } from 'wagmi'
import React, { useEffect, useState } from "react";  
import Profile from "../components/Profile";
import CopyText from "../components/Buttons/CopyText";
import AddressLink from "../components/Buttons/AddressLink";
import { Link } from "react-router"; 
import Records from "../components/Records";
import Ownership from "../components/Ownership";
import More from "../components/More";
import { monadTestnet } from "viem/chains";
import registrarControllerAbi from '../abi/MONRegisterController.json'
import { baseRegistrar, nameWrapper, rainbowConfig, registrarController, universalResolver } from "../config";
import { Spinner } from "react-bootstrap";
import nameWrapperABI from '../abi/NameWrapper.json'
import { labelhash, namehash, zeroAddress } from "viem";
import baseRegistrarABI from '../abi/BaseRegistrarImplementation.json'
import { ethers } from "ethers";
import { normalize } from "viem/ens";

const Name = () => {  
    let { name: labelName } = useParams(); 
    const search = useLocation().search;
    const tab = new URLSearchParams(search).get("tab");
    const { address }  = useAccount();  
    const navigate = useNavigate();
    const name = `${labelName}.mon`;

    if(!isValidName(labelName)) {
        return (
            <div className="alert alert-danger text-center container mt-3">
                <b>{obscureName(labelName, 30)}</b> is invalid!
            </div> 
        )
    }

    const { data, isLoading, error } = useReadContracts(
       { contracts: [
            {
                address: registrarController,
                abi: registrarControllerAbi,
                functionName: 'available',
                args: [labelName],
                chainId: monadTestnet.id
            },
            {
                address: nameWrapper,
                abi: nameWrapperABI,
                functionName: 'isWrapped',
                args: [namehash(normalize(name))],
                chainId: monadTestnet.id
            },
            {
                address: nameWrapper,
                abi: nameWrapperABI,
                functionName: 'ownerOf',
                args: [namehash(normalize(name))],
                account: address,
                chainId: monadTestnet.id
            },
            {
                address: baseRegistrar,
                abi: baseRegistrarABI,
                functionName: 'ownerOf',
                args: [ ethers.toBigInt(labelhash(labelName))],
                account: address,
                chainId: monadTestnet.id
            }
    ] });
  
    if(isLoading) 
        return (<div className="d-flex flex-column gap-4 p-0">
            <div className="alert alert-info text-center">
                <Spinner size="lg" />
            </div>
        </div>)

    if(error) 
        return (<div className="d-flex flex-column gap-4 p-0">
            <div className="alert alert-danger text-center">
                Error: {error.message}
            </div>
        </div>)

    let ownerAddress = zeroAddress;
    const isAvailable = data[0].result;
    const isWrapped = data[1].result;
    const ownerAddress1511 = data[2].result;
    const ownerAddressErc721 = data[3].result;

    if(ownerAddress1511 != zeroAddress && isWrapped)
        ownerAddress = ownerAddress1511;

    if(ownerAddressErc721 != zeroAddress && !isWrapped)
        ownerAddress = ownerAddressErc721;
         
    const isOwner = ownerAddress == address;

    if(isAvailable) {
        navigate(`/register/${name}`);
    }
 
    /* 

    const reverseAddr = normalize(address.slice(2) +".addr.reverse".toLowerCase());

    const {data: mnsName} =  useEnsName({
        address: reverseAddr,
        universalResolverAddress: universalResolver,
        chainId: monadTestnet.id
    });

    const {data: mnsResolver } = useEnsResolver({
            name: normalize(name),
            universalResolverAddress: universalResolver,
            chainId: monadTestnet.id
    }); 

    console.log("resolver: "+ mnsResolver)
    console.log("address: "+ address)
    console.log("reverse addr: "+ reverseAddr );
    console.log("mnsName: "+ mnsName)
    console.log("reverse namehash: "+ namehash(reverseAddr));
    console.log("namehash: "+ namehash(normalize(name)));
      */
     
    return ( 
        <div className="d-flex flex-column gap-2 p-0">
             
            <ul className='mb-0 ps-2 pe-2 list-unstyled list-inline text-muted fs-4 d-flex flex-row gap-4 fw-bold overflow-x-scroll'>
                <li> <Link className={'text-decoration-none '+ (tab == "profile" || tab == "" || tab==null ? "link-primary": "link-secondary") } to={"/"+ name + "?tab=profile"}>Profile</Link> </li>
                <li> <Link className={'text-decoration-none '+ (tab == "more" ? "link-primary": "link-secondary")} to={"/"+ name +"?tab=more"}>More</Link> </li>
            </ul>
            <div className="d-flex flex-column">
                {
                    { 
                        "profile": <Profile isOwner={isOwner} isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />,
                        "more": <More isOwner={isOwner} isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />,
                        null: <Profile isOwner={isOwner} isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />
                    }[tab]
                }
            </div>
        </div>
    ) 
};
 
export default Name;