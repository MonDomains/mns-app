
import React, {Component} from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getEnsAvatar } from '@wagmi/core';
import { labelhash, namehash, normalize } from 'viem/ens';
import { baseRegistrar, explorerUrl, metaApiUrl, nameWrapper, rainbowConfig, universalResolver } from '../../config';
import { Spinner } from 'react-bootstrap';
import fallback from "../../assets/images/avatar.svg";
import { monadTestnet } from 'viem/chains';
import { ethers } from 'ethers';
import placeholder from "../../assets/images/placeholder.svg";
import placeholder2 from "../../assets/images/placeholder2.svg";

class NftImage extends Component {

    constructor(props) {

        super(props); 
        
        this.nameId = ethers.toBigInt(namehash(normalize(this.props.name)));
        this.labelId = ethers.toBigInt(labelhash(this.props.labelName));
        this.isWrapped = this.props.isWrapped || true;

        this.state = { 
            avatar: null,
            error: null
        }; 
    }
 
    getTokenImageUrl() {
        const tokenId = this.isWrapped ? this.nameId: this.labelId;
        const contractAddress = this.isWrapped ? nameWrapper : baseRegistrar;
        const url = `${metaApiUrl}/monad-testnet/${contractAddress}/${tokenId}/image`;
        console.log(url)
        return url;
    } 

    render() {
        return ( 
             <LazyLoadImage 
                src={`${this.getTokenImageUrl()}`}
                alt={this.props.name}
                placeholderSrc={placeholder2}
                className="rounded-2 image-preview"
            />  
        )
    }
}

export default NftImage;

