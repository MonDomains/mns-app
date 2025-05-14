
import React, {Component} from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getEnsAvatar } from '@wagmi/core';
import { normalize } from 'viem/ens';
import { rainbowConfig, universalResolver } from '../../config';
import { Spinner } from 'react-bootstrap';
import fallback from "../../assets/images/avatar.svg";
import { monadTestnet } from 'viem/chains';

class Avatar extends Component {

    constructor(props) {

        super(props);
 
        this.state = { 
            avatar: null,
            error: null
        }; 
    }

    async resolveAvatar() { 
        try {
            const avatar = await getEnsAvatar(rainbowConfig, { 
                name: normalize(this.props.name),
                universalResolverAddress: universalResolver
            });  
            
            this.setState({ avatar })
            if(this.props.onAvatarResolved)
                this.props.onAvatarResolved(avatar);
        } catch(error) { 
            
            this.setState({ error })
            if(this.props.onAvatarError) 
                this.props.onAvatarError(error);
        } 
    }

    componentDidMount () {   
        this.resolveAvatar(); 
    }

    componentDidUpdate(prevProps, prevState) { 
        if(prevProps.name != this.props.name) {
            this.resolveAvatar(); 
        }  
    }

    render() {
        return (
            <LazyLoadImage 
                src={this.state.avatar || fallback}
                alt={this.props.name}
                width={40} 
                className='rounded-circle'
                placeholder={<Spinner />}
            />
        )
    }
}

export default Avatar;

