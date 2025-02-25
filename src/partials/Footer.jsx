import twittericon from '../assets/images/twitter.svg' ;
import githubicon from '../assets/images/githublogo.svg' ;
import discordicon from '../assets/images/discordicon.svg' ; 
import { useSwitchChain } from 'wagmi';
import { Link } from 'react-router-dom';
import { monadTestnet } from 'viem/chains';

function Footer() {
    const { switchChain } = useSwitchChain()

    return ( 
        <div className="bg-light-subtle border-top border-light-subtle p-0 pt-4 pb-4">
            <div className="container-fluid d-flex flex-column flex-md-row w-100 justify-content-between align-items-center gap-3 ms-2 me-3">
                <ul className="d-flex flex-row gap-3 list-unstyled">
                    <li><Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/terms">Terms</Link></li>
                    <li><Link className="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/privacy">Privacy</Link></li>
                </ul>
                <ul className='d-flex flex-row gap-3 list-unstyled'>
                    <li>
                        <a href={import.meta.env.VITE_APP_TWITTER_URL} target="_blank" rel="noreferrer">
                            <img width={32} src={twittericon} alt="Tiwtter x" />
                        </a>
                    </li>
                    <li>
                        <a href={import.meta.env.VITE_APP_GITHUB_URL} target="_blank" rel="noreferrer">
                            <img width={32} src={githubicon} alt="Github"   /></a>
                    </li>
                    <li>
                        <a href={import.meta.env.VITE_APP_DISCORD_URL} target="_blank" rel="noreferrer">
                            <img width={32} src={discordicon} alt="Discord" />
                        </a>
                    </li>
                </ul>
            </div>
            <div className="d-flex flex-column align-items-center">
                <p className='text-center text-muted'>Copyright © 2025 Monad Name Service</p>
            </div>
        </div>
     );
}

export default Footer;