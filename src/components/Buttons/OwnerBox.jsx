
import { getTokenId, obscureAddress, obscureName } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { labelhash, namehash, zeroAddress } from "viem";
import { ethers } from "ethers";
import { Dropdown } from "react-bootstrap";
import CopyText from "./CopyText";
import { Link } from "react-router";
import { readContract } from "viem/actions";
import { baseRegistrar, explorerUrl, mnsRegistry, nameWrapper, rainbowConfig, universalResolver } from "../../config";
import mnsRegistryABI from '../../abi/Registry.json'
import baseRegistrarABI from '../../abi/BaseRegistrarImplementation.json'
import nameWrapperABI from '../../abi/NameWrapper.json'
import { monadTestnet } from "viem/chains";
import { useEnsName, useReadContract } from "wagmi";
import { useState } from "react";
import { normalize } from "viem/ens";

function OwnerBox(props) { 
    let ownerAddress;
    let ownerName;

    if(props.isWrapped) {
        const {data: wrappedOwnerAddress } = useReadContract({
            abi: nameWrapperABI,
            address: nameWrapper,
            functionName: 'ownerOf',
            args: [namehash(normalize(props.name))],
            account: props.address,
            chainId: monadTestnet.id
        });
        
        if(wrappedOwnerAddress && wrappedOwnerAddress != zeroAddress) 
            ownerAddress = wrappedOwnerAddress;  
    } else {
        // manager
        /* 
        const {data: unWrappedOwnerAddress } = useReadContract({
            abi: mnsRegistryABI,
            address: mnsRegistry,
            functionName: 'owner',
            args: [namehash(normalize(props.name))],
            account: props.address,
            chainId: monadTestnet.id
        }); */

        const {data: unWrappedOwnerAddress } = useReadContract({
            abi: baseRegistrarABI,
            address: baseRegistrar,
            functionName: 'ownerOf',
            args: [ ethers.toBigInt(labelhash(props.labelName))],
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
            <Dropdown.Toggle className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3">
                <span className="fw-bold">owner &nbsp;</span> 
                { ownerName ?  obscureName( ownerName, 25) : obscureAddress(ownerAddress) }
                <Icons.ThreeDotsVertical />
            </Dropdown.Toggle> 
            <Dropdown.Menu>
            {ownerName ? 
            <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                <Link target="_blank" className="link-body-emphasis text-decoration-none" to={"/"+ ownerName}>
                    <Icons.ArrowUpRight />  View Profile
                </Link>
            </Dropdown.ItemText> : <></>
            }
            {ownerName ? 
            <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                <CopyText reverse={true} className="p-0 btn btn-default" text={ownerName}>
                    Copy Name
                </CopyText>
            </Dropdown.ItemText>
            : <></>
            }
            <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                <Link target="_blank" className="link-body-emphasis text-decoration-none" to={"/address/"+ ownerAddress}>
                    <Icons.ArrowUpRight /> View Address
                </Link>
            </Dropdown.ItemText>
            <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                <CopyText reverse={true}  className="p-0 btn btn-default" text={ownerAddress}>
                    Copy Address
                </CopyText>
            </Dropdown.ItemText>
            <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                <Link className="link-body-emphasis text-decoration-none" to={`${explorerUrl}/address/${ownerAddress}`} target="_blank">
                    <Icons.ArrowUpRight /> View on Explorer
                </Link>
            </Dropdown.ItemText>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default OwnerBox;
