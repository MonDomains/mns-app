import { useLocation, useNavigate, useParams } from "react-router";
import { isValidName, obscureName } from "../helpers/String"; 
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
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
import { nameWrapper, rainbowConfig, registrarController } from "../config";
import { Spinner } from "react-bootstrap";
import nameWrapperABI from '../abi/NameWrapper.json'
import { namehash } from "viem";

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
                args: [namehash(name)],
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

    const isAvailable = data[0].result;
    const isWrapped = data[1].result;
 
    if(isAvailable) {
        return navigate(`/register/${name}`);
    }
   
    return ( 
        <div className="d-flex flex-column gap-2 p-0">
            <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-1 ps-2 pe-2 mb-4'>
                <h1 className="m-0 fw-bold p-0 m-0">
                    {name}
                    <span><CopyText className="btn btn-default p-0 ms-2" text={name} /></span>
                </h1>
                <AddressLink name={name} />
            </div> 
            <ul className='mb-0 ps-2 pe-2 list-unstyled list-inline text-muted fs-4 d-flex flex-row gap-4 fw-bold overflow-x-scroll'>
                <li> <Link className={'text-decoration-none '+ (tab == "profile" || tab == "" || tab==null ? "link-primary": "link-secondary") } to={"/"+ name + "?tab=profile"}>Profile</Link> </li>
                <li> <Link className={'text-decoration-none '+ (tab == "records" ? "link-primary": "link-secondary")} to={"/"+ name +"?tab=records"}>Records</Link> </li>
                <li> <Link className={'text-decoration-none '+ (tab == "ownership" ? "link-primary": "link-secondary")} to={"/"+ name +"?tab=ownership"}>Ownership</Link> </li>
                <li> <Link className={'text-decoration-none '+ (tab == "more" ? "link-primary": "link-secondary")} to={"/"+ name +"?tab=more"}>More</Link> </li>
            </ul>
            <div className="d-flex flex-column">
                {
                    { 
                        "profile": <Profile isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />,
                        "records": <Records isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />,
                        "ownership": <Ownership isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />,
                        "more": <More isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />,
                        null: <Profile isWrapped={isWrapped} isAvailable={isAvailable} labelName={labelName} name={name} address={address} />
                    }[tab]
                }
                
            </div>
        </div>
    ) 
};
 
export default Name;