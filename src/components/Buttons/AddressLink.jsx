import { Link } from "react-bootstrap-icons";
import { getTokenId } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { namehash } from "viem";
import { ensNormalize, ethers } from "ethers";
import { useEnsAddress } from "wagmi";
import { universalResolver } from "../../config";
import { monadTestnet } from "viem/chains";

function AddressLink({name}) { 
    
    const {data: mnsAddress } = useEnsAddress({
        name: ensNormalize(name),
        universalResolverAddress: universalResolver,
        chainId: monadTestnet.id
    }); 

    const explorerUrl = import.meta.env.VITE_APP_EXPLORER_URL;
     
    return ( 
        <>
        { mnsAddress ? 
            <a className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' 
                target="_blank" 
                href={`${explorerUrl}/address//${mnsAddress}`}>
                    <Icons.BoxArrowUpRight />
                    <span className='ms-2'>MonadExplorer</span>
            </a>: <></>
        }
        </>
    );
}

export default AddressLink;
