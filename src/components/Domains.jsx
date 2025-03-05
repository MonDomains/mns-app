import { ethers, formatEther, keccak256, parseEther } from "ethers";
import { apolloClient, rainbowConfig } from "../config";
import { readContract, writeContract } from '@wagmi/core'
import { toast } from "react-toastify";
import React, {Component} from 'react';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { waitForTransactionReceipt } from '@wagmi/core'
import spinner from '../assets/images/spinner.svg';
import moment from "moment";
import { Modal } from "react-bootstrap";
import { Link, NavLink } from "react-router";  
import { GET_DOMAIN } from "../graphql/Domain";
import { getDateSimple, getExpires, getLabelHash, getNameHash, getOneYearDuration, getTimeAgo, getTokenId, obscureLabel, obscureName } from "../helpers/String";
import { getBalance } from '@wagmi/core'
import { monadTestnet } from 'wagmi/chains'
import MonadIcon from '../assets/images/monad.svg';
import RenewModal from "../components/RenewModal";
import SetAsPrimary from "./SetAsPrimary";
import { Copy } from "react-bootstrap-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
                chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
            });

            this.setState({ isAvailablePending: false });
            this.setState({ available: _available });

        } catch (e) {

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
 
    render() {  
        
        return (
        <>  
        {this.state.domain ?
            <div className="d-flex flex-column flex-lg-row justify-content-start align-items-lg-start gap-4">
                <LazyLoadImage 
                    src={import.meta.env.VITE_APP_METADATA_API + "/temp-image/"+ this.props.name}
                    width={250}
                    alt={this.props.name}
                    className="rounded-2"
                />
                <div className="d-flex flex-column flex-fill">
                    <ul className="list-unstyled d-flex flex-column gap-4">
                        <li className="d-flex flex-column flex-lg-row justify-content-between gap-2">
                            <strong>Owner: </strong> 
                            <span className="badge bg-secondary-subtle text-secondary text-start p-2"><img src={MonadIcon} width={24} className="me-1" /> {this.state.domain?.owner?.id} {this.state.domain?.owner?.id?.toString() === this.props.owner?.id?.toString() ? <>(You)</>: <></>} <button className="btn bnt-default" onClick={(e)=> this.handleCopyClick(e, this.state.domain?.owner?.id?.toString())}><Copy /></button> </span>
                        </li>
                        <li className="d-flex flex-column flex-lg-row justify-content-between gap-2">
                            <strong>Registrant: </strong> 
                            <span className="badge bg-secondary-subtle text-secondary text-start p-2"><img src={MonadIcon} width={24} className="me-1" /> {this.state.domain?.registrant?.id} {this.state.domain?.registrant?.id?.toString() === this.props.owner?.id?.toString() ? <>(You)</>: <></>} <button className="btn bnt-default" onClick={(e)=> this.handleCopyClick(e, this.state.domain?.registrant?.id?.toString())}><Copy /></button> </span>
                        </li>
                        <li className="d-flex flex-row justify-content-between">
                            <strong>Expires: </strong>
                            <span>{getExpires(this.state.domain.expiryDate)} - { getDateSimple(this.state.domain.expiryDate) }</span>
                        </li>
                        <li className="d-flex flex-row justify-content-between">
                            <strong>Created: </strong>
                            <span>{getTimeAgo(this.state.domain.createdAt)} - { getDateSimple(this.state.domain.createdAt) } </span>
                        </li>
                        <li className="d-flex flex-row justify-content-between">
                            <strong>Registered: </strong>
                            <span>{getTimeAgo(this.state.domain.registeredAt)} - { getDateSimple(this.state.domain.registeredAt) } </span>
                        </li>
                        <li className="d-flex flex-row justify-content-end gap-3">
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
            <div className="d-flex flex-column flex-lg-row justify-content-start align-items-lg-start gap-3">
                <img className="rounded-2" width={250} src={import.meta.env.VITE_APP_METADATA_API + "/temp-image/"+ this.props.name} alt={this.props.name} />
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
                        <li className="d-flex flex-row justify-content-between">
                            <strong>Expires: </strong>
                            <span>N/A</span>
                        </li>
                        <li className="d-flex flex-row justify-content-between">
                            <strong>Created: </strong>
                            <span>N/A </span>
                        </li>
                        <li className="d-flex flex-row justify-content-between">
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