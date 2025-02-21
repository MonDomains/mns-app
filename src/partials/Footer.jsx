import twittericon from '../assets/images/twitter.svg' ;
import githubicon from '../assets/images/githublogo.svg' ;
import discordicon from '../assets/images/discordicon.svg' ; 
import { useSwitchChain } from 'wagmi';
import { Link } from 'react-router-dom';
import { monadTestnet } from 'viem/chains';

function Footer() {
    const { switchChain } = useSwitchChain()

    return ( 
        <footer className="d-flex flex-column justify-content-between ">
            <div className="d-flex flex-row justify-content-between align-items-center gap-3 ms-2 me-3">
                <div className="footNav">
                    <ul className="d-flex">
                        <li><Link to="/terms">Terms</Link></li>
                        <li><Link to="/privacy">Privacy</Link></li>
                    </ul>
                </div>
                <div className='footerRight'> 
                    <div className="monsocialMedia">
                        <ul className='d-flex'>
                            <li>
                                <a href={import.meta.env.VITE_APP_TWITTER_URL} target="_blank" rel="noreferrer">
                                    <img src={twittericon} alt="Tiwtter x" />
                                </a>
                            </li>
                            <li className='ms-3 me-3'>
                                <a href={import.meta.env.VITE_APP_GITHUB_URL} target="_blank" rel="noreferrer">
                                    <img src={githubicon} alt="Github"   /></a>
                                </li>
                            <li>
                                <a href={import.meta.env.VITE_APP_DISCORD_URL} target="_blank" rel="noreferrer">
                                    <img src={discordicon} alt="Discord" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center">
                <p className='text-center text-muted'>Copyright © 2025 Monad Name Service</p>
            </div>
        </footer>
     );
}

export default Footer;