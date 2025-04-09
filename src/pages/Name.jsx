import { useLocation, useParams } from "react-router";
import { isValidName, obscureName } from "../helpers/String"; 
import { useAccount } from 'wagmi'
import React, { useEffect, useState } from "react";  
import Profile from "../components/Profile";
import CopyText from "../components/Buttons/CopyText";
import AddressLink from "../components/Buttons/AddressLink";
import { Link } from "react-router"; 
import Records from "../components/Records";
import Ownership from "../components/Ownership";
import More from "../components/More";

const Name = () => {  
    const { name } = useParams(); 
    const search = useLocation().search;
    const tab = new URLSearchParams(search).get("tab");
    const { address }  = useAccount(); 
    const [activeTab, setActiveTab] = useState();
    
    console.log(tab)
    return (
        <>    
            {!isValidName(name) ?  
                <>  
                    <div className="alert alert-danger text-center container mt-3">
                        <b>{obscureName(name, 30)}</b> is invalid!
                    </div> 
                </>
                : 
                <div className="d-flex flex-column gap-3 p-0"> 
                    <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-1 ps-2 pe-2'>
                        <h1 className="m-0 fw-bold p-0 m-0">
                            {name}
                            <span><CopyText className="btn btn-default p-0 ms-2" text={name} /></span>
                        </h1>
                        <AddressLink name={name} />
                    </div> 
                    <ul className='mb-0 ps-2 pe-2 list-unstyled list-inline text-muted fs-4 d-flex flex-row gap-3 fw-bold overflow-x-scroll'>
                        <li> <Link className={'text-decoration-none '+ (tab == "profile" ? "link-primary": "link-secondary") } to={"/"+ name + "?tab=profile"}>Profile</Link> </li>
                        <li> <Link className={'text-decoration-none '+ (tab == "records" ? "link-primary": "link-secondary")} to={"/"+ name + "?tab=records"}>Records</Link> </li>
                        <li> <Link className={'text-decoration-none '+ (tab == "ownership" ? "link-primary": "link-secondary")} to={"/"+ name + "?tab=ownership"}>Ownership</Link> </li>
                        <li> <Link className={'text-decoration-none '+ (tab == "more" ? "link-primary": "link-secondary")} to={"/"+ name +"?tab=more"}>More</Link> </li>
                    </ul>
                    <div className="d-flex flex-column">
                        {
                            { 
                                "profile": <Profile name={name} address={address} />,
                                "records": <Records name={name} address={address} />,
                                "ownership": <Ownership name={name} address={address} />,
                                "more": <More name={name} address={address} />,
                                null: <Profile name={name} address={address} />
                            }[tab]
                        }
                       
                    </div>
                </div> 
            }
        </>
    ) 
};
 
export default Name;