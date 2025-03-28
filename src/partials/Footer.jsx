import twittericon from '../assets/images/twitter.svg' ;
import githubicon from '../assets/images/githublogo.svg' ;
import discordicon from '../assets/images/discordicon.svg' ; 
import { useSwitchChain } from 'wagmi';
import { Link } from 'react-router';
import { monadTestnet } from 'viem/chains';
import { Discord, Github, Twitter, TwitterX } from 'react-bootstrap-icons';

function Footer() {
    const { switchChain } = useSwitchChain()

    return ( 
        <>
            <div className="container-fluid d-flex flex-column flex-md-row w-100 justify-content-between align-items-center gap-3">
                <ul className="d-flex flex-row gap-3 list-unstyled">
                    <li><Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" target='_blank' to="https://docs.monadns.com">Docs</Link></li>
                    <li><Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" target='_blank' to="https://monadns.com/terms">Terms</Link></li>
                    <li><Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" target='_blank' to="https://monadns.com/privacy">Privacy</Link></li>
                </ul>
                <ul className='d-flex flex-row gap-3 list-unstyled'>
                    <li>
                        <a href={import.meta.env.VITE_APP_TWITTER_URL} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                            <TwitterX />
                        </a>
                    </li>
                    <li>
                        <a href={import.meta.env.VITE_APP_DISCORD_URL} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                            <Discord />
                        </a>
                    </li>
                    <li>
                        <a href={import.meta.env.VITE_APP_GITHUB_URL} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                            <Github />
                        </a>
                    </li>
                </ul>
            </div>
            <div className="d-flex flex-column align-items-center">
                <p className='text-center text-muted'>Copyright © 2025 <a href="https://monadns.com" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>Mon Name Service</a></p>
            </div>
        </>
     );
}

export default Footer;