
import ConnectWalletButton from "../components/ConnectWalletButton"; 

import TopAlert from "./TopAlert";
import Menu from './Menu';
import Logo from "./Logo";

function Header() { 
    return ( 
        <>
        <TopAlert /> 
        <div className="container-fluid">
            <div className="d-flex flex-row gap-3">
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
        </div>
        </> 
    );
}

export default Header;