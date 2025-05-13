
import React, {Component} from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getEnsAvatar, getEnsName } from '@wagmi/core';
import { normalize } from 'viem/ens';
import { rainbowConfig, universalResolver } from '../../config';
import { Spinner } from 'react-bootstrap';
import fallback from "../../assets/images/avatar.svg";
import { monadTestnet } from 'viem/chains';
import { obscureAddress, obscureName } from '../../helpers/String';

class PrimaryName extends Component {

    constructor(props) {

        super(props);
 
        this.state = { 
            primaryName: null,
            error: null
        }; 
    }

    async resolveName() { 
        try {
            const primaryName = await getEnsName(rainbowConfig, { 
                address: this.props.address,
                universalResolverAddress: universalResolver,
            });  
            this.setState({ primaryName });
            if(this.props.onPrimaryNameResolved)
                this.props.onPrimaryNameResolved(primaryName);
        } catch(error) { 
            this.setState({ error })
            if(this.props.onPrimaryNameError)
                this.props.onPrimaryNameError(error);
        } 
    }

    componentDidMount () {   
        this.resolveName(); 
    }

    componentDidUpdate(prevProps, prevState) { 
        if(prevProps.address != this.props.address) {
            this.resolveName(); 
        }  
    }

    render() {
        return (
            <span>{ this.state.primaryName ? obscureName(this.state.primaryName, 14) : obscureAddress(this.props.address) }</span>
        )
    }
}

export default PrimaryName;

