import { Link } from "react-bootstrap-icons";
import { getExpires, getTokenId } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import { labelhash, namehash } from "viem";
import { ensNormalize, ethers } from "ethers";
import { useEnsAddress, useEnsResolver, useReadContract } from "wagmi";
import { baseRegistrar, gracePeriod, universalResolver } from "../../config";
import { monadTestnet } from "viem/chains";
import { Button } from "react-bootstrap";
import CopyText from "./CopyText";
import baseRegistrarABI from "../../abi/BaseRegistrarImplementation.json";
import moment from "moment";

function ParentBox(props) { 
    return (  
        <CopyText className="btn btn-default ms-2 bg-secondary-subtle border border-light-subtle border rounded-3 p-2 d-flex align-items-center justify-content-between gap-2" 
            text={"mon"}>
            <span className="fw-bold">parent</span>
            { "mon" }
        </CopyText>  
    );
}

export default ParentBox;
