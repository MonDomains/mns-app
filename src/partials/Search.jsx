import searchIcon from '../assets/images/search-icon.svg';
import loadericon from '../assets/images/loader-icon.svg';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { monadTestnet } from 'wagmi/chains'
import avatar from "../assets/images/avatar.svg";
import { useReadContract } from 'wagmi'
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { isValidDomain, obscureName, getOneYearDuration } from "../helpers/String";
import DomainPrice from '../components/DomainPrice';
import { Link, useNavigate } from 'react-router'; 
import { Spinner } from 'react-bootstrap';
import {  ArrowRight, ArrowRightShort, SearchHeartFill, XCircle } from 'react-bootstrap-icons';
import { chainId, rainbowConfig, registrarController, universalResolver } from '../config';
import { ensNormalize, ethers } from 'ethers';
import { getEnsName } from '@wagmi/core';
import * as Icons from "react-bootstrap-icons";

function Search({size}) {
     
    const navigate = useNavigate();
    const yearInSeconds = getOneYearDuration(); 
    const inputRef = useRef("")
    const [isAddress, setIsAddress] = useState(false); 
    const [name, setName] = useState(""); 
    const [address, setAddress] = useState(""); 
    const [valid, setValid] = useState(false); 
    const [focused, setFocused] = useState(false); 

    const delay = async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
 
    async function handleOnKeyUp (e) {
        await delay(500);
        handleSearch(e);
    }

    async function handleCloseResult (e) {
        setName("")
        inputRef.current.value = "";
    }

    function handleSearch(e) { 
        e.preventDefault(); 

        try {

            const q = inputRef.current.value.toLowerCase();
            
            if(ethers.isAddress(q)) {
                setIsAddress(true);
                setAddress(q);
                handleMnsName(q);
            } else {
                setIsAddress(false);
                setAddress("");
                setName("");
            }

            let label = ensNormalize(q)

            if(isValidDomain(label)) {
                setValid(true);
                setName(label);
                if (e.key === 'Enter' || e.keyCode === 13 ) {
                    navigate("/"+ label +".mon")
                }
            } else {
                setValid(false);
                setName(label);
            }
        } catch(e) {
            setIsAddress(false);
            setName("Input");
            setValid(false)
        }
        
    } 

    async function handleMnsName(address) {
        const mnsName = await getEnsName(rainbowConfig, {
            address,
            universalResolverAddress: universalResolver,
            chainId: monadTestnet.id
        }); 
        if(mnsName) setName(mnsName);
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
        <div className="col-12 col-lg-6 fs-5"> 
            <form className={focused ? "bg-light-subtle border border-2 border-primary rounded-4 position-relative": "bg-light-subtle border border-2 rounded-4 position-relative"} onSubmit={(e)=> handleSearch(e) }>
                <div className="input-group flex-nowrap align-items-center pe-2">
                    <span className="input-group-prepend">
                        <div className="input-group-text bg-light-subtle border-0 text-body-emphasis">
                            <Icons.Search size={24} />
                        </div>
                    </span>
                    <input type="text" ref={inputRef} placeholder="Search for a name"  onKeyUp={(e)=> handleOnKeyUp(e) } onBlur={(e)=> setFocused(false)} onFocus={(e)=> setFocused(true)} className={size == "sm"? "bg-light-subtle shadow-none form-control fs-6 border-0 ps-0 pe-0": "bg-light-subtle shadow-none form-control form-control-lg fs-3 border-0 ps-0 pe-0"} />
                    { name != "" ? <> <XCircle size={24} role="button" className='p-1' onClick={(e)=> handleCloseResult(e)}  />  </> : "" }
                </div>
                { name == "" & focused ?
                <> 
                    <div className="d-flex flex-row border rounded-4 align-items-center p-3 mt-2 bg-light-subtle position-absolute w-100">
                         <span className='text-secondary'>Type a name or address to search</span>
                    </div>
                </>
                : <></>
                } 
                { name != "" && !isAddress & !valid ?
                    <> 
                        <div className="d-flex flex-row border rounded-4 align-items-center p-3 mt-2 bg-light-subtle position-absolute w-100">
                            <span className='text-danger'>{obscureName(name, 50)} is invalid!</span>
                        </div> 
                    </>
                    : <></>
                }
                {name != "" && !isAddress && valid ? 
                    <> 
                    <Link to={ available ? "/register/"+ name +".mon": "/"+ name +".mon"} className="link-body-emphasis link-offset-2 link-underline-opacity-25 text-decoration-none">
                        <ul className='list-unstyled d-flex flex-row border rounded-4 align-items-center p-3 mt-2 justify-content-between bg-light-subtle position-absolute w-100'>
                            <li className='text-truncate'>
                                <img src={avatar} width={32} className='me-2' />
                                {obscureName(name, 15)}.mon 
                            </li> 
                            <li> 
                                {
                                    !isPending ? 
                                    <>
                                        <small className={available ? "bg-success-subtle p-1 border rounded-2 fw-bold text-success-emphasis": "bg-danger-subtle p-1 border rounded-2 fw-bold text-danger-emphasis"}>
                                            { available ? "Available": "Not Available"}
                                        </small>
                                        <ArrowRightShort className='ms-1'/>
                                    </> : 
                                    <>
                                        <Spinner variant="primary" size='sm' />
                                    </>
                                }  
                            </li>
                        </ul>
                    </Link>
                    </>
                : <></>
                } 
                {name != "" && isAddress ? 
                    <> 
                    <Link to={ "/address/"+ address} className="link-body-emphasis link-offset-2 link-underline-opacity-25 text-decoration-none">
                        <ul className='list-unstyled d-flex flex-row border rounded-4 align-items-center p-3 mt-2 justify-content-between bg-light-subtle position-absolute w-100'>
                            <li className='text-truncate'>
                                {obscureName(name, 15)} 
                            </li>
                            <li> 
                                {
                                    !isPending ? 
                                    <>
                                        <small className={"bg-info-subtle p-1 border rounded-2 fw-bold text-info-emphasis"}>
                                            Address
                                        </small>
                                        <ArrowRightShort className='ms-1'/>
                                    </> : 
                                    <>
                                        <Spinner variant="primary" size='sm' />
                                    </>
                                }  
                            </li>
                        </ul>
                    </Link>
                    </>
                : <></>
                }
            </form> 
        </div>
     );
}

export default Search;