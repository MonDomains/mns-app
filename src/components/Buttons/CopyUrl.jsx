
import { useState } from "react";
import { Button } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import { Link } from "react-router";

function CopyUrl (props) {  
    const [copyStatus, setCopyStatus] = useState(false);
    let timer;

    function copyUrl(url) {
        navigator.clipboard.writeText(url);
        setCopyStatus(true);
        clearTimeout(timer); 
        timer = setTimeout(()=> {
          setCopyStatus(false);
        }, 2000);
    } 

    return (  
        <>  
        <button
            {...props}
            className="btn bg-primary-subtle border border-primary-subtle fw-bold text-primary"
            onClick={(e) => copyUrl(props.url)}> 
            {props.children} { !copyStatus ? <Icons.Copy className="ms-1 mb-1" /> : <Icons.Check className="ms-1 mb-1" /> }
        </button> 
        </>
        
        
    );
}

export default CopyUrl;
