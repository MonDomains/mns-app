import { formatEther, parseEther } from "ethers";
import { rainbowConfig } from "../config";
import { getChainId, readContract, writeContract } from '@wagmi/core'
import { toast } from "react-toastify";
import React, {Component} from 'react';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { waitForTransactionReceipt } from '@wagmi/core'
import spinner from '../assets/images/spinner.svg';
import { Modal } from "react-bootstrap";
import { getExpires, obscureName } from "../helpers/String";
import { getBalance } from '@wagmi/core'
import { DashCircleFill, PlusCircleFill } from "react-bootstrap-icons";

class RenewModal extends Component {

    constructor(props) {
  
        super(props);
  
        this.state = {
           domain: null,
           duration: 1,
           isFetchingPrice: false,
           isFetchedPrice: true,
           price: 0,
           isRenewing: false,
           isRenewed: false,
           showModal: undefined,
           balance: 0,
           isGettingBalance: false
        };
 
    }

    handleClose = () =>{
        this.setState({ showModal: undefined });
    } 

    handleShow = (id) =>{
        this.setState({ showModal: id });
    } 
 
    async handleRenew () { 
        
        try {

            this.setState({ isRenewing: true, isRenewed: false });
  
            const _hash = await writeContract(rainbowConfig, {
                abi: monRegisterControllerABI,
                address: import.meta.env.VITE_APP_REGISTER_CONTROLLER,
                functionName: "renew",
                args: [ this.props.domain.labelName, this.getDuration() ],
                account: this.props.owner,
                value: this.state.price,
                chainId: getChainId(rainbowConfig)
            });

            toast.success("Your transaction has been sent.");

            const recepient = await waitForTransactionReceipt(rainbowConfig, {  hash: _hash });
 
            toast.success("Your transaction has been completed.");

            this.setState({ isRenewing: false, isRenewed: true, showModal: undefined });
 
        } catch(e) {
            toast.error("An error occured.");
            this.setState({ isRenewing: false, isRenewed: false });
        } 
    }

    handleDurationDown(e) {
        if(this.state.duration > 1 && !this.state.isCommitted) {
            this.setState({ duration: this.state.duration - 1 });
        }
    }

    handleDurationUp(e) {
        if(!this.state.isCommitted) {
            this.setState({ duration: this.state.duration + 1 });
        }       
    }

    getDuration() {
        return this.state.duration * 60 * 60 * 24 * 365;
    }

    async handlePrice() { 
        let _price = false; 

        try { 

            this.setState({ isFetchingPrice: true, isFetchedPrice: false });
           
            _price = await readContract(rainbowConfig, {
                abi: monRegisterControllerABI,
                address: import.meta.env.VITE_APP_REGISTER_CONTROLLER,
                functionName: 'rentPrice',
                args: [this.props.domain.labelName, this.getDuration()],
                account: this.props.owner,
                chainId: getChainId(rainbowConfig)
            });
            
            this.setState({ isFetchingPrice: false, isFetchedPrice: true, price: _price.base });

        } catch(e) { 
            this.setState({ isFetchingPrice: false, isFetchedPrice: false });
            toast.error("An error occured.");
            console.log(e.message)
        }
    }

    async handleBalance() { 
        try {

            this.setState({ isGettingBalance : true });

            const balance = await getBalance(rainbowConfig, {
                address: this.props.owner, 
                chainId: getChainId(rainbowConfig)
            });

            this.setState({ isGettingBalance : false, balance: balance.value });
        } catch(e) {
            this.setState({ isGettingBalance : false });
            toast.error("An error occured.");
        }
    }
 
    componentDidMount () {     
       
    }

    componentDidUpdate(prevProps, prevState) { 

        if(this.state.showModal != prevState.showModal) {
            this.handlePrice();
            this.handleBalance();
        }

        if(prevState.duration != this.state.duration ) {
            this.handlePrice();
            this.handleBalance();
        }
    }

    render() { 
        
        return (
            <>
            <button className="btn btn-lg btn-primary rounded-2 border-0" onClick={() => this.handleShow(this.props.domain.id)}> 
                Extend
            </button>

            <Modal {...this.props} 
                show={this.state.showModal === this.props.domain.id} 
                onHide={() => this.handleClose()}  
                size="lg"
                backdrop="static"
                dialogClassName="modal-90w"
                centered
            >
                <Modal.Header>
                <Modal.Title>Extend Your Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="d-flex flex-column">
                    <ul className="d-flex flex-column flex-lg-row justify-content-between list-unstyled gap-2 text-truncate">
                        <li>
                            <h4>{obscureName(this.props.domain.name, 30)}</h4>
                        </li>
                        <li>
                            <strong>Expires</strong> <span>{getExpires(this.props.domain.expiryDate)}</span>
                        </li>
                    </ul>
                    <div className="d-flex flex-column gap-4"> 
                         <div className="d-flex flex-row justify-content-between align-items-center fs-1 border border-1 border-light-subtle">
                            <button className="btn border-0" onClick={(e)=> this.handleDurationDown(e)}><DashCircleFill size={24} className="text-primary" /> </button>
                            <div><small>{this.state.duration} year </small></div>
                            <button className="btn border-0" onClick={(e)=> this.handleDurationUp(e)}> <PlusCircleFill size={24} className="text-primary" /> </button>
                        </div>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <h5>Estimated Total</h5>
                            <span className="fs-5">{this.state.isFetchedPrice ? formatEther( this.state.price.toString()) : "Fetching Price..." } {import.meta.env.VITE_APP_NATIVE_TOKEN}</span>
                        </div>
                    </div> 
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-default" onClick={() => this.handleClose() }>Cancel</button>
                    { this.isFetchingPrice || this.state.isGettingBalance ? 
                            <button className="btn btn-lg btn-primary  border-0">
                                <img width={25} src={spinner} /> Checking...
                            </button>
                            : 
                            <>
                                { this.state.balance < this.state.price ? 
                                    <button disabled="disabled" className="btn btn-lg btn-danger  border-0">
                                        Unsufficient Balance {this.state.balance}
                                    </button>
                                    :
                                    <button className="btn btn-lg btn-primary border-0" onClick={()=> this.handleRenew()}>
                                        {this.state.isRenewing ? <><img width={25} src={spinner} /> Waiting Transaction</>: <>Extend</>} 
                                    </button>
                                }
                            </>
                    }
                    
                </Modal.Footer>
            </Modal>
            </>
            
        )
    }
  
}

export default RenewModal;