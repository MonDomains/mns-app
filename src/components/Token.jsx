

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
import NftImage from './Misc/NftImage';
import ViewOnMarketPlace from "./Buttons/ViewOnMarketPlace";
import ViewOnExplorer from "./Buttons/ViewOnExplorer";

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
                    <div className='d-flex flex-column flex-md-row p-4 justify-content-between border-bottom'>
                        <h5 className='fw-bold'>Token ({this.props.isWrapped ? "ERC-1155": "ERC-721"})</h5>
                    </div>
                    <div className='d-flex flex-column flex-md-row align-items-top justify-content-between gap-3 p-4'>
                        <div className='d-flex flex-column gap-3'>
                            <HexButton {...this.props} />
                            <DecimalButton {...this.props} />
                            <div className='d-flex flex-row gap-4 align-items-center justify-content-start'>
                                <ViewOnExplorer {...this.props} />
                                <ViewOnMarketPlace {...this.props} />
                            </div>
                        </div>
                        
                        <div className='d-flex flex-column gap-2 '>
                            <NftImage {...this.props} />
                            <ShareButton {...this.props} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Token;