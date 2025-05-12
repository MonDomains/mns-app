import { labelhash } from "viem";
import { useReadContract } from "wagmi";
import { baseRegistrar } from "../../config";
import { monadTestnet } from "viem/chains";
import CopyText from "./CopyText";
import baseRegistrarABI from "../../abi/BaseRegistrar.json";
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
        <CopyText className="btn btn-default bg-body-tertiary border border-light-subtle border rounded-3 d-flex align-items-center justify-content-between gap-2" 
            text={expiry}>
            <span className="fw-bold">expiry</span>
            { isLoading ? "Loading...": expiry ? moment.unix(Number(expiry)).format("ll") : "n/a" }
        </CopyText>  
    );
}

export default ExpiryBox;
