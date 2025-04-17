
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
import { normalize } from 'viem/ens';
 
class Ownership extends Component {
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
            let id = namehash( normalize( this.props.name ));
             
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
              <>Ownership: Under construction</>
        )
    }
}

export default Ownership;