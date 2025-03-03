import twittericon from '../assets/images/twitter.svg' ;
import githubicon from '../assets/images/githublogo.svg' ;
import discordicon from '../assets/images/discordicon.svg' ; 
import { useSwitchChain } from 'wagmi';
import { Link } from 'react-router';
import { monadTestnet } from 'viem/chains';
import { Github, Twitter, TwitterX } from 'react-bootstrap-icons';

function Footer() {
    const { switchChain } = useSwitchChain()

    return ( 
        <>
            <div className="container-fluid d-flex flex-column flex-md-row w-100 justify-content-between align-items-center gap-3 ms-2">
                <ul className="d-flex flex-row gap-3 list-unstyled">
                    <li><Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/terms">Terms</Link></li>
                    <li><Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/privacy">Privacy</Link></li>
                </ul>
                <ul className='d-flex flex-row gap-3 list-unstyled'>
                    <li>
                        <a href={import.meta.env.VITE_APP_TWITTER_URL} target="_blank" rel="noreferrer" className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                            <TwitterX />
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
                <p className='text-center text-muted'>Copyright © 2025 Monad Name Service</p>
            </div>
        </>
     );
}

export default Footer;