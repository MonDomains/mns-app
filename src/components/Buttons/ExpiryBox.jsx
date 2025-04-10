import { Link } from "react-bootstrap-icons";
import { getExpires, getTokenId } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { labelhash, namehash } from "viem";
import { ensNormalize, ethers } from "ethers";
import { useEnsAddress, useEnsResolver, useReadContract } from "wagmi";
import { baseRegistrar, gracePeriod, universalResolver } from "../../config";
import { monadTestnet } from "viem/chains";
import { Button } from "react-bootstrap";
import CopyText from "./CopyText";
import baseRegistrarABI from "../../abi/BaseRegistrarImplementation.json";
import moment from "moment";

function ExpiryBox(props) { 
    
    const { data: expiry, isLoading, error } = useReadContract({
        abi: baseRegistrarABI,
        address: baseRegistrar,
        functionName: 'nameExpires',
        args: [labelhash(props.labelName)],
        chainId: monadTestnet.id
    });  
     
    return (  
        <CopyText className="btn btn-default ms-2 bg-secondary-subtle border border-light-subtle border rounded-3 p-2 d-flex align-items-center justify-content-between gap-2" 
            text={expiry}>
            <span className="fw-bold">expiry</span>
            { isLoading ? "Loading...": expiry ? moment.unix(Number(expiry)).format("ll") : "n/a" }
        </CopyText>  
    );
}

export default ExpiryBox;
