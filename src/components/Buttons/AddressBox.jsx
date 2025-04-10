import { useState } from "react";
import * as Icons from "react-bootstrap-icons";
import monadIcon from '../../assets/images/monad.svg';
import { obscureAddress } from "../../helpers/String";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router";
import CopyText from "./CopyText";
import { universalResolver } from "../../config";
import { monadTestnet } from "viem/chains";
import { useEnsAddress } from "wagmi";
import { ensNormalize } from "ethers";

function AddressBox (props) {   
    const {data: address } = useEnsAddress({
        name: ensNormalize(props.name),
        universalResolverAddress: universalResolver,
        chainId: monadTestnet.id
    }); 

    const explorerUrl = import.meta.env.VITE_APP_EXPLORER_URL;
    
    return (  
        <>
        { address ? 
            <Dropdown drop="up"> 
                <Dropdown.Toggle className="btn btn-link text-decoration-none bg-secondary-subtle text-body-emphasis border rounded-3 overflow-x-scroll">
                    <img src={monadIcon} width={24} className="me-2 align-middle" />
                    { address ? obscureAddress(address): "Not set" }
                </Dropdown.Toggle> 
                <Dropdown.Menu>
                    <Dropdown.ItemText>
                        <Link className="link-body-emphasis text-decoration-none" to={"/address/"+ address}>
                            <Icons.ArrowUpRight /> View Address
                        </Link>
                    </Dropdown.ItemText>
                    <Dropdown.ItemText>
                        <CopyText reverse={true} className="p-0 btn btn btn-default" text={address}>
                            Copy Address
                        </CopyText>
                    </Dropdown.ItemText>
                    <Dropdown.ItemText>
                        <Link className="link-body-emphasis text-decoration-none" to={`${explorerUrl}/address/${address}`} target="_blank">
                            <Icons.ArrowUpRight /> View on Explorer
                        </Link>
                    </Dropdown.ItemText>
                </Dropdown.Menu>
            </Dropdown>
        : 
        <Button className="btn btn-link text-decoration-none bg-secondary-subtle text-body-emphasis border rounded-3 overflow-x-scroll">
            <img src={monadIcon} width={24} className="me-2 align-middle" />
            Not set
        </Button> 
        }
      </>
    );
}

export default AddressBox;
