import { apolloClient, rainbowConfig } from "../config";
import { readContract } from '@wagmi/core'
import { toast } from "react-toastify";
import React, {Component} from 'react';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import moment from "moment";
import { Link } from "react-router";  
import { GET_DOMAIN } from "../graphql/Domain";
import { getDateSimple, getExpires,  getTimeAgo, obscureName } from "../helpers/String";
import MonadIcon from '../assets/images/monad.svg';
import RenewModal from "../components/RenewModal";
import SetAsPrimary from "./SetAsPrimary";
import { Copy, TwitterX } from "react-bootstrap-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getChainId } from "@wagmi/core";

class Domain extends Component {
      
    constructor(props) {
      super(props);

      this.state = {
         available: null,
         isAvailablePending: false,
         domain: null
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
                address: import.meta.env.VITE_APP_REGISTER_CONTROLLER,
                functionName: 'available',
                args: [this.props.name],
                account: this.props.owner,
                chainId: getChainId(rainbowConfig)
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
            let name = this.props.name + ".mon";
            const result = await apolloClient.query( {
                query: GET_DOMAIN,
                variables: {
                    name
                }
            }); 
            this.setState({ domain: result.data.domains[0] })
        } catch(e) {
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
`I've minted ${obscureName(name, 25)}.mon 😎 

Powered by @monadns, built on @monad_xyz. 

Mint yours 👇

https://app.monadns.com/${name}.mon?v=${this.getUnixTime()} 
 
`);
        }
 
    render() {  
        
        return (
        <>  
        {this.state.domain ?
            <div className="d-flex flex-column flex-md-row justify-content-start align-items-md-start gap-4">
                <div className="d-flex flex-column gap-2">
                <div className="card rounded-2 bg-body-tertiary border-2 border-light-subtle" style={{ minWidth: 270}}>
                    <LazyLoadImage 
                        src={import.meta.env.VITE_APP_METADATA_API + "/temp-image/"+ this.props.name}
                        alt={this.props.name}
                        className="rounded-1"
                    /> 
                </div>
                <Link target="_blank" to={"https://x.com/intent/post?text="+ this.getText()} className="btn btn-lg btn-dark border rounded-2"> Share on <TwitterX /></Link>
                </div>
                <div className="d-flex flex-column flex-fill mt-3">
                    <ul className="list-unstyled d-flex flex-column gap-4">
                        <li className="d-flex flex-column flex-lg-row justify-content-between gap-2">
                            <strong>Owner: </strong> 
                            <span role="button" onClick={(e)=> this.handleCopyClick(e, this.state.domain?.owner?.id?.toString())} className="badge bg-secondary-subtle text-secondary text-start p-2 overflow-x-scroll">
                                <img src={MonadIcon} width={24} className="me-2" />
                                {this.state.domain?.owner?.id} {this.state.domain?.owner?.id?.toString() === this.props.owner?.id?.toString() ? <>(You)</>: <></>} 
                                <button className="btn bnt-default" ><Copy /></button> 
                            </span> 
                        </li>
                        <li className="d-flex flex-column flex-lg-row justify-content-between gap-2">
                            <strong>Registrant: </strong> 
                            <span role="button" onClick={(e)=> this.handleCopyClick(e, this.state.domain?.owner?.id?.toString())} className="badge bg-secondary-subtle text-secondary text-start p-2 overflow-x-scroll">
                                <img src={MonadIcon} width={24} className="me-2" /> 
                                {this.state.domain?.registrant?.id} {this.state.domain?.registrant?.id?.toString() === this.props.owner?.id?.toString() ? <>(You)</>: <></>} 
                                <button className="btn bnt-default" ><Copy /></button> 
                            </span>
                        </li>
                        <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                            <strong>Expires: </strong>
                            <span>{getExpires(this.state.domain.expiryDate)} - { getDateSimple(this.state.domain.expiryDate) }</span>
                        </li>
                        <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                            <strong>Created: </strong>
                            <span>{getTimeAgo(this.state.domain.createdAt)} - { getDateSimple(this.state.domain.createdAt) } </span>
                        </li>
                        <li className="d-flex flex-column flex-md-row justify-content-between gap-2">
                            <strong>Registered: </strong>
                            <span>{getTimeAgo(this.state.domain.registeredAt)} - { getDateSimple(this.state.domain.registeredAt) } </span>
                        </li>
                        <li className="d-flex flex-column flex-md-row justify-content-end gap-3">
                            { this.state.domain?.owner?.id?.toString().toLowerCase() === this.props.owner?.toString().toLowerCase() ? 
                                <>
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
            :
            <>
            <div className="d-flex flex-column flex-md-row justify-content-start align-items-md-start gap-3">
                <div className="d-flex flex-column gap-2">
                    <div className="card rounded-2 bg-body-tertiary border-2 border-light-subtle" style={{ minWidth: 270}}>
                        <LazyLoadImage 
                            src={import.meta.env.VITE_APP_METADATA_API + "/temp-image/"+ this.props.name}
                            alt={this.props.name}
                            className="rounded-1"
                        /> 
                    </div>
                    <Link target="_blank" to={"https://x.com/intent/post?text="+ this.getText()} className="btn btn-lg btn-dark border rounded-2"> Share on <TwitterX /></Link>
                </div>
                <div className="d-flex flex-column flex-fill">
                    <ul className="list-unstyled d-flex flex-column gap-3">
                        <li className="d-flex flex-row justify-content-between">
                            <strong>Owner: </strong> 
                            <span className="badge bg-secondary-subtle text-secondary text-start p-2"><img src={MonadIcon} width={24} className="me-1" />N/A</span>
                        </li>
                        <li className="d-flex flex-row justify-content-between">
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
            </div>
            </>
        } 
 
        </>
        )  
      
    }
        
}

export default Domain;