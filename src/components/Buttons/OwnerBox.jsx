
import { getTokenId, obscureAddress } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { namehash } from "viem";
import { ethers } from "ethers";
import { Dropdown } from "react-bootstrap";
import CopyText from "./CopyText";
import { Link } from "react-router";

function OwnerBox({name, isWrapped = true}) { 
    const explorerUrl = import.meta.env.VITE_APP_EXPLORER_URL;
    let address = "0x42DAaCea431993D938bfEB85EB73e3537C498A56";
    let primaryName = "0xramazan.mon";
    return (  
        <Dropdown drop="up"> 
            <Dropdown.Toggle className="btn btn-link text-decoration-none bg-secondary-subtle text-body-emphasis border rounded-3 overflow-x-scroll">
                <span className="fw-bold">owner &nbsp;</span> 
                {obscureAddress(address)}
            </Dropdown.Toggle> 
            <Dropdown.Menu>
            <Dropdown.ItemText>
                <Link target="_blank" className="link-body-emphasis text-decoration-none" to={"/"+ primaryName}>
                    <Icons.ArrowUpRight /> View Profile
                </Link>
            </Dropdown.ItemText>
            <Dropdown.ItemText>
                <CopyText className="p-0 btn btn-default" text={primaryName}>
                    Copy Name
                </CopyText>
            </Dropdown.ItemText>
            <Dropdown.ItemText>
                <Link target="_blank" className="link-body-emphasis text-decoration-none" to={"/address/"+ address}>
                    <Icons.ArrowUpRight /> View Address
                </Link>
            </Dropdown.ItemText>
            <Dropdown.ItemText>
                <CopyText className="p-0 btn btn-default" text={address}>
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
    );
}

export default OwnerBox;
