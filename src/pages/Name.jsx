import searchIcon from '../assets/images/search-icon.svg'; 
import { useNavigate,  useParams } from "react-router-dom";
import { isValidDomain, obscureName } from "../helpers/String"; 
import { useAccount, useChainId } from 'wagmi'
import Register from "../components/Register";
import ConnectWalletButton from "../components/ConnectWalletButton";
import React, { useState } from "react";  
import Domain from '../components/Domains';
 
const Name = () => { 
 
    const SUPPORTED_CHAIN_ID = Number(import.meta.env.VITE_APP_SUPPORTED_CHAIN_ID);

    const {name} = useParams(); 
    const { address: registrar, isConnected }  = useAccount();
    const chainId = useChainId();
  
    return (
        <>  
        <div class="d-flex flex-column rounded-4 bg-body-tertiary rounded-4 p-3 gap-4 fs-5">
            {!isValidDomain(name) ?  
                <>  
                    <h3 className="alert alert-danger text-center container mt-3">
                        <b>{obscureName(name, 50)}</b> is invalid!
                    </h3> 
                </>
                : 
                <> 
                    <Domain name={name} />
                    
                    { !isConnected || SUPPORTED_CHAIN_ID !== chainId ?  
                        <ConnectWalletButton /> 
                        : 
                        <>
                        <Register name={name} duration={3156600} owner={registrar} /> 
                        </>
                    }
                </> 
            } 
        </div>
        </>
    ) 
};
 
export default Name;