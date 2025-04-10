
import { useState } from "react";
import * as Icons from "react-bootstrap-icons";

function ExtendButton ({name}) {  
     
    return ( 
        <button  
            className='btn bg-primary-subtle text-primary' 
        > 
            <Icons.FastForwardFill /> Extend
        </button>
    );
}

export default ExtendButton;
