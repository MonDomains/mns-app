import monadIcon from '../../assets/images/monad.svg';
import { Button } from "react-bootstrap";
import CopyText from "./CopyText";
import { namehash } from 'viem';

function HexButton (props) {   
    const hex = namehash(props.name); 
    return (   
        <>
             <CopyText className="p-3 btn btn-default btn btn-default bg-secondary-subtle border border-light-subtle text-body-emphasis border rounded-3 d-flex flex-row align-items-start justify-content-between gap-2" 
                text={hex} {...props}>
                <span className='fw-bold text-start w-25'>hex</span>
                <small className='text-wrap text-break text-start w-75'>
                    {hex}
                </small>
            </CopyText>
        </>
    );
}

export default HexButton;
