
import { useEnsResolver } from "wagmi";
import { rainbowConfig, universalResolver } from "../../config";
import CopyText from "./CopyText";
import { normalize } from "viem/ens";
import ResolverEditButton from "./ResolverEditButton"
import { monadTestnet } from "viem/chains";

function ResolverBox(props) { 
    
    const {data: mnsResolver} = useEnsResolver({
        name: normalize(props.name),
        universalResolverAddress: universalResolver,
    }); 
 
    return ( 
        <>
        { mnsResolver ? 
            <CopyText className="btn btn-default bg-body-tertiary border border-light-subtle border rounded-3 p-2 text-break text-start w-100 d-flex flex-row justify-content-between align-items-md-center gap-2" 
                text={mnsResolver}> 
                <span>{mnsResolver}</span>
            </CopyText>
           : <></>
        }
        <ResolverEditButton {...props} resolverAddress={mnsResolver} />
        </>
    );
}

export default ResolverBox;
