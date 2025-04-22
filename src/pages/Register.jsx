import React from "react";
import { obscureName } from "../helpers/String";
import { useNavigate, useParams } from "react-router";
import { useAccount } from "wagmi";
import RegisterName from "../components/RegisterName";
import { isValidName } from "ethers";
import { Alert } from "react-bootstrap";
  
const Register = () => { 
  const {name: labelName } = useParams(); 
  const { address: registrar }  = useAccount();
  const { isConnected, isDisconnected } = useAccount();
  const navigate = useNavigate(); 
  const name = `${labelName}.mon`;

  if(!isValidName(labelName)) {
      return (    
        <Alert variant="danger" className="text-center mt-3 text-break">
            <b>{obscureName(labelName, 30)}</b> is invalid!
        </Alert> 
      )
  }
 
  return (
    <div className="d-flex flex-column gap-2 p-0">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-2 mb-3 p-0">
        <h1 className="m-0 p-0 text-break">{labelName}.mon</h1>
      </div> 
      <div className="d-flex flex-column bg-body-tertiary border border-light-subtle rounded-2 p-1 gap-4">
        <RegisterName 
          labelName={labelName} 
          name={name} 
          duration={3156600} 
          owner={registrar} 
          isConnected={isConnected} 
          isDisconnected={isDisconnected} 
          navigate={navigate} />
      </div>
    </div>
  )
};

export default Register;