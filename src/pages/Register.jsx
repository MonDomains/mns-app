import React from "react";
import Search from "../partials/Search";
import AccordionBt from '../partials/AccordionBt';
import TabsBt from '../partials/TabsBt';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { isValidDomain, obscureName } from "../helpers/String";
import { useParams } from "react-router-dom";
import { useAccount, useChainId } from "wagmi";
import ConnectWalletButton from "../components/ConnectWalletButton";
import RegisterName from "../components/Register";

const Register = () => { 
 
  const {name} = useParams(); 
  const { address: registrar }  = useAccount();
  const { isConnected, isDisconnected } = useAccount();
 

  return (
    <> 
      <h1>{name}.mon</h1>
      <div class="d-flex flex-column bg-body-tertiary border border-light-subtle rounded-4 p-3 gap-4">
            {!isValidDomain(name) ?  
                <>  
                    <h3 className="alert alert-danger text-center container mt-3">
                        <b>{obscureName(name, 50)}</b> is invalid!
                    </h3> 
                </>
                : 
                <>  
                    <RegisterName name={name} duration={3156600} owner={registrar} isConnected={isConnected} isDisconnected={isDisconnected} />
                </> 
            } 
        </div>
    </>
  )
};

export default Register;