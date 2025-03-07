import { NavLink, useNavigate,  useParams } from "react-router";
import { getTokenId, isValidDomain, obscureName } from "../helpers/String"; 
import { useAccount, useReadContract } from 'wagmi'
import React from "react";  
import Domain from '../components/Domains';
import { BoxArrowUpRight, Copy } from 'react-bootstrap-icons';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { toast } from 'react-toastify';
import { chainId, registrarController } from '../config';


const Name = () => { 
 
    const {name} = useParams(); 
    const { address: owner }  = useAccount();
    const navigate = useNavigate();
      
    function handleCopyClick(e) {
        navigator.clipboard.writeText(name +".mon");
        toast.success("Copied");
    }
 
    const monRegisterControllerConfig = {
        address: registrarController,
        abi: monRegisterControllerABI
    };

    const { data: available, error, isPending } = useReadContract({
        ...monRegisterControllerConfig,
        functionName: 'available',
        args: [name],
        chainId: chainId
    });
  
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
                            <div className='d-flex flex-row justify-content-end align-items-center gap-3'>
                                {available ? <span className='badge text-bg-success'>Available</span>: <></>}
                                {available ?  <NavLink to={"/register/"+ name +".mon"} className={"btn btn-lg  btn-primary rounded-2 border-0"} >Register Now</NavLink>: <></> }
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