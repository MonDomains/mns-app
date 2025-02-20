import twittericon from '../assets/images/twitter.svg' ;
import githubicon from '../assets/images/githublogo.svg' ;
import discordicon from '../assets/images/discordicon.svg' ;
import telegramicon from '../assets/images/telegramicon.svg' ;
import blockvisionicon from '../assets/images/blockvisionicon.svg' ;
import etherscann from '../assets/images/etherscan-logo.png' ;
import elementmarket from '../assets/images/element.svg' ;
import MetaMaskLogo from '../assets/images/metamask.svg';

import { useSwitchChain } from 'wagmi';

import { Link } from 'react-router-dom';

function Footer() {
    const { switchChain } = useSwitchChain() 

    return ( 
        <footer className="w-100">
            <div className="container-fluid">
                <div className="footNav">
                    <ul className="d-flex">
                        <li><Link to="/terms">Terms</Link></li>
                        <li><Link to="/privacy">Privacy</Link></li>
                    </ul>
                </div>
                <div className='footerRight'>
                    <button className="wallet-connect" onClick={() => switchChain({ chainId: Number(import.meta.env.VITE_APP_SUPPORTED_CHAIN_ID) }) }>Add to Metamask <img src={MetaMaskLogo} alt="loading..." /></button>
                
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
        </footer>
     );
}

export default Footer;