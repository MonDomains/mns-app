
import React, {Component} from 'react';
import { monadTestnet } from 'viem/chains';
import * as Icons from "react-bootstrap-icons";
import { apolloClient, rainbowConfig, universalResolver } from '../config';
import avatar from "../assets/images/avatar.svg";
import { getEnsResolver, multicall } from '@wagmi/core'
import { GET_SUBGRAPH_RECORDS } from "../graphql/Domain";
import { namehash } from 'viem';
import CopyText from "./Buttons/CopyText";
import ExtendButton from './Buttons/ExtendButton';
import TransferOwnership from './TransferOwnership';
import AddressBox from './Buttons/AddressBox';
import OwnerBox from './Buttons/OwnerBox';
import ManagerBox from './Buttons/ManagerBox';
import PrimaryNameBadge from './Buttons/PrimaryNameBadge';
import ExpiryBox from './Buttons/ExpiryBox';
import ParentBox from './Buttons/ParentBox';
import ShareButton from './Buttons/ShareButton';
import ViewResolvedAddressBox from './Buttons/ViewResolvedAddressBox';
import SetAsPrimaryButton from './Buttons/SetAsPrimaryButton';
import { normalize } from 'viem/ens';
import ChangeManager from './ChangeManager';
import EditProfile from './Buttons/EditProfile';
import publicResolverABI from "../abi/PublicResolver.json";
import { Spinner } from 'react-bootstrap';

class Profile extends Component {
    constructor(props) { 
        super(props); 

        this.state = {
            error: null,
            domain: null,
            isFetching: false,
            isQuerying: false,
            records: []
        };  
    }

    async handleQuery() {
        
        try {
            this.setState({ isQuerying: true })
            let id = namehash(normalize(this.props.name));
            const result = await apolloClient.query( {
                query: GET_SUBGRAPH_RECORDS,
                variables: {
                    id
                }
            });    
            this.setState({ domain: result.data?.domain, isQuerying: false });
            this.handleRecords(result.data?.domain);
        } catch(e) {
            this.setState({ isQuerying: false, error: e.message });
        }
    }
 
    getTextCalldata = (resolver,  node, key) => {
        const publicResolverContract = {
            address: resolver,
            abi: publicResolverABI,
        } 
        return {
            ...publicResolverContract,
            functionName: "text",
            args: [node, key]
        }
    }

    getRecords = () =>{
        return this.state.records;
    } 

