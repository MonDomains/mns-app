import React, { Component } from 'react';
import registrarControllerABI from '../abi/MONRegisterController.json'
import { monadTestnet } from 'wagmi/chains'
import avatar from "../assets/images/avatar.svg";
import { useReadContract } from 'wagmi'
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { isAvailable, isValidDomain, obscureName } from "../helpers/String";
import { Link, Navigate, useNavigate } from 'react-router'; 
import { Spinner } from 'react-bootstrap';
import { ArrowRightShort, XCircle } from 'react-bootstrap-icons';
import { chainId, rainbowConfig, registrarController, universalResolver } from '../config';
import { ensNormalize, ethers, isAddress } from 'ethers';
import { getEnsName, readContract } from '@wagmi/core';
import * as Icons from "react-bootstrap-icons";
import Avatar from './Misc/Avatar';

class Search extends Component {

    constructor(props) {
        super(props)

        this.inputRef = React.createRef();

        this.state = {
            isAddress: false,
            isValid: false,
            isFocused: false,
            mnsName: null,
            error: null,
            isPending: false,
            navigate: false,
            name: "",
            address: "",
        }
    }

    timer = null;

    delay = async (ms) => {  
        return new Promise((resolve) => { 
            clearTimeout(this.timer);
            this.timer = setTimeout(resolve, ms) 
        });
    }; 
 
    handleOnKeyUp = async (e) => {
        await this.delay(500);
        this.handleSearch(e);
    }

    handleSearch(e) { 

        e.preventDefault(); 

        try {

            this.setState({ error: null, navigate: false, isAddress: false, name: "" })

            const q = this.inputRef.current.value.toLowerCase();
             
            
            if(ethers.isAddress(q)) {
                console.log("isaddress")
                this.setState({ isAddress: true, address: q, name: "" })
                this.handleMnsName(q);
                return;
            }

            let label = ensNormalize(q)

            if(isValidDomain(label)) {

                this.setState({ isValid: true, name: label })

                this.handleAvailable(label);

                if (e.key === 'Enter' || e.keyCode === 13 ) {
                    this.setState({ navigate: true })
                }

            } else {
                this.setState({ isValid: false, name: label })
            }

        } catch(e) {
            console.log(e)
            this.setState({ name: "Input", isValid: false, error: e })
        }
        
    } 

    async handleAvailable (label) { 
        try {
            this.setState({ isPending: true });
            const result = await readContract(rainbowConfig, {
                address: registrarController,
                abi: registrarControllerABI,
                functionName: 'available',
                args: [label]
            });
            console.log(result)
            this.setState({ isPending: false, isAvailable: result });
        } catch(error) {
            this.setState({error});
        } 
    }

    handleCloseResult = async (e) => {
        this.setState({ name: "" })
        this.inputRef.current.value = "";
    }
  
    handleMnsName = async (address) => {
        const mnsName = await getEnsName(rainbowConfig, {
            address,
            universalResolverAddress: universalResolver
        }); 
 
        if(mnsName) 
            this.setState({ name: mnsName })
    }
 
    render() {
        return (
            
            <div className="col-12 col-lg-6 fs-5"> 
                {this.state.navigate && <Navigate to={`/${this.state.name}.mon`} />}
                <form className={this.state.isFocused ? "bg-light-subtle border border-2 border-primary rounded-4 position-relative": "bg-light-subtle border border-2 rounded-4 position-relative"} 
                    onSubmit={(e)=> this.handleSearch(e) }>
                    <div className="input-group flex-nowrap align-items-center pe-2">
                        <span className="input-group-prepend">
                            <div className="input-group-text bg-light-subtle border-0 text-body-emphasis">
                                <Icons.Search size={24} />
                            </div>
                        </span>
                        <input 
                            type="text" 
                            ref={this.inputRef} 
                            placeholder="Search for a name"  
                            onKeyUp={(e)=> this.handleOnKeyUp(e) } 
                            onBlur={(e)=> this.setState({ isFocused: false })} 
                            onFocus={(e)=> this.setState({ isFocused: true })} 
                            className={"bg-light-subtle shadow-none form-control form-control-lg fs-3 border-0 ps-0 pe-0"} 
                        />
                        
                        { this.state.name != "" &&
                            <XCircle 
                                size={24} 
                                role="button" 
                                className='p-1' 
                                onClick={(e)=> this.handleCloseResult(e)} /> }
                    </div>

                    { this.state.name == "" & this.state.isFocused ?
                        <div className="d-flex flex-row border rounded-4 align-items-center p-3 mt-2 bg-light-subtle position-absolute w-100">
                            <span className='text-secondary'>Type a name or address to search</span>
                        </div>
                        : <></>
                    } 

                    { this.state.name != "" && !this.state.isAddress & !this.state.isValid ?
                        <div className="d-flex flex-row border rounded-4 align-items-center p-3 mt-2 bg-light-subtle position-absolute w-100">
                            <span className='text-danger'>{obscureName(this.state.name, 50)} is invalid!</span>
                        </div>
                        : <></>
                    } 

                    { this.state.error ?
                        <div className="d-flex flex-row border rounded-4 align-items-center p-3 mt-2 bg-light-subtle position-absolute w-100">
                            <span className='text-danger'>There was an error. Please try again.</span>
                        </div> 
                        : <></>
                    }

                    {this.state.name != "" && !this.state.isAddress && this.state.isValid ? 
                        <Link to={ this.state.isAvailable ? "/register/"+ this.state.name +".mon": "/"+ this.state.name +".mon"} 
                            className="link-body-emphasis link-offset-2 link-underline-opacity-25 text-decoration-none">
                            <ul className='list-unstyled d-flex flex-row border rounded-4 align-items-center p-3 mt-2 justify-content-between bg-light-subtle position-absolute w-100'>
                                <li className='text-truncate d-flex flex-row justify-content-between align-items-center'>
                                    <Avatar name={this.state.name + ".mon"} />
                                    <span className='ms-2'>
                                        {obscureName(this.state.name, 15)}.mon
                                    </span>
                                </li> 
                                <li> 
                                    {
                                        !this.state.isPending ? 
                                        <>
                                            <small className={this.state.isAvailable ? "bg-success-subtle p-1 border rounded-2 fw-bold text-success-emphasis": "bg-danger-subtle p-1 border rounded-2 fw-bold text-danger-emphasis"}>
                                                { this.state.isAvailable ? "Available": "Not Available"}
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
                        : <></>
                    } 

                    {this.state.name != "" && this.state.isAddress ? 
                        <Link to={ "/address/"+ this.state.address} className="link-body-emphasis link-offset-2 link-underline-opacity-25 text-decoration-none">
                            <ul className='list-unstyled d-flex flex-row border rounded-4 align-items-center p-3 mt-2 justify-content-between bg-light-subtle position-absolute w-100'>
                                <li className='text-truncate d-flex flex-row justify-content-between align-items-center'>
                                    <Avatar name={this.state.name} />
                                    <span className='ms-2'>
                                        {obscureName(this.state.name, 15)}
                                    </span>
                                </li>
                                <li> 
                                    {
                                        !this.state.isPending ? 
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
                        : <></>
                    }
                </form> 
            </div>
        )
    }
}
 
export default Search;