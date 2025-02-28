import searchIcon from '../assets/images/search-icon.svg'; 
import { Link, NavLink, useNavigate,  useParams } from "react-router-dom";
import { getLabelHash, getNameHash, getTokenId, isValidDomain, obscureName } from "../helpers/String"; 
import { useAccount, useChainId, useReadContract } from 'wagmi'
import RegisterName from "../components/RegisterName";
import ConnectWalletButton from "../components/ConnectWalletButton";
import React, { useState } from "react";  
import Domain from '../components/Domains';
import { BoxArrowUpRight, Copy, TwitterX } from 'react-bootstrap-icons';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { monadTestnet } from 'viem/chains';
import moment from 'moment';
import { getAccount } from '@wagmi/core';
import { toast } from 'react-toastify';
import {Helmet} from "react-helmet";


const Name = () => { 
 
    const SUPPORTED_CHAIN_ID = Number(import.meta.env.VITE_APP_SUPPORTED_CHAIN_ID);
    const {name} = useParams(); 
    const { address: owner, isConnected, isDisconnected }  = useAccount();
    const chainId = useChainId();
    const navigate = useNavigate();
      
    function handleCopyClick(e) {
        navigator.clipboard.writeText(name);
        toast.success("Copied");
    }

    function getUnixTime () {
            return moment().utc().unix();
    }

    function getText() {
            return encodeURIComponent(
    `I've minted ${obscureName(name, 20)}.mon on @monad_xyz.
    
Mint yours! Click the link below 👇
    
https://app.monadns.com/${name}.mon?v=${getUnixTime()} 
     
Powered by @monadns `);
    
    }

    const monRegisterControllerConfig = {
        address: import.meta.env.VITE_APP_REGISTER_CONTROLLER,
        abi: monRegisterControllerABI
    };

    const { data: available, error, isPending } = useReadContract({
        ...monRegisterControllerConfig,
        functionName: 'available',
        args: [name],
        chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
    });

    
    if(available) navigate("/register/"+ name + ".mon"); 
    if(error) toast.error("An error occured.");
  
    return (
        <>    
            {!isValidDomain(name) ?  
                <>  
                    <div className="alert alert-danger text-center container mt-3">
                        <b>{obscureName(name, 30)}</b> is invalid!
                    </div> 
                </>
                : 
                <> 
                    <div className='d-flex flex-column gap-3'>
                        <div className='d-flex flex-column flex-md-row justify-content-between gap-3'>
                            <div className='d-flex flex-column flex-lg-row align-items-start gap-3 '>
                                <h2 className='p-0 m-0 text-truncate'>
                                    <span> {obscureName(name, 18)}.mon </span> <button className='btn btn-sm btn-transparent' onClick={(e) => handleCopyClick(e)}><Copy /></button>
                                </h2>
                            </div>
                            <div className='d-flex flex-row justify-content-between align-items-center gap-2'>
                                <Link target="_blank" to={"https://x.com/intent/post?text="+ getText()} className="btn btn-lg btn-dark border rounded-2"> Share on <TwitterX /></Link>
                                {available ?  <NavLink to={"/register/"+ name +".mon"} className={"btn btn-lg  btn-primary rounded-2 border-0"} >Register Now</NavLink>: <></> }
                                {!available ? 
                                    <a href={import.meta.env.VITE_APP_TOKEN_URL +"/"+ getTokenId(name)} target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                        <BoxArrowUpRight />
                                        <span className='ms-2'>View on Explorer</span>
                                    </a>
                                    : <></>
                                }
                            </div>
                        </div> 
                        <ul className='list-unstyled list-inline text-muted fs-4 d-flex flex-row gap-3 fw-bold'>
                            <li> <NavLink className='text-decoration-none link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' to={"/"+ name +".mon"}>Profile</NavLink> </li>
                        </ul> 
                    </div>
                    <div className="d-flex flex-column bg-body-tertiary border border-light-subtle rounded-4 p-3 gap-4">
                        <Domain name={name} owner={owner} />
                    </div>
                </> 
            }
        </>
    ) 
};
 
export default Name;