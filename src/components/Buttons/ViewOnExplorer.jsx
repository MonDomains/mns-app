import * as Icons from "react-bootstrap-icons";
import { labelhash, namehash } from "viem";
import { ethers } from "ethers";
import { normalize } from "viem/ens";
import { baseRegistrar, explorerUrl, nameWrapper } from "../../config";

function ViewOnExplorer({name, labelName, isWrapped = true }) { 
     
    const nameId = ethers.toBigInt(namehash(normalize(name)));
    const labelId = ethers.toBigInt(labelhash(labelName));
 
    function getTokenUrl() {
        const tokenId = isWrapped ?  nameId: labelId;
        const contractAddress = isWrapped ?  nameWrapper: baseRegistrar;
        const url = `${explorerUrl}/nft/${contractAddress}/${tokenId}`;
        return url;
    }
    return ( 
        <a className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' 
            target="_blank" 
            href={getTokenUrl()}>
                <span className='ms-2'>View on Explorer</span>
                <Icons.ArrowUpRight className="ms-2" />
        </a>
    );
}

export default ViewOnExplorer;
