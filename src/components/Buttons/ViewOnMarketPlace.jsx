import * as Icons from "react-bootstrap-icons";
import { labelhash, namehash } from "viem";
import { ethers } from "ethers";
import { normalize } from "viem/ens";
import { baseRegistrar, marketPlaceUrl, nameWrapper } from "../../config";

function ViewOnMarketPlace({name, labelName, isWrapped = true }) { 
    
    const nameId = ethers.toBigInt(namehash(normalize(name)));
    const labelId = ethers.toBigInt(labelhash(labelName));
 
    function getTokenUrl() {
        const tokenId = isWrapped ?  nameId: labelId;
        const contractAddress = isWrapped ?  nameWrapper: baseRegistrar;
        const url = `${marketPlaceUrl}/${contractAddress}/${tokenId}`;
        return url;
    }
    return ( 
        <a className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' 
            target="_blank" 
            href={getTokenUrl()}>
                <span>View on Marketplace</span>
                <Icons.ArrowUpRight className="ms-2" />
        </a>
    );
}

export default ViewOnMarketPlace;
