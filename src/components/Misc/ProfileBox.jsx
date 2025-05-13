
import React, {Component} from 'react';
import Avatar from './Avatar';
import PrimaryName from './PrimaryName';

class ProfileBox extends Component {

    constructor(props) { 
        super(props); 
    }
  
    render() {
        return (
            <div className='d-flex flex-row gap-2 justify-content-between align-items-center bg-light-subtle border border-light-subtle rounded-5 ps-2 pe-2 pt-1 pb-1 fw-bold'>
                <Avatar {...this.props} />
                <PrimaryName  {...this.props}  />
            </div>
        )
    }
}

export default ProfileBox;

