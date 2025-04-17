import { Link } from "react-bootstrap-icons";
import { getTokenId } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { namehash } from "viem";
import { ensNormalize, ethers } from "ethers";
import { useEnsAddress } from "wagmi";
import { universalResolver } from "../../config";
import { monadTestnet } from "viem/chains";

function ViewResolvedAddressBox({name}) { 
    
    const {data: mnsAddress } = useEnsAddress({
        name: ensNormalize(name),
        universalResolverAddress: universalResolver,
        chainId: monadTestnet.id
    }); 

    const explorerUrl = import.meta.env.VITE_APP_EXPLORER_URL;
     
    return ( 
        <>
        { mnsAddress ? 
            <a className='btn btn-sm bg-info-subtle border border border-info-subtle text-info-emphasis rounded-3 fw-bold' 
                target="_blank" 
                href={`${explorerUrl}/address//${mnsAddress}`}>
                    <Icons.BoxArrowUpRight className="fw-bold" />
                    <span className='ms-2'>MonadExplorer</span>
            </a>
            : 
            <span className='btn bg-info-subtle border border border-info-subtle text-info rounded-3 text-info-emphasis' 
            >
                N/A
            </span>
        }
        </>
    );
}

export default ViewResolvedAddressBox;
