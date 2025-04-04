import { useState } from "react";
import MnsLogo from '../assets/images/monadns-app-logo.svg'; 
import ConnectWalletButton from "../components/ConnectWalletButton"; 
import { Link, NavLink } from 'react-router';
import * as Icon from 'react-bootstrap-icons';
import TopAlert from "./TopAlert";
import Search from "./Search";
import { useAccount } from "wagmi";
import { Button, Dropdown } from "react-bootstrap";

function Header({showSearch}) { 
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const { isConnected } = useAccount();
 
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
        return false;
    }

    return ( 
        <>
        <TopAlert /> 
        <div className="container-fluid">
            <div className="d-flex flex-row gap-3">
                <div className="d-flex flex-row justify-content-between gap-2 w-100">
                    <div className="d-flex flex-row gap-4">
                        <NavLink to="/" className="navbar-brand d-flex flex-row gap-2 align-items-center justify-content-center">
                            <img width={32} src={MnsLogo} alt="Mon Name Services" />
                            <span className="logo h3 text-primary gradient mb-0">MNS</span>
                        </NavLink> 
                    </div> 
                    <div className="d-flex flex-row align-items-center justify-content-between">
                        <ConnectWalletButton></ConnectWalletButton>
                        <Dropdown>
                            <Dropdown.Toggle className='nav border-0 p-1' variant='none'>
                                <Icon.List size={24} />
                            </Dropdown.Toggle> 
                            <Dropdown.Menu>
                                <Dropdown.Item href="/account">My Names</Dropdown.Item>
                                <Dropdown.Item href={"https://docs.monadns.com"} target="_blank">Docs</Dropdown.Item>
                                <Dropdown.Item href={"https://monadns.com/terms"} target="_blank">Terms</Dropdown.Item>
                                <Dropdown.Item href={"https://monadns.com/privacy"} target="_blank">Privacy</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.ItemText role="button" onClick={()=>  handleTheme()} className="d-flex flex-row align-items-center gap-2">
                                    <strong>Theme:</strong>
                                    {theme === 'light' ? <> <Icon.BrightnessHighFill /> Light </> : <><Icon.MoonFill /> Dark </> }
                                </Dropdown.ItemText>
                                <Dropdown.Divider />
                                <Dropdown.ItemText className="d-flex flex-row gap-3">
                                    <a href={import.meta.env.VITE_APP_TWITTER_URL} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                        <Icon.TwitterX />
                                    </a>
                                    <a href={import.meta.env.VITE_APP_GITHUB_URL} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                        <Icon.Github />
                                    </a>
                                    <a href={import.meta.env.VITE_APP_DISCORD_URL} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                        <Icon.Discord />
                                    </a>
                                </Dropdown.ItemText>
                            </Dropdown.Menu>
                        </Dropdown> 
                    </div>
                </div> 
            </div>
        </div>
         
        </> 
    );
}

export default Header;