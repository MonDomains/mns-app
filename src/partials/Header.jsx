import { useState } from "react";
import MnsLogo from '../assets/images/monadns-app-logo.svg'; 
import ConnectWalletButton from "../components/ConnectWalletButton"; 
import { Link, NavLink } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import TopAlert from "./TopAlert";

function Header() { 
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
 
    document.documentElement.setAttribute('data-bs-theme', theme);

    function handleTheme() {
        if (theme === 'light') {
          document.documentElement.setAttribute('data-bs-theme', 'dark');
          setTheme('dark');
          localStorage.setItem("theme", "dark")
        } else {
          document.documentElement.setAttribute('data-bs-theme', 'light');
          setTheme('light');
          localStorage.setItem("theme", "light")
        }
    }

    return ( 
        <>
        <TopAlert />
        <div className="container-fluid p-3 ps-lg-5">
            <div className="d-flex flex-row gap-3">
                <div className="d-flex flex-row justify-content-between gap-4 w-100">
                    <NavLink to="/" className="navbar-brand d-flex flex-row gap-2 align-items-center justify-content-center">
                        <img width={32} src={MnsLogo} alt="Monad Name Services" />
                        <span className="h3 fw-bold text-primary gradient mb-0">MNS</span>
                    </NavLink> 
                    <div className="d-flex flex-row align-items-center gap-3">
                        <div className="d-none d-lg-block">
                            <ul className="list-unstyled mb-3 mb-lg-0 gap-3 list-unstyled">
                                <li>
                                    <Link className="text-decoration-none fs-5 link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/account">
                                        <Icon.ListUl className="me-2" /> 
                                        My Domains
                                    </Link>
                                </li> 
                            </ul>
                        </div>
                        <div className="d-flex flex-row align-items-center gap-2">
                            <ConnectWalletButton></ConnectWalletButton>
                            <button aria-label="Collapse" className="btn btn-ms d-xs-block d-lg-none p-0 m-0" type="button" onClick={() => setOpen(!open)}>
                                <Icon.List size={24} />
                            </button>
                            {theme === 'light' ? (
                                <button className='btn btn-sm bg-light-subtle text-body-emphasis rounded-circle' onClick={() => handleTheme()}>
                                <Icon.BrightnessHighFill />
                                </button>
                            ) : (
                                <button className='btn btn-sm bg-light-subtle text-body-emphasis rounded-circle' onClick={() => handleTheme()}>
                                <Icon.MoonFill />
                                </button>
                            )}
                        </div>    
                    </div> 
                </div> 
            </div>
            <div className={ !open ? "collapse" : "d-md-none p-2" }>
                <ul className="list-unstyled mb-3 mb-lg-0 gap-3">
                    <li>
                        <Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/account">My Domains</Link>
                    </li> 
                </ul>
            </div>
        </div>
        </>
        
    );
}

export default Header;