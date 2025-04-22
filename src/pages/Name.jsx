import { useLocation, useNavigate, useParams } from "react-router";
import { obscureName } from "../helpers/String"; 
import { useAccount, useReadContracts } from 'wagmi'
import React from "react";  
import Profile from "../components/Profile";
import { Link } from "react-router"; 
import More from "../components/More";
import { monadTestnet } from "viem/chains";
import registrarControllerAbi from '../abi/MONRegisterController.json'
import { baseRegistrar, nameWrapper, registrarController } from "../config";
import { Alert, Spinner } from "react-bootstrap";
import nameWrapperABI from '../abi/NameWrapper.json'
import { labelhash, namehash, zeroAddress } from "viem";
import baseRegistrarABI from '../abi/BaseRegistrarImplementation.json'
import { ethers, isValidName } from "ethers";
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
            <Alert variant="danger" className="text-center mt-3">
                <b>{obscureName(labelName, 30)}</b> is invalid!
            </Alert> 
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
    ]});
  
    if(isLoading) 
        return (
            <div className="d-flex flex-column gap-4 p-0">
                <div className="alert alert-info text-center">
                    <Spinner size="lg" />
                </div>
            </div>
        )

    if(error) 
        return (
            <div className="d-flex flex-column gap-4 p-0">
                <div className="alert alert-danger text-center">
                    Error: {error.message}
                </div>
            </div>
        )

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

    return ( 
        <div className="d-flex flex-column gap-2 p-0">
            <ul className='mb-0 ps-2 pe-2 list-unstyled list-inline text-muted fs-4 d-flex flex-row gap-4 fw-bold overflow-x-scroll'>
                <li> <Link className={'text-decoration-none '+ (tab == "profile" || tab == "" || tab==null ? "link-primary": "link-secondary") } to={"/"+ name + "?tab=profile"}>Profile</Link> </li>
                <li> <Link className={'text-decoration-none '+ (tab == "more" ? "link-primary": "link-secondary")} to={"/"+ name +"?tab=more"}>More</Link> </li>
            </ul>
            <div className="d-flex flex-column">
                {
                    { 
                        "profile":  <Profile isOwner={isOwner} isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />,
                        "more":     <More isOwner={isOwner} isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />,
                        null:       <Profile isOwner={isOwner} isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />
                    }[tab]
                }
            </div>
        </div>
    ) 
};
 
export default Name;