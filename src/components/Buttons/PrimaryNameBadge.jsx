

import monadIcon from '../../assets/images/monad.svg';
import { Button } from "react-bootstrap";
import CopyText from "./CopyText";
import { namehash } from 'viem';
import * as Icons from "react-bootstrap-icons";
import { universalResolver } from '../../config';
import { monadTestnet } from 'viem/chains';
import { useEnsName } from 'wagmi';
import { ensNormalize } from 'ethers';

function PrimaryNameBadge (props) {   
    const {data: mnsName } = useEnsName({
        address: props.address,
        universalResolverAddress: universalResolver,
        chainId: monadTestnet.id
    }); 
    
    return (   
        <>
            { mnsName && mnsName == props.name ? 
                <span className='btn bg-success-subtle border border-success-subtle text-success fw-bold rounded-3'>
                    <Icons.PersonSquare className='mb-1' /> <span className=''>Your Primary Name</span>
                </span>
                : <></>
            }
        </>
    );
}

export default PrimaryNameBadge;
