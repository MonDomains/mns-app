import { Link } from "react-bootstrap-icons";
import { getTokenId } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { namehash } from "viem";
import { ensNormalize, ethers } from "ethers";
import { useEnsAddress, useEnsResolver } from "wagmi";
import { universalResolver } from "../../config";
import { monadTestnet } from "viem/chains";
import { Button } from "react-bootstrap";
import CopyText from "./CopyText";

function ResolverBox(props) { 
    
    const {data: mnsResolver } = useEnsResolver({
        name: ensNormalize(props.name),
        universalResolverAddress: universalResolver,
        chainId: monadTestnet.id
    }); 

   
    return ( 
        <>
        { mnsResolver ? 
            <a role="button" className='btn btn-link text-decoration-none bg-secondary-subtle border border-light-subtle text-body-emphasis border rounded-3 d-flex flex-row align-items-start justify-content-between gap-2' 
                {...props}>
                {mnsResolver}
                <CopyText className="p-0 btn btn-default ms-2" text={mnsResolver} />
            </a>
           : <></>
        }
        </>
    );
}

export default ResolverBox;
