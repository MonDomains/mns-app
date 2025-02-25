import { useState } from "react";
import Logo from '../assets/images/mns-logo.svg'; 
import ConnectWalletButton from "../components/ConnectWalletButton"; 
import { Link, NavLink } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import TopAlert from "./TopAlert";

function Header() { 
    const [open, setOpen] = useState(false);
    return ( 
        <>
        <TopAlert />
        <div className="container-fluid bg-light-subtle border-bottom border-bottom-subtle p-3">
            <div className="d-flex flex-row gap-3">
                <div className="d-flex flex-row justify-content-between gap-4 w-100">
                    <NavLink to="/" className="navbar-brand d-flex flex-row gap-2 align-items-center">
                        <img width={48} height={48} src={Logo} alt="Monad Name Services" />
                        <span className="d-none d-md-block">Monad Name Service</span>
                        <span className="d-md-none">MNS</span>
                    </NavLink> 
                    <div className="d-flex flex-row align-items-center gap-3">
                        <div className="d-none d-lg-block">
                            <ul className="mb-3 mb-lg-0 gap-3 list-unstyled">
                                <li className="">
                                    <Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/account">My Domains</Link>
                                </li> 
                            </ul>
                        </div>
                        <div className="d-flex flex-row gap-3">
                            <ConnectWalletButton></ConnectWalletButton>
                            <button aria-label="Collapse" className="btn btn-ms d-xs-block d-lg-none p-0 m-0" type="button" onClick={() => setOpen(!open)}>
                                <Icon.List size={24} />
                            </button>
                        </div>    
                    </div> 
                </div> 
            </div>
            <div className={ !open ? "collapse" : "d-md-none p-2" }>
                <ul className="mb-3 mb-lg-0 gap-3">
                    <li className="">
                        <Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/account">My Domains</Link>
                    </li> 
                </ul>
            </div>
        </div>
        </>
        
    );
}

export default Header;