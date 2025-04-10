
import { useState } from "react";
import { Button } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import { Link } from "react-router";

function CopyText (props) {  
    const [copyStatus, setCopyStatus] = useState(false);
    let timer;

    function copyText(text) {
        navigator.clipboard.writeText(text);
        setCopyStatus(true);
        clearTimeout(timer); 
        timer = setTimeout(()=> {
          setCopyStatus(false);
        }, 2000);
    } 

    return (  
        <> 
            {props.reverse == true ? 
                <button
                    {...props}
                    onClick={(e) => copyText(props.text)}> 
                    { !copyStatus ? <Icons.Copy /> : <Icons.Check /> } {props.children}
                </button>
                : 
                <button
                    {...props}
                    onClick={(e) => copyText(props.text)}> 
                    {props.children} { !copyStatus ? <Icons.Copy /> : <Icons.Check /> }
                </button>
            }
        </>
        
        
    );
}

export default CopyText;
