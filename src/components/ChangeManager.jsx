
import React, {Component} from 'react';
import { Modal, Spinner } from "react-bootstrap";
import baseRegistrarABI from '../abi/BaseRegistrarImplementation.json'
import nameWrapperABI from '../abi/NameWrapper.json'
import { toast } from 'react-toastify';
import { writeContract } from '@wagmi/core'
import { baseRegistrar, chainId, rainbowConfig } from '../config';
import { waitForTransactionReceipt } from '@wagmi/core' 
import { getTokenId } from '../helpers/String';
import { isAddress, labelhash, namehash } from 'viem';
import { toBigInt } from 'ethers';
import * as Icons from "react-bootstrap-icons";
import monadIcon from '../assets/images/monad.svg';
import { Link } from 'react-router';

class ChangeManager extends Component {

    constructor(props) {
  
        super(props);
  
        this.state = {
           showModal: false,
           txPending: false,
           txCompleted: false,
           txError: null,
           txHash: null,
           txReceipt: null
        };

        this.inputRef = React.createRef();
    }
    
    handleClose = () =>{
        this.setState({ showModal: false });
    } 

    handleCloseFull = () => {
        this.inputRef.current.value = null;
        this.setState({ showModal: false, txError: null, txPending: false, txCompleted: false, txHash: null, txReceipt: null });
    }
 
    handleShow = () =>{
        this.setState({ showModal: true });
    } 

    async handleReclaim() {
         
        try {
 
            this.setState({ txPending: true, txCompleted: false, txError: null });
  
            if(!isAddress(this.inputRef.current.value.trim()))
                            throw new Error("Provided adress is not a valid address format.");

            const _hash = await writeContract(rainbowConfig, {
                abi: baseRegistrarABI,
                address: baseRegistrar,
                functionName: "reclaim",
                args: [ toBigInt(labelhash(this.props.labelName)), this.inputRef.current.value.trim()],
                account: this.props.address,
                chainId: chainId
            });

            this.setState({ txHash: _hash });

            const recepient = await waitForTransactionReceipt(rainbowConfig, {  hash: _hash });
 

            this.setState({ txPending: false, txCompleted: true, txError: null, txReceipt: recepient });
        } catch(e) {
            
            console.log(e.message)
            this.setState({ txPending: false, txCompleted: false, txError: e.message, txHash: null, txReceipt: null });
        } 
    }

     
    render() {  
        return (
            <>
            {(!this.props.isWrapped && this.props.isOwner) ? 
            <button onClick={() => this.handleShow()}
             className='btn bg-primary-subtle border border-primary-subtle fw-bold text-primary' > 
                <Icons.PersonFill className='mb-1'  /> Change Manager
            </button>
            : <></>
            }
 
            <Modal {...this.props} 
                show={this.state.showModal} 
                onHide={() => this.handleClose()}  
                size="lg"
                dialogClassName="modal-90w"
                centered
            >
                <Modal.Header>
                <Modal.Title>
                {this.state.txHash == null 
                    && this.state.txReceipt == null 
                    && !this.state.txPending  
                    ? 
                    <>Change Manager</>: <></>} 
                {this.state.txPending && this.state.txHash == null ? "Waiting...": ""}
                {this.state.txPending && this.state.txHash != null ? "Waiting For Transaction...": ""}
                {!this.state.txPending && this.state.txReceipt ? "Transaction Complete": ""}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                { this.state.txError != null ?  
                    <div className="alert alert-danger text-break">{this.state.txError}</div>
                    : <></>
                }
                {this.state.txPending && this.state.txHash != null ? 
                    <div className='alert alert-info'>
                        <p className='text-center'>
                            <Spinner className='lg' />
                        </p>
                        <p className='text-center'>
                            Waiting for transaction...
                        </p>
                    </div>: <></>
                }
                {this.state.txReceipt ? 
                    <div className='alert alert-success'>
                        <p className='text-center'>
                            <Icons.CheckLg size={72} className='text-success' />
                        </p>
                        <p className='text-center'>
                            Your transaction is now complete!
                        </p>
                    </div>: <></>
                }
                
                <div className='d-flex flex-column'>
                    <ul className='d-flex flex-column justify-content-between list-unstyled gap-2'>
                        {this.state.txHash ?
                            <li className='border rounded-3 p-3 mt-2 d-flex flex-column justify-content-between align-item-center'>
                                <Link to={import.meta.env.VITE_APP_SCAN_URL +"/tx/"+ this.state.txHash } target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                    <Icons.BoxArrowUpRight />
                                    <span className='ms-2'>View your transaction</span>
                                </Link>
                            </li>: <></>
                        }
                        <li className='bg-body-tertiary border rounded-3 p-3 mt-2 d-flex flex-column gap-2 justify-content-between align-item-center'>
                            <b>New manager address</b>
                            <div className='input-group'>
                                <span className='input-group-text'>
                                    <img src={monadIcon} width={18} />
                                </span>
                                <input ref={this.inputRef} type='text' className='form-control form-control-lg' placeholder='MNS name or address'  />
                            </div>
                        </li>
                    </ul>
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex flex-column flex-lg-row align-items-center justify-content-between p-2 w-100 gap-2'>
                        { this.state.txHash == null  ? 
                            <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.handleClose()}>
                                Cancel
                            </button> : <></>
                        }
                        { this.state.txHash != null && this.state.txReceipt == null  ? 
                            <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.handleClose()}>
                                Close
                            </button>: <></>
                        } 
                        { this.state.txReceipt != null  ? 
                            <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.handleCloseFull()}>
                                Done
                            </button>: <></>
                        } 
                        { this.state.txHash == null  ?
                            <button disabled={this.state.txPending} className="btn btn-lg btn-primary border-0 w-100" onClick={()=> this.handleReclaim() }>
                                {this.state.txPending ? <><Spinner variant="light" size="sm" /> Waiting Transaction</>: <>Open Wallet</>} 
                            </button>: <></>
                        }
                    </div> 
                </Modal.Footer>
            </Modal>
            </>
        )
    }
  
}

export default ChangeManager;