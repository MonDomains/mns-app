 
import React, {Component} from 'react';
import { ethers } from "ethers";
import { Spinner } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import { rainbowConfig } from '../../config';
import { getGasPrice } from '@wagmi/core'


class GasInfoBox extends Component {

    constructor(props) {
        super(props);
  
        this.state = {
            loading: false,
            gasPrice: 0,
            error: null
        } 
    } 
 
    async handleGasPrice() { 
        try { 
            this.setState({ error: null, gasPrice: 0, loading: true })
            const gasPrice = await getGasPrice(rainbowConfig);
            this.setState({ gasPrice, loading: false })
        } catch(e) { 
            this.setState({ gasPrice: 0, loading: false, error: e.message });
        }
    }

    componentDidMount () {     
        this.handleGasPrice();
    }

    componentDidUpdate(prevProps, prevState) { 
         if(prevProps != this.props) {
            this.handleGasPrice();
         }
    }
    
    render() { 
        return (
        <>
            <Icons.EvStationFill className='mb-1' />&nbsp;
            { this.state.loading ? 
                <Spinner size="sm" variant="primary" /> 
                : ethers.formatUnits(this.state.gasPrice, "gwei") + " Gwei"} 
        </>)
    };
}

export default GasInfoBox;
