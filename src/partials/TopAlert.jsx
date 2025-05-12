import { Alert, Button } from "react-bootstrap";
import { monadTestnet } from "viem/chains";
import { useSwitchChain } from "wagmi"; 
import { useAccount } from "wagmi";
 
function TopAlert() {  
    const { chainId, isConnected } = useAccount();
    const { switchChain } = useSwitchChain();
    
    return ( 
        <>
            { chainId == monadTestnet.id  ?  
                <div className="container-fluid m-0 p-0">
                    <Alert key={"warning"} variant={"warning"} className="text-center w-100 p-2 p-lg-1 border-top-0 border-end-0 border-start-0 rounded-0 mb-2">
                        This is a <b>TEST</b> version. You are using Mon Name Service on <b>Monad Testnet</b>. 
                    </Alert>
                </div>
                : <></>
            }

            { isConnected && chainId !== monadTestnet.id ?
                <div key={"chain_"+ monadTestnet.id} className="container-fluid m-0 p-0">
                    <Alert key={"danger"} variant={"danger"} className="text-center w-100 p-2 p-lg-1 border-top-0 border-end-0 border-start-0 rounded-0 mb-2 d-flex flex-row gap-1 align-items-center justify-content-center">
                        Wrong network.
                        <a href="#" className="text-danger-emphasis" key={monadTestnet.id} onClick={() => switchChain({ chainId: monadTestnet.id })}>
                            Click here
                        </a> to switch Monad.
                    </Alert>
                </div> : <></> 
            }
        </>
    );
}

export default TopAlert;
