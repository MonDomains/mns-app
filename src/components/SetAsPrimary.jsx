
import React, {Component} from 'react';
import spinner from '../assets/images/spinner.svg';
import { Modal, Spinner } from "react-bootstrap";
import { obscureAddress, obscureName } from "../helpers/String";
import reverRegistrarABI from '../abi/ReverseRegistrar.json'
import { toast } from 'react-toastify';
import { getEnsResolver, writeContract } from '@wagmi/core'
import { chainId, publicResolver, rainbowConfig, universalResolver } from '../config';
import { waitForTransactionReceipt } from '@wagmi/core'
import { Check, Check2Circle } from 'react-bootstrap-icons';
import { monadTestnet } from 'viem/chains';
import { namehash, normalize } from 'viem/ens'

class SetAsPrimary extends Component {

    constructor(props) {
  
        super(props);
  
        this.state = {
           domain: null,
           showModal: undefined,
           pending: false,
           completed: false
        };
 
    }
    
    handleClose = () =>{
        this.setState({ showModal: undefined });
    } 
 
    handleShow = (id) =>{
        this.setState({ showModal: id });
    } 

    async handleSetAsPrimary() {
        
        try {
 
            const mnsResolver = await getEnsResolver(rainbowConfig, {
                name: normalize(this.props.domain.name),
                universalResolverAddress: universalResolver, 
                chainId: monadTestnet.id
            });
            console.log(mnsResolver);
 
            this.setState({ pending: true, completed: false });
  
            const _hash = await writeContract(rainbowConfig, {
                abi: reverRegistrarABI,
                address: import.meta.env.VITE_APP_REVERSE_REGISTRAR,
                functionName: "setNameForAddr",
                args: [this.props.owner, this.props.owner, mnsResolver ?? publicResolver, this.props.domain.name],
                account: this.props.owner,
                chainId: chainId
            });

            toast.success("Your transaction has been sent.");

            const recepient = await waitForTransactionReceipt(rainbowConfig, {  hash: _hash });
 
            toast.success("Your transaction has been completed.");

            this.setState({ pending: false, completed: true });
            this.handleClose();
        } catch(e) {
            toast.error("An error occured.");
            console.log(e.message)
            this.setState({ pending: false, completed: false });
            this.handleClose();
        } 
    }
  
    componentDidMount () {     
       
    }

    componentDidUpdate(prevProps, prevState) { 
 
    }

    render() { 
        
        return (
            <>
            <button className="btn btn-lg btn-primary rounded-2 border-0" onClick={() => this.handleShow(this.props.domain.id)}> 
                Set as primary name
            </button>

            <Modal {...this.props} 
                show={this.state.showModal === this.props.domain.id} 
                onHide={() => this.handleClose()}  
                size="lg"
                dialogClassName="modal-90w"
                centered
                closeButton
            >
                <Modal.Header closeButton>
                <Modal.Title>Confirm Your Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="d-flex flex-column">
                    <ul className="d-flex flex-column justify-content-between list-unstyled gap-2">
                        <li className='fs-6 text-center text-primary'>
                            <Check2Circle size={98} />
                        </li>
                        <li className='text-center'>
                            Double check these details before confirming in your wallet.
                        </li>
                        <li>
                            <div className='border border-secondary-subtle p-4 rounded-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                <strong>Name: </strong>
                                <span className='fw-bold'>{obscureName(this.props.domain.name, 50)}</span>
                            </div>
                        </li> 
                        <li>
                            <div className='border border-secondary-subtle p-4 rounded-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                <strong>Action: </strong>
                                <span className='fw-bold'>Set the primary name for your address</span>
                            </div>
                        </li> 
                        <li>
                            <div className='border border-secondary-subtle p-4 rounded-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                <strong>Address: </strong>
                                <span className='fw-bold'>{obscureAddress(this.props.owner, 100)}</span>
                            </div>
                        </li>
                    </ul> 
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-default" onClick={() => this.handleClose() }>Cancel</button>
                    <button className="btn btn-lg btn-primary border-0" onClick={()=> this.handleSetAsPrimary()}>
                        {this.state.pending ? <><Spinner variant="light" size="sm" /> Waiting Transaction</>: <>Confirm</>} 
                    </button> 
                </Modal.Footer>
            </Modal>
            </>
            
        )
    }
  
}

export default SetAsPrimary;