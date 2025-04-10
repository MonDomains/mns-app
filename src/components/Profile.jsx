
import moment from 'moment';
import React, {Component} from 'react';
import { monadTestnet } from 'viem/chains';
import * as Icons from "react-bootstrap-icons";
import { apolloClient, bulkRenewal, rainbowConfig } from '../config';
import { GET_MY_DOMAINS } from '../graphql/Domain';
import { Button, Modal, Spinner } from 'react-bootstrap';
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
import PrimaryNameBadge from './Buttons/PrimaryNameBadge';
import ExpiryBox from './Buttons/ExpiryBox';
import ParentBox from './Buttons/ParentBox';
import ShareButton from './Buttons/ShareButton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
 
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
        //this.handleQuery();
    }

    componentDidUpdate(prevProps, prevState) { 
       if(prevProps.name != this.props.name) {
            //this.handleQuery();
       }
    } 

    render() {  
        return (
             <div className='d-flex flex-column gap-2'> 
                <div className='bg-light-subtle border border-light-subtle rounded-4'>
                    <div className='bg-primary bg-gradient rounded-top-4 position-relative' style={{height: 150}}>
                        <div className='position-absolute top-50 start-0 ms-4'>
                            <img src={avatar} width={128} role="button" />
                        </div>
                    </div>
                    <div className='d-flex flex-row p-3 align-items-end justify-content-end'>
                        <ExtendButton />
                    </div>
                    <div className='d-flex flex-column p-4 pt-1 gap-3'>
                        <h2 className='fw-bold'>{this.props.name}</h2>
                        <div className=''>
                            <PrimaryNameBadge address={this.props.address} name={this.props.name} />
                        </div>
                    </div>
                </div>
                <div className='bg-light-subtle border border-light-subtle rounded-4 p-4 d-flex flex-column gap-4'>
                    <div className='d-flex flex-row justify-content-between'>
                        <div className='d-flex flex-column gap-2'>
                            <span className='text-muted fs-5 fw-bold'>
                                Address
                            </span>
                            <span>
                                <AddressBox name={this.props.name} />
                            </span>
                        </div>
                        <div className='d-flex flex-column gap-2'>
                            <LazyLoadImage 
                                src={`${import.meta.env.VITE_APP_METADATA_API }/preview/${this.props.name}`}
                                alt={this.props.name}
                                placeholder={<Spinner />}
                                className="rounded-1 image-preview"
                            />
                            <ShareButton name={this.props.name} />
                        </div>
                    </div>
                    <div className='d-flex flex-column flex-md-row'>
                        <div className='d-flex flex-column gap-2'>
                            <span className='text-muted fs-5 fw-bold'>
                                Ownership  
                                <Link to={"/"+ this.props.name +"?tab=ownership"} variant='default' className='btn btn-default text-primary fw-bold'>
                                    <Icons.ArrowRight /> View
                                </Link>
                            </span>
                            <div className='d-flex flex-column flex-md-row gap-3'>
                            <span>
                                <OwnerBox isWrapped={this.props.isWrapped} address={this.props.address} name={this.props.name} />
                            </span>
                            <span>
                                <ExpiryBox isWrapped={this.props.isWrapped} address={this.props.address} name={this.props.name} labelName={this.props.labelName} />
                            </span>
                            <span>
                                <ParentBox isWrapped={this.props.isWrapped} address={this.props.address} name={this.props.name} labelName={this.props.labelName} />
                            </span>
                            </div>
                        </div> 
                    </div>
                </div>
             </div>
        )
    }
}

export default Profile;