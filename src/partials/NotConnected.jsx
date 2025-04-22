import { Alert } from "react-bootstrap";
import ConnectWalletButton from "../components/ConnectWalletButton";

function NotConnected() {
    return ( 
        <Alert key={"warning"} variant={"warning"} className="d-flex flex-column flex-lg-row gap-3 w-100 p-4 align-items-center justify-content-center">
            You need to connect wallet.
            <ConnectWalletButton></ConnectWalletButton>
        </Alert>
    );
}

export default NotConnected;


