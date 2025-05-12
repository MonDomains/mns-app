
import ConnectWalletButton from "../components/ConnectWalletButton"; 
import Menu from './Menu';
import Logo from "./Logo"; 

function Header() { 
    return (  
        <div className="d-flex flex-row gap-3 p-2 ps-lg-4 pt-lg-3">
            <div className="d-flex flex-row justify-content-between gap-2 w-100">
                <div className="d-flex flex-row gap-4">
                    <Logo />
                </div> 
                <div className="d-flex flex-row align-items-center justify-content-between">
                    <ConnectWalletButton></ConnectWalletButton>
                    <Menu />
                </div>
            </div> 
        </div> 
    );
}

export default Header;