import { NavLink } from 'react-router';
import MnsLogo from '../assets/images/mns-logo.svg'; 

function Logo() {  
    return ( 
        <NavLink to="/" className="navbar-brand d-flex flex-row gap-2 align-items-center justify-content-center">
            <img width={32} src={MnsLogo} alt="Mon Name Services" />
            <span className="text-primary gradient mb-0 fs-3 fw-bold">MNS</span>
        </NavLink>  
    );
}

export default Logo;



