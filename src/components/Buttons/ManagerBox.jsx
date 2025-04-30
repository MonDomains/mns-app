
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

function ManagerBox(props) { 
    
    let managerName;

    if(!props.isWrapped && props.managerAddress != nameWrapper) {
     
        const {data: mnsName } = useEnsName({
            address: props.managerAddress,
            universalResolverAddress: universalResolver,
            chainId: monadTestnet.id
        });  
    
        if(mnsName) managerName = mnsName;
    }
        
    return (  
        <>
            {props.managerAddress != nameWrapper ? 
            <Dropdown drop="up"> 
                <Dropdown.Toggle className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3">
                    <span className="fw-bold">manager &nbsp;</span> 
                    { managerName ?  obscureName( managerName, 25) : obscureAddress(props.managerAddress) }
                    <Icons.ThreeDotsVertical />
                </Dropdown.Toggle> 
                <Dropdown.Menu>
                {managerName ? 
                <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                    <Link target="_blank" className="link-body-emphasis text-decoration-none" to={"/"+ managerName}>
                        <Icons.ArrowUpRight />  View Profile
                    </Link>
                </Dropdown.ItemText> : <></>
                }
                {managerName ? 
                <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                    <CopyText reverse={true} className="p-0 btn btn-default" text={props.managerName}>
                        Copy Name
                    </CopyText>
                </Dropdown.ItemText>
                : <></>
                }
                <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                    <Link target="_blank" className="link-body-emphasis text-decoration-none" to={"/address/"+ props.managerAddress}>
                        <Icons.ArrowUpRight /> View Address
                    </Link>
                </Dropdown.ItemText>
                <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                    <CopyText reverse={true}  className="p-0 btn btn-default" text={props.managerAddress}>
                        Copy Address
                    </CopyText>
                </Dropdown.ItemText>
                <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                    <Link className="link-body-emphasis text-decoration-none" to={`${explorerUrl}/address/${props.managerAddress}`} target="_blank">
                        <Icons.ArrowUpRight /> View on Explorer
                    </Link>
                </Dropdown.ItemText>
                </Dropdown.Menu>
            </Dropdown>
            : <></>
            }
        </>
    );
}

export default ManagerBox;
