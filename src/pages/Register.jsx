import React from "react";
import { isValidDomain, obscureName } from "../helpers/String";
import { useNavigate, useParams } from "react-router";
import { useAccount } from "wagmi";
import RegisterName from "../components/RegisterName";
  
const Register = () => { 

  const {name} = useParams(); 
  const { address: registrar }  = useAccount();
  const { isConnected, isDisconnected } = useAccount();
  const navigate = useNavigate(); 

  return (
    <> 
    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-2 mb-3 p-0">
      <h1 className="m-0 p-0 text-truncate">{obscureName(name, 20)}.mon</h1>
    </div> 
    <div className="d-flex flex-column bg-body-tertiary border border-light-subtle rounded-2 p-1 gap-4">
      {!isValidDomain(name) ?  
          <>  
              <h3 className="alert alert-danger text-center container mt-3">
                  <b>{obscureName(name, 50)}</b> is invalid!
              </h3>
          </>
          : 
          <>  
              <RegisterName name={name} duration={3156600} owner={registrar} isConnected={isConnected} isDisconnected={isDisconnected} navigate={navigate} />
          </> 
      } 
    </div>
    </>
  )
};

export default Register;