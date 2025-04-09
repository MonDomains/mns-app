import monadIcon from '../../assets/images/monad.svg';
import { Button } from "react-bootstrap";
import CopyText from "./CopyText";
import { namehash } from 'viem';
import { ethers } from 'ethers';

function DecimalButton (props) {   
    const decimal = ethers.toBigInt(namehash(props.name));
    return (   
        <>
        <a role='button' className='btn btn-link text-decoration-none bg-secondary-subtle text-body-emphasis border rounded-3 overflow-x-scroll d-flex flex-row gap-2 align-items-start justify-content-between' 
            {...props}>
            <span className='fw-bold'>decimal</span>
            <span className='text-break'>
                {decimal}
            </span>
            <CopyText className="btn btn-default p-0 ms-2 mt-0 pt-0" text={decimal} />
        </a>
        </>
    );
}

export default DecimalButton;
