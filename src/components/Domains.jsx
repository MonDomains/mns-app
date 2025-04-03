import { apolloClient, chainId, rainbowConfig, registrarController } from "../config";
import { readContract } from '@wagmi/core'
import { toast } from "react-toastify";
import React, {Component} from 'react';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import moment from "moment";
import { Link } from "react-router";  
import { GET_DOMAIN } from "../graphql/Domain";
import { getDateSimple, getExpires,  getTimeAgo, getTokenId, obscureName } from "../helpers/String";
import MonadIcon from '../assets/images/monad.svg';
import RenewModal from "../components/RenewModal";
import SetAsPrimary from "./SetAsPrimary";
import { BoxArrowUpRight, Copy, TwitterX } from "react-bootstrap-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Spinner } from "react-bootstrap";
import TransferOwnership from "./TransferOwnership";

class Domain extends Component {
      
    constructor(props) {
      super(props);

      this.state = {
         available: null,
         isAvailablePending: false,
         domain: null,
         isDomainFetching: false
      };
    }

    handleCopyClick (e, text) {
        navigator.clipboard.writeText(text);
        toast.success("Copied");
    }
       
    async handleAvailable() {
        
        let _available = false; 

        try {

            this.setState({ isAvailablePending: true });

            _available = await readContract(rainbowConfig, {
                abi: monRegisterControllerABI,
                address: registrarController,
                functionName: 'available',
                args: [this.props.name],
                account: this.props.owner,
                chainId: chainId
            });

            this.setState({ isAvailablePending: false });
            this.setState({ available: _available });

        } catch (e) {
            console.log(e.message)
            this.setState({ isAvailablePending: false });
            toast.error("an error occurred");

        }
    } 

    async handleQuery() {

        try {
            this.setState({ isDomainFetching: true })
            let name = this.props.name + ".mon";
            const result = await apolloClient.query( {
                query: GET_DOMAIN,
                variables: {
                    name
                }
            }); 
            this.setState({ domain: result.data.domains[0], isDomainFetching: false })
        } catch(e) {
            this.setState({ isDomainFetching: false })
            console.log(e);
            toast.error("An error occurred.")
        }

    }
  
    componentDidMount () {   
 
        if(this.state.available === null) { 
            this.handleAvailable();
            this.handleQuery(); 
        }
  
        if(!this.state.available) {
            this.handleQuery(); 
        } 
    }

    componentDidUpdate(prevProps, prevState) { 
        
        if(prevProps.name != this.props.name) {
            this.handleAvailable();
            this.handleQuery();
        }  
    }

    getUnixTime () {
        return moment().utc().unix();
    }

    getText() {
        return encodeURIComponent(
`I've minted ${obscureName(this.props.name, 25)}.mon 😎 

Powered by @MonDomains, built on @monad_xyz. 

Mint yours 👇

https://dapp.monadns.com/${this.props.name}.mon?v=${this.getUnixTime()} 
 
`);
        }
 
