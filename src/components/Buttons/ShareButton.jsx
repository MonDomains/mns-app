
import { getExpires, getTokenId, obscureName } from "../../helpers/String";
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
import { Link } from "react-router";

function ShareButton(props) { 

    function getText() {
        return encodeURIComponent(
`I've minted ${obscureName(props.name, 25)} 😎 

Powered by @MonDomains, built on @monad_xyz. 

Mint yours 👇

https://dapp.monadns.com/${props.name}?v=${moment().unix()} 

        `);
    }

    return (  
        <Link 
            target="_blank" 
            to={"https://x.com/intent/post?text="+ getText()} 
            className="btn btn-lg bg-black text-white border rounded-2"> 
            Share on <Icons.TwitterX />
        </Link>
    );
}

export default ShareButton;
