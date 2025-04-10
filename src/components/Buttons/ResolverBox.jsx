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
            <CopyText className="btn btn-default ms-2 bg-secondary-subtle border border-light-subtle border rounded-3 p-2 d-flex align-items-center flex-fill justify-content-between" 
                text={mnsResolver}>
                {mnsResolver}
            </CopyText>
           : <></>
        }
        </>
    );
}

export default ResolverBox;
