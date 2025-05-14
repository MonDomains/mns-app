

import React, {Component} from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { metaApiUrl } from "../../config";
import { Spinner } from 'react-bootstrap';

class MnsCard extends Component {

    constructor(props) {

        super(props);
 
        this.state = { 
            card: null
        }; 
    }

    render () {
        return (
            <LazyLoadImage 
                src={`${metaApiUrl}/card/${this.props.name}`}
                alt={this.props.name}
                className='rounded-3 card-preview'
                placeholder={<Spinner />}
            />
        )
    } 
}

export default MnsCard;
