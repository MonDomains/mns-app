import * as Icons from "react-bootstrap-icons";
import { labelhash, namehash } from "viem";
import { ethers } from "ethers";
import { normalize } from "viem/ens";

function ExplorerLink({name, labelName, isWrapped = true }) { 
    
    const explorerUrl = import.meta.env.VITE_APP_EXPLORER_URL;
    const nameWrapperAddress = import.meta.env.VITE_APP_NAME_WRAPPER;
    const baseRegistrar = import.meta.env.VITE_APP_BASE_REGISTRAR;
    const nameId = ethers.toBigInt(namehash(normalize(name)));
    const labelId = ethers.toBigInt(labelhash(labelName));
 
    function getTokenUrl() {
        const tokenId = isWrapped ?  nameId: labelId;
        const contractAddress = isWrapped ?  nameWrapperAddress: baseRegistrar;
        const url = `${explorerUrl}/nft/${contractAddress}/${tokenId}`;
        return url;
    }
    return ( 
        <a className='btn btn-sm bg-info-subtle border border border-info text-info rounded-3 fw-bold' 
            target="_blank" 
            href={getTokenUrl()}>
                <Icons.BoxArrowUpRight />
                <span className='ms-2'>MonadExplorer</span>
        </a>
    );
}

export default ExplorerLink;
