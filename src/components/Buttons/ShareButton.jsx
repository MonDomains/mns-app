
import { obscureName } from "../../helpers/String";
import * as Icons from "react-bootstrap-icons";
import moment from "moment";
import { Link } from "react-router";

function ShareButton(props) { 

    function getText() {
        return encodeURIComponent(
`I've minted ${obscureName(props.name, 30)} 😎 

Powered by @MonDomains, built on @monad_xyz. 

Mint yours 👇

https://dapp.monadns.com/${props.name}?v=${moment().unix()}`);
    }

    return (  
        <Link 
            target="_blank" 
            to={"https://x.com/intent/post?text="+ getText()} 
            className={"btn bg-black text-white border rounded-2 "+ (props?.variant == "lg" ? "btn-lg": "") } > 
            Share on <Icons.TwitterX />
        </Link>
    );
}

export default ShareButton;
