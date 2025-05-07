import { useState } from "react";
import * as Icons from "react-bootstrap-icons";
import monadIcon from '../../assets/images/monad.svg';
import { obscureAddress } from "../../helpers/String";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router";
import CopyText from "./CopyText";
import { explorerUrl, publicResolver, rainbowConfig, universalResolver } from "../../config";
import { monadTestnet } from "viem/chains";
import { useEnsAddress, useEnsResolver, useReadContract } from "wagmi";
import { ensNormalize } from "ethers";
import SetAddrButton from "./SetAddrButton";
import publicResolverABI from "../../abi/PublicResolver.json";
import { namehash } from "viem";
import { normalize } from "viem/ens";

function AddressBox (props) {   
    const {data: mnsResolver } = useEnsResolver({
        name: ensNormalize(props.name),
        universalResolverAddress: universalResolver,
        chainId: monadTestnet.id
    }); 
  
    
    const resolver = mnsResolver ?? publicResolver;

    const {data: mnsAddress } = useReadContract({
        abi: publicResolverABI,
        address: resolver,
        functionName: "addr",
        args: [namehash(normalize(props.name))], 
        chainId: monadTestnet.id
    }); 
 
    return (  
        <>
        { mnsAddress ? 
            <>
                <Dropdown drop="up"> 
                    <Dropdown.Toggle className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3">
                        <img src={monadIcon} width={18} className="mb-1 me-1" />
                        { mnsAddress ? obscureAddress(mnsAddress): "Not set" } 
                        <Icons.ThreeDotsVertical />
                    </Dropdown.Toggle> 
                    <Dropdown.Menu>
                        <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                            <Link className="link-body-emphasis text-decoration-none" to={"/address/"+ mnsAddress}>
                                <Icons.ArrowUpRight /> View Address
                            </Link>
                        </Dropdown.ItemText>
                        <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                            <CopyText reverse={true} className="p-0 btn btn btn-default" text={mnsAddress}>
                                Copy Address
                            </CopyText>
                        </Dropdown.ItemText>
                        <Dropdown.ItemText className="pt-2 pb-2 ps-3 pe-2">
                            <Link className="link-body-emphasis text-decoration-none" to={`${explorerUrl}/address/${mnsAddress}`} target="_blank">
                                <Icons.ArrowUpRight /> View on Explorer
                            </Link>
                        </Dropdown.ItemText>
                    </Dropdown.Menu>
                </Dropdown>
            </>
            : 
            <Button className="btn btn-link text-decoration-none bg-body-tertiary text-body-emphasis border rounded-3 overflow-x-scroll">
                <img src={monadIcon} width={18} className="me-2" />
                N/A
            </Button>
        }
        <SetAddrButton {...props} mnsAddress={mnsAddress} /> 
      </>
    );
}

export default AddressBox;
