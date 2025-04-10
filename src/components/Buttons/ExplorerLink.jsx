import { Link } from "react-bootstrap-icons";
import { getTokenId } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { namehash } from "viem";
import { ethers } from "ethers";

function ExplorerLink({name, isWrapped = true }) { 
    
    const explorerUrl = import.meta.env.VITE_APP_EXPLORER_URL;
    const nameWrapperAddress = import.meta.env.VITE_APP_NAME_WRAPPER;
    const nameId = ethers.toBigInt(namehash(name));
    const labelId = ethers.toBigInt(namehash(name));

    function getTokenUrl() {
        const tokenId = isWrapped ?  nameId: labelId;
        const url = `${explorerUrl}/nft/${nameWrapperAddress}/${tokenId}`;
        return url;
    }
    return ( 
        <a className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' 
            target="_blank" 
            href={getTokenUrl()}>
                <Icons.BoxArrowUpRight />
                <span className='ms-2'>MonadExplorer</span>
        </a>
    );
}

export default ExplorerLink;
