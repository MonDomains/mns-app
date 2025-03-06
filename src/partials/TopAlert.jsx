import { Alert } from "react-bootstrap";


function TopAlert() {
  
    return ( 
        <Alert key={"warning"} variant={"warning"} className="text-center w-100 p-2 p-lg-1">
            This is a <b>TEST</b> version. You are using Mon Name Service on <b>Monad Testnet</b>. 
        </Alert>
     );
}

export default TopAlert;
