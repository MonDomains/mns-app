import searchIcon from '../assets/images/search-icon.svg';
import loadericon from '../assets/images/loader-icon.svg';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { monadTestnet } from 'wagmi/chains'

import { useReadContract } from 'wagmi'
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { isValidDomain, obscureName, getOneYearDuration } from "../helpers/String";
import DomainPrice from '../components/DomainPrice';
import { Link, useNavigate } from 'react-router-dom'; 
import { Spinner } from 'react-bootstrap';

function Search() {
     
    const navigate = useNavigate();
    const yearInSeconds = getOneYearDuration(); 
    const inputRef = useRef("")
    const [name, setName] = useState(""); 
    const [valid, setValid] = useState(false); 
 
    const delay = async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
 
    async function handleOnKeyUp (e) {
        await delay(500);
        handleSearch(e);
    }

    function handleSearch(e) {
         

        e.preventDefault();

        let label = inputRef.current.value.toLowerCase();
         
        if(isValidDomain(label)) {
            setValid(true);
            setName(label);
            if (e.key === 'Enter' || e.keyCode === 13 ) {
                navigate("/name/"+ label +".mon")
            }
        } else {
            setValid(false);
            setName(label);
        }
    } 

    const monRegisterControllerConfig = {
        address: import.meta.env.VITE_APP_MONREGISTERCONTROLLER,
        abi: monRegisterControllerABI
    };

    const { data: available, error, isPending } = useReadContract({
        ...monRegisterControllerConfig,
        functionName: 'available',
        args: [name],
        chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
    });
 
    if(error) toast.error(error.message)
     
    return ( 
        <div className="search-content container pe-0 ps-0 mb-3"> 
            <form onSubmit={(e)=> handleSubmit(e) }>
                <img src={searchIcon} alt="" />
                <input type="text" ref={inputRef} placeholder="Search your domain name"  onKeyUp={(e)=> handleOnKeyUp(e) } />
                <span className='chainText'>.mon</span>
                <button onClick={(e)=> handleSearch(e) }>{isPending ? <><img src={loadericon} /></> : "SEARCH" }</button>
            </form>
            { name != "" & !valid ?
                <>
               
                <div className="search-result-content">
                    <ul>
                        <li className="copy-container">
                            <span className='alert alert-danger container-fluid'>{obscureName(name, 50)} is invalid!</span>
                        </li>
                    </ul>
                </div>
                 
                </>
                : <></>
            }
            {name != "" && valid ? 
                <> 
                <Link to={"/name/"+ name +".mon"} className="search-result-content text-decoration-none">
                    <div >
                        <ul>
                            <li className="copy-container">
                                <span className="domainName ">
                                    {obscureName(name, 20)}.mon 
                                </span>
                                <div className='pricing'>
                                    <DomainPrice available={available} name={name} duration={yearInSeconds} />
                                </div>
                                <div className='resultbutton d-flex justify-content-end'> 
                                    {!isPending ? <>
                                        <button  className={available ? "green": "red"}>{ available ? "Available": "Not Available"}</button>
                                    </> : 
                                        <Spinner />
                                    } 
                                </div>
                            </li>
                        </ul>
                    </div>
                </Link>
                </>
            : <></>
            }
        </div>
     );
}

export default Search;