import { useState } from "react";
import * as Icons from "react-bootstrap-icons";
import monadIcon from '../../assets/images/monad.svg';
import { obscureAddress } from "../../helpers/String";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router";
import CopyText from "./CopyText";

function AddressBox ({address}) {   
    const explorerUrl = import.meta.env.VITE_APP_EXPLORER_URL;
    return (  
        <Dropdown drop="up"> 
            <Dropdown.Toggle className="btn btn-link text-decoration-none bg-secondary-subtle text-body-emphasis border rounded-3 overflow-x-scroll">
                <img src={monadIcon} width={24} className="me-2 align-middle" />
                {obscureAddress(address)}
            </Dropdown.Toggle> 
            <Dropdown.Menu>
            <Dropdown.ItemText>
                <Link className="link-body-emphasis text-decoration-none" to={"/address/"+ address}>
                    <Icons.ArrowUpRight /> View Address
                </Link>
            </Dropdown.ItemText>
            <Dropdown.ItemText>
                    <CopyText className="p-0 btn btn btn-default" address={address}>
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

export default AddressBox;
