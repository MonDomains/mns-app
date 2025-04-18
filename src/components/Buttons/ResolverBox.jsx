import { Link } from "react-bootstrap-icons";
import { getTokenId } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { namehash } from "viem";
import { ensNormalize, ethers } from "ethers";
import { useEnsAddress, useEnsResolver, useReadContract } from "wagmi";
import { mnsRegistry, rainbowConfig, universalResolver } from "../../config";
import { monadTestnet } from "viem/chains";
import { Button } from "react-bootstrap";
import CopyText from "./CopyText";
import { normalize } from "viem/ens";
import mnsRegistryABI from "../../abi/Registry.json";
import ResolverEditButton from "./ResolverEditButton"

function ResolverBox(props) { 
    
    const { data: mnsResolver } = useReadContract({
        abi: mnsRegistryABI,
        address: mnsRegistry,
        functionName: "resolver",
        args: [namehash(normalize(props.name))],
        chainId: monadTestnet.id
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