    async handleRecords(domain) {
        
        this.setState({ isFetching: true });
 
        let contracts = [];
        let records = [];

        const texts = domain?.resolver?.texts;
   
        if(texts?.length > 0) {
 
            const node = namehash(normalize(this.props.name));
       
            const resolver = await getEnsResolver(rainbowConfig, {
                name: normalize(this.props.name),
                universalResolverAddress: universalResolver, 
                chainId: monadTestnet.id
            });

            texts.forEach(key => {
                let contract = this.getTextCalldata(resolver, node, key);
                contracts.push(contract);
            }); 
            
            const results = await multicall(rainbowConfig, {
                contracts
            });

            texts.forEach((key, i) => {
                records[key] = results[i].result;
            });
        }
 
        this.setState({ records, isFetching: false });
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

        if(this.state.isFetching || this.state.isQuerying) 
            return (
                <div className="d-flex flex-column gap-4 p-0">
                    <div className="alert alert-info text-center">
                        <Spinner size="lg" />
                    </div>
                </div>
            )
        
        if(this.state.error) 
            return (
                <div className="d-flex flex-column gap-4 p-0">
                    <div className="alert alert-danger text-center">
                        Error: {error.message}
                    </div>
                </div>
            )

        return (
             <div className='d-flex flex-column gap-2'> 
                <div className='bg-light-subtle border border-light-subtle rounded-4'>
                    <div className='bg-primary bg-gradient rounded-top-4 position-relative' style={{height: 150}}>
                        <div className='position-absolute top-50 start-0 ms-4'>
                            {this.state.records.avatar ?
                                <img src={this.state.records.avatar} width={128} className='rounded-circle' />
                                : <img src={avatar} width={128} role="button" />
                            }  
                        </div> 
                    </div> 
                    <div className='d-flex flex-row p-3 align-items-end justify-content-end gap-2'>
                        <ViewResolvedAddressBox {...this.props} />
                    </div>
                    <div className='d-flex flex-column p-4 pt-1 gap-2'>
                        <h1 className='fw-bold text-trunctate text-wrap text-break mb-0'>
                            {this.props.name}
                            <CopyText className="btn btn-default p-0 ms-2 mb-2" text={this.props.name} />
                        </h1>
                        {this.state.records.name ?
                            <span className='text-muted fw-bold text-break tex-truncate text-wrap'>{this.state.records.name.substring(0, 100)}</span> : <></>
                        } 
                        {this.state.records.description ?
                            <span className='text-break tex-truncate text-wrap'>{this.state.records.description.substring(0, 500)}</span> : <></>
                        }
                        <div className='d-flex flex-wrap gap-3'>
                        {this.state.records.location ?
                            <span className='d-flex flex-wrap gap-1 align-items-center text-muted text-break tex-truncate text-wrap'>
                                <Icons.GeoAltFill size={12} /> 
                                {this.state.records.location.substring(0, 50)}
                            </span> : <></>
                        }
                        {this.state.records.url ?
                            <span className='d-flex flex-wrap gap-1 align-items-center text-muted text-break tex-truncate text-wrap'>
                                <Icons.Link45deg size={12} />
                                <a target='_blank' className='text-decoration-none link-primary' rel="nofollow" href={this.state.records.url}>
                                {this.state.records.url.substring(0, 256)}
                                </a>
                            </span> : <></>
                        }
                        </div>
                        <div className='d-flex flex-column flex-md-row align-items-start justify-content-between gap-2 mt-2'>
                            {this.props.isOwner ?  
                                <PrimaryNameBadge {...this.props} />
                                : <></>
                            }
                            <ShareButton {...this.props} />
                        </div>
                    </div>
                </div> 
                <div className='bg-light-subtle border border-light-subtle rounded-4 d-flex flex-column gap-4'>
                    <div className='p-4 d-flex flex-column gap-4'>
                        { this.state.records["com.twitter"] || this.state.records["com.github"] || this.state.records["org.telegram"] || this.state.records["com.discord"] ?
                        <div className='d-flex flex-row justify-content-between'>
                            <div className='d-flex flex-column gap-2'> 
                                <div className='text-muted fs-5 fw-bold'>
                                    Accounts
                                </div>
                                <div className='d-flex flex-wrap gap-3 align-items-top'>
                                    { this.state.records["com.twitter"] ? 
                                        <a target='_blank' href={"https://x.com/"+ this.state.records["com.twitter"]} className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3">
                                            <Icons.TwitterX /> {this.state.records["com.twitter"]}
                                        </a>: <></>
                                    }
                                    { this.state.records["com.discord"] ? 
                                        <a className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3">
                                            <Icons.Discord /> {this.state.records["com.discord"]} 
                                        </a>: <></>
                                    }
                                    { this.state.records["org.telegram"] ? 
                                        <a target='_blank' href={"https://t.me/"+ this.state.records["org.telegram"]} className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3">
                                            <Icons.Telegram /> {this.state.records["org.telegram"]} 
                                        </a>: <></>
                                    }
                                    { this.state.records["com.github"] ? 
                                        <a target='_blank' href={"https://github.com/"+ this.state.records["com.github"]} className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3">
                                            <Icons.Github /> {this.state.records["com.github"]} 
                                        </a>: <></>
                                    }
                                    { this.state.records["email"] ? 
                                        <a href={"mailto:"+ this.state.records["email"]} className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3">
                                            <Icons.EnvelopeFill /> {this.state.records["email"]} 
                                        </a>: <></>
                                    }
                                </div>
                            </div> 
                        </div> : <></>
                        }
                        <div className='d-flex flex-row justify-content-between'>
                            <div className='d-flex flex-column gap-2'> 
                                <div className='text-muted fs-5 fw-bold'>
                                    Address
                                </div>
                                <div className='d-flex flex-row'>
                                    <AddressBox {...this.props} />   
                                </div>
                            </div> 
                        </div>
                        <div className='d-flex flex-column flex-md-row'>
                            <div className='d-flex flex-column gap-2'>
                                <span className='text-muted fs-5 fw-bold'>
                                    Ownership
                                </span>
                                <div className='d-flex flex-wrap gap-3'>
                                    <OwnerBox {...this.props} />
                                    <ManagerBox {...this.props} />
                                    <ExpiryBox {...this.props} />
                                    <ParentBox {...this.props} />
                                </div>
                            </div> 
                        </div>
                    </div>
                     
                    <div className='d-flex flex-wrap border-top border-light-subtle p-4 justify-content-start justify-content-lg-end gap-2'>
                        <ExtendButton {...this.props} />
                        { this.props.isOwner &&  <TransferOwnership {...this.props} /> }
                        { this.props.isOwner && <ChangeManager {...this.props} /> }
                        { this.props.isOwner && <SetAsPrimaryButton {...this.props} /> }
                        { (this.props.isOwner || this.props.isManager) && <EditProfile {...this.props} records={this.getRecords()} /> }
                    </div> 
                </div>
             </div>
        )
    }
}

export default Profile;