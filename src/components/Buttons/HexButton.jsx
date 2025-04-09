import monadIcon from '../../assets/images/monad.svg';
import { Button } from "react-bootstrap";
import CopyText from "./CopyText";
import { namehash } from 'viem';

function HexButton (props) {   
    const hex = namehash(props.name); 
    return (   
        <>
        <a role='button' className='btn btn-link text-decoration-none bg-secondary-subtle border border-light-subtle text-body-emphasis border rounded-3 d-flex flex-row align-items-start justify-content-between gap-2' 
            {...props}>
            <span className='fw-bold'>hex</span>
            <span className='text-break text-end'>
                {hex}
            </span>
            <CopyText className="p-0 btn btn-default ms-2" text={hex} />
        </a>
        </>
    );
}

export default HexButton;
