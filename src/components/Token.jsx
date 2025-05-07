

import React, {Component} from 'react';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router';
import ExplorerLink from './Buttons/ExplorerLink';
import HexButton from './Buttons/HexButton';
import DecimalButton from './Buttons/DecimalButton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ResolverBox from './Buttons/ResolverBox';
import moment from 'moment';
import { obscureName } from '../helpers/String';
import * as Icons from "react-bootstrap-icons";
import ShareButton from './Buttons/ShareButton';

class Token extends Component {
    constructor(props) { 
        super(props); 

        this.state = {
            error: null,
            domain: null,
            isRecordFetching: false, 
        };  
    } 
 
    componentDidMount () {     
      
    }

    componentDidUpdate(prevProps, prevState) { 
       if(prevProps.name != this.props.name) {
         
       }
    }
 
    render() {  
        return (
            <div className='d-flex flex-column gap-3'> 
            <div className='bg-light-subtle border border-light-subtle rounded-4'>
                <div className='d-flex flex-row p-4 justify-content-between border-bottom'>
                    <h5 className='fw-bold'>Token ({this.props.isWrapped ? "ERC-1155": "ERC-721"})</h5>
                    <ExplorerLink name={this.props.name} isWrapped={this.props.isWrapped} labelName={this.props.labelName} />
                </div>
                <div className='d-flex flex-column flex-md-row align-items-top justify-content-between gap-3 p-4'>
                    <div className='d-flex flex-column gap-2'>
                        <HexButton name={this.props.name} isWrapped={this.props.isWrapped} labelName={this.props.labelName} />
                        <DecimalButton name={this.props.name} isWrapped={this.props.isWrapped} labelName={this.props.labelName} />
                    </div>
                    <div className='d-flex flex-column gap-2'>
                        <LazyLoadImage 
                            src={`${import.meta.env.VITE_APP_METADATA_API }/preview/${this.props.name}`}
                            alt={this.props.name}
                            placeholder={<Spinner />}
                            className="rounded-1 image-preview"
                        /> 
                        <ShareButton {...this.props} />
                    </div>
                </div>
            </div>
            { /*
            <div className='bg-light-subtle border border-light-subtle rounded-4'>
                <div className='d-flex flex-row p-4 justify-content-between border-bottom'>
                    <h5 className='fw-bold'>Resolver</h5>
                </div>
                <div className='d-flex flex-column flex-lg-row p-3 gap-3'>
                    <ResolverBox {...this.props} />
                </div>
            </div>
            */}
            </div>
        )
    }
}

export default Token;