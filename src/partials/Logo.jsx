import { NavLink } from 'react-router';
import MnsLogo from '../assets/images/monadns-app-logo.svg'; 

function Logo() {  
    return (
        <NavLink to="/" className="navbar-brand d-flex flex-row gap-2 align-items-center justify-content-center">
            <img width={32} src={MnsLogo} alt="Mon Name Services" />
            <span className="logo h3 text-primary gradient mb-0">MNS</span>
        </NavLink> 
    );
}

export default Logo;