    render() {   
        return (
            <>   
            {this.state.isDomainFetching == true && this.state.domain == null ?
                <div className="d-flex flex-column justify-content-between align-items-center mh-100">
                    <Spinner size="lg" variant="primary" />
                </div> : <></>
            }

            {this.state.isDomainFetching == false && this.state.domain != null ?
                <div className="d-flex flex-column flex-md-row justify-content-start align-items-md-start gap-4">
                    <div className="d-flex flex-column gap-3">
                        <LazyLoadImage 
                            src={`${import.meta.env.VITE_APP_METADATA_API }/preview/${this.props.name}.mon`}
                            alt={this.props.name}
                            placeholder={<Spinner />}
                            className="rounded-1 preview"
                        /> 
                        <Link target="_blank" to={"https://x.com/intent/post?text="+ this.getText()} className="btn btn-lg bg-black text-white border rounded-2"> Share on <TwitterX /></Link>
                        <a href={`${import.meta.env.VITE_APP_TOKEN_URL}/${getTokenId(this.state.domain?.labelName)}`} target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                            <BoxArrowUpRight />
                            <span className='ms-2'>View on Explorer</span>
                        </a> 
                        <a href={`${import.meta.env.VITE_APP_MARKET_URL}/${getTokenId(this.state.domain?.labelName)}`} target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                            <BoxArrowUpRight />
                            <span className='ms-2'>View on Marketplace</span>
                        </a> 
                    </div>
                    <div className="d-flex flex-column flex-fill mt-3">
                        <ul className="list-unstyled d-flex flex-column gap-4"> 
                            <li className="d-flex flex-column justify-content-between gap-2">
                                <strong>TokenID: </strong> 
                                <span role="button" onClick={(e)=> this.handleCopyClick(e, getTokenId(this.props.name))} className="badge bg-secondary-subtle text-secondary text-start p-2 overflow-x-scroll">
                                    {getTokenId(this.props.name)}
                                    <button className="btn bnt-default" ><Copy /></button> 
                                </span> 
                            </li>
                            <li className="d-flex flex-column justify-content-between gap-2">
                                <strong>Owner: </strong> 
                                <span role="button" onClick={(e)=> this.handleCopyClick(e, this.state.domain?.owner?.id?.toString())} className="badge bg-secondary-subtle text-secondary text-start p-2 overflow-x-scroll">
                                    <img src={MonadIcon} width={24} className="me-2" />
                                    {this.state.domain?.owner?.id} {this.state.domain?.owner?.id?.toString() === this.props.owner?.id?.toString() ? <>(You)</>: <></>} 
                                    <button className="btn bnt-default" ><Copy /></button> 
                                </span> 
                            </li>
                            <li className="d-flex flex-column justify-content-between gap-2">
                                <strong>Registrant: </strong> 
                                <span role="button" onClick={(e)=> this.handleCopyClick(e, this.state.domain?.owner?.id?.toString())} className="badge bg-secondary-subtle text-secondary text-start p-2 overflow-x-scroll">
                                    <img src={MonadIcon} width={24} className="me-2" /> 
                                    {this.state.domain?.registrant?.id} {this.state.domain?.registrant?.id?.toString() === this.props.owner?.id?.toString() ? <>(You)</>: <></>} 
                                    <button className="btn bnt-default" ><Copy /></button> 
                                </span>
                            </li>
                            <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                                <strong>Expires: </strong>
                                <span>{getExpires(this.state.domain.registration.expiryDate)} - { getDateSimple(this.state.domain.registration.expiryDate) }</span>
                            </li>
                            <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                                <strong>Created: </strong>
                                <span>{getTimeAgo(this.state.domain.createdAt)} - { getDateSimple(this.state.domain.createdAt) } </span>
                            </li>
                            <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                                <strong>Registered: </strong>
                                <span>{getTimeAgo(this.state.domain.registration.registrationDate)} - { getDateSimple(this.state.domain.registration.registrationDate) } </span>
                            </li>
                            <li className="d-flex flex-column flex-md-row justify-content-end gap-3">
                                { this.state.domain?.owner?.id?.toString().toLowerCase() === this.props.owner?.toString().toLowerCase()
                                    || this.state.domain?.wrappedOwner?.id?.toString().toLowerCase() === this.props.owner?.toString().toLowerCase()
                                ? 
                                    <>
                                        <TransferOwnership domain={this.state.domain} owner={this.props.owner} key={"transfer_ownership"+ this.state.domain.id} /> 
                                        <SetAsPrimary domain={this.state.domain} owner={this.props.owner} key={"set_as_primary_"+ this.state.domain.id} /> 
                                        <RenewModal domain={this.state.domain} owner={this.props.owner} key={"renew_"+this.state.domain.id} /> 
                                    </>
                                    : 
                                    <></>
                                }
                            </li> 
                        </ul>
                    </div> 
                </div>
                : <></>
            }  

            { this.state.isDomainFetching == false && this.state.domain == null ? 
                <div className="d-flex flex-column flex-md-row justify-content-start align-items-md-start gap-3">
                    <div className="d-flex flex-column gap-2">
                        <LazyLoadImage 
                            src={`${import.meta.env.VITE_APP_METADATA_API }/preview/${this.props.name}.mon`}
                            alt={this.props.name}
                            placeholder={<Spinner />}
                            className="rounded-1 preview"
                        /> 
                        <Link target="_blank" to={"https://x.com/intent/post?text="+ this.getText()} className="btn btn-lg btn-dark border rounded-2">
                            Share on <TwitterX />
                        </Link>
                    </div>
                    <div className="d-flex flex-column flex-fill">
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li className="d-flex flex-column justify-content-between gap-2">
                                <strong>Owner: </strong> 
                                <span className="badge bg-secondary-subtle text-secondary text-start p-2"><img src={MonadIcon} width={24} className="me-1" />N/A</span>
                            </li>
                            <li className="d-flex flex-column justify-content-between gap-2">
                                <strong>Registrant: </strong> 
                                <span className="badge bg-secondary-subtle text-secondary text-start p-2"><img src={MonadIcon} width={24} className="me-1" /> N/A</span>
                            </li>
                            <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                                <strong>Expires: </strong>
                                <span>N/A</span>
                            </li>
                            <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                                <strong>Created: </strong>
                                <span>N/A </span>
                            </li>
                            <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                                <strong>Registered: </strong>
                                <span>N/A</span>
                            </li>
                        </ul>
                    </div>
                </div> : <></>
            }
            </>
        )  
      
    }
        
}

export default Domain;