
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
import HexButton from './Buttons/HexButton';
import DecimalButton from './Buttons/DecimalButton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ResolverBox from './Buttons/ResolverBox';
import ResolverEditButton from './Buttons/ResolverEditButton';
 
class More extends Component {
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
            <div className='d-flex flex-column gap-3'> 
            <div className='bg-light-subtle border border-light-subtle rounded-4'>
                <div className='d-flex flex-row p-4 justify-content-between border-bottom'>
                    <h5 className='fw-bold'>Token</h5>
                    <ExplorerLink name={this.props.name} />
                </div>
                <div className='d-flex flex-column flex-md-row align-items-top justify-content-between gap-3 p-4'>
                    <div className='d-flex flex-column gap-2'>
                        <HexButton name={this.props.name} />
                        <DecimalButton name={this.props.name} />
                    </div>
                    <div className='d-flex flex-column'>
                        <LazyLoadImage 
                            src={`${import.meta.env.VITE_APP_METADATA_API }/preview/${this.props.name}`}
                            alt={this.props.name}
                            placeholder={<Spinner />}
                            className="rounded-1 image-preview"
                        /> 
                    </div>
                </div>
            </div>

            <div className='bg-light-subtle border border-light-subtle rounded-4'>
                <div className='d-flex flex-row p-4 justify-content-between border-bottom'>
                    <h5 className='fw-bold'>Resolver</h5>
                </div>
                <div className='d-flex flex-row p-4 gap-3'>
                    <ResolverBox name={this.props.name} />
                    <ResolverEditButton a="owner degilse cikmayacak" />
                </div>
            </div>
            </div>
        )
    }
}

export default More;