
import { getTokenId, obscureAddress } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { namehash, zeroAddress } from "viem";
import { ethers } from "ethers";
import { Dropdown } from "react-bootstrap";
import CopyText from "./CopyText";
import { Link } from "react-router";
import { readContract } from "viem/actions";
import { explorerUrl, mnsRegistry, nameWrapper, rainbowConfig, universalResolver } from "../../config";
import mnsRegistryABI from '../../abi/Registry.json'
import nameWrapperABI from '../../abi/NameWrapper.json'
import { monadTestnet } from "viem/chains";
import { useEnsName, useReadContract } from "wagmi";
import { useState } from "react";

function OwnerBox(props) { 
    let ownerAddress;
    let ownerName;

    if(props.isWrapped) {
        const {data: wrappedOwnerAddress } = useReadContract({
            abi: nameWrapperABI,
            address: nameWrapper,
            functionName: 'ownerOf',
            args: [namehash(props.name)],
            account: props.address,
            chainId: monadTestnet.id
        });
        
        if(wrappedOwnerAddress && wrappedOwnerAddress != zeroAddress) 
            ownerAddress = wrappedOwnerAddress;  
    } else {
        const {data: unWrappedOwnerAddress } = useReadContract({
            abi: mnsRegistryABI,
            address: mnsRegistry,
            functionName: 'owner',
            args: [namehash(props.name)],
            account: props.address,
            chainId: monadTestnet.id
        });

        if(unWrappedOwnerAddress && unWrappedOwnerAddress != zeroAddress) 
            ownerAddress = unWrappedOwnerAddress;  
    }
      
    const {data: mnsName } = useEnsName({
        address: ownerAddress,
        universalResolverAddress: universalResolver,
        chainId: monadTestnet.id
    });  

    if(mnsName) ownerName = mnsName;
 
    return (  
        <Dropdown drop="up"> 
            <Dropdown.Toggle className="btn btn-link text-decoration-none bg-secondary-subtle text-body-emphasis border rounded-3 overflow-x-scroll p-2">
                <span className="fw-bold">owner &nbsp;</span> 
                { ownerName ? ownerName : obscureAddress(ownerAddress) }
            </Dropdown.Toggle> 
            <Dropdown.Menu>
            {ownerName ? 
            <Dropdown.ItemText>
                <Link target="_blank" className="link-body-emphasis text-decoration-none" to={"/"+ ownerName}>
                    <Icons.ArrowUpRight />  View Profile
                </Link>
            </Dropdown.ItemText> : <></>
            }
            {ownerName ? 
            <Dropdown.ItemText>
                <CopyText reverse={true} className="p-0 btn btn-default" text={ownerName}>
                    Copy Name
                </CopyText>
            </Dropdown.ItemText>
            : <></>
            }
            <Dropdown.ItemText>
                <Link target="_blank" className="link-body-emphasis text-decoration-none" to={"/address/"+ ownerAddress}>
                    <Icons.ArrowUpRight /> View Address
                </Link>
            </Dropdown.ItemText>
            <Dropdown.ItemText>
                <CopyText reverse={true}  className="p-0 btn btn-default" text={ownerAddress}>
                    Copy Address
                </CopyText>
            </Dropdown.ItemText>
            <Dropdown.ItemText>
                <Link className="link-body-emphasis text-decoration-none" to={`${explorerUrl}/address/${ownerAddress}`} target="_blank">
                    <Icons.ArrowUpRight /> View on Explorer
                </Link>
            </Dropdown.ItemText>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default OwnerBox;
