
import moment from 'moment';
import React, {Component} from 'react';
import { monadTestnet } from 'viem/chains';
import * as Icons from "react-bootstrap-icons";
import { apolloClient, bulkRenewal, rainbowConfig } from '../config';
import { GET_MY_DOMAINS } from '../graphql/Domain';
import { Modal, Spinner } from 'react-bootstrap';
import { getExpires } from '../helpers/String';
import avatar from "../assets/images/avatar.svg";
import { Link } from 'react-router';
import { getBalance, getGasPrice, readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { ethers, formatEther } from 'ethers';
import staticBulkRenewalABI from "../abi/StaticBulkRenewal.json";
import ExplorerLink from './Buttons/ExplorerLink';
import { GET_SUBGRAPH_RECORDS } from "../graphql/Domain";
import { namehash } from 'viem';
import CopyText from "./Buttons/CopyText";
import ExtendButton from './Buttons/ExtendButton';
import AddressBox from './Buttons/AddressBox';
import OwnerBox from './Buttons/OwnerBox';
 
class Profile extends Component {
    constructor(props) { 
        super(props); 

        this.state = {
            error: null,
            domain: null,
            isRecordFetching: false, 
        };  
    }

    async handleQuery() {
        
        try {
            this.setState({ isRecordFetching: true })
            let id = namehash(this.props.name);
            const result = await apolloClient.query( {
                query: GET_SUBGRAPH_RECORDS,
                variables: {
                    id
                }
            });    
            this.setState({ domain: result.data?.domain, isRecordFetching: false })
        } catch(e) {
            this.setState({ isRecordFetching: false, error: e.message });
            console.log(e.message)
        }
    }
 
    componentDidMount () {     
        this.handleQuery();
    }

    componentDidUpdate(prevProps, prevState) { 
       if(prevProps.name != this.props.name) {
            this.handleQuery();
       }
    } 

    render() {  
        return (
             <div className='d-flex flex-column gap-2'> 
                <div className='bg-light-subtle border border-light-subtle rounded-4'>
                    <div className='bg-primary bg-gradient rounded-top-4 position-relative' style={{height: 150}}>
                        <div className='position-absolute top-50 start-0 ms-5'>
                            <img src={avatar} width={128} role="button" />
                        </div>
                    </div>
                    <div className='d-flex flex-row p-3 align-items-end justify-content-end'>
                        <ExtendButton />
                    </div>
                    <div className='d-flex flex-row p-4 pt-1'>
                        <h2 className='fw-bold'>{this.props.name}</h2>
                    </div>
                </div>
                <div className='bg-light-subtle border border-light-subtle rounded-4 p-4 d-flex flex-column gap-4'>
                    <div className='d-flex flex-column gap-2'>
                        <span className='text-muted fs-5 fw-bold'>
                            Address
                        </span>
                        <span>
                            <AddressBox address={this.props.address} />
                        </span>
                    </div>
                    <div className='d-flex flex-column gap-2'>
                        <span className='text-muted fs-5 fw-bold'>
                            Ownership
                        </span>
                        <span>
                            <OwnerBox address={this.props.name} />
                        </span>
                    </div>
                </div>
             </div>
        )
    }
}

export default Profile;