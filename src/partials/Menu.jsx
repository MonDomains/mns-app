import * as Icon from 'react-bootstrap-icons';
import { Dropdown } from "react-bootstrap";
import { discordUrl, githubUrl, twitterUrl } from "../config";
import { useAccount } from 'wagmi';
import { useState } from 'react';

function Menu() { 
    const { isConnected } = useAccount();
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
        return false;
    }

    return (
        <Dropdown>
            <Dropdown.Toggle size="lg" className='nav border-0 p-1' variant='none'>
                <Icon.List size={24} />
            </Dropdown.Toggle> 
            <Dropdown.Menu>
                {isConnected ?  <Dropdown.Item className="fs-6" href="/account">My Names</Dropdown.Item> : <></>}
                <Dropdown.Item className="fs-6" href={"https://docs.monadns.com"} target="_blank">Docs</Dropdown.Item>
                <Dropdown.Item className="fs-6" href={"https://monadns.com/terms"} target="_blank">Terms</Dropdown.Item>
                <Dropdown.Item className="fs-6" href={"https://monadns.com/privacy"} target="_blank">Privacy</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.ItemText role="button" onClick={()=>  handleTheme()} className="d-flex flex-row align-items-center gap-2 fs-6">
                    <strong>Theme:</strong>
                    {theme === 'light' ? <> <Icon.BrightnessHighFill /> Light </> : <><Icon.MoonFill /> Dark </> }
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.ItemText className="d-flex flex-row gap-3">
                    <a href={twitterUrl} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                        <Icon.TwitterX />
                    </a>
                    <a href={githubUrl} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                        <Icon.Github />
                    </a>
                    <a href={discordUrl} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                        <Icon.Discord />
                    </a>
                </Dropdown.ItemText>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default Menu;