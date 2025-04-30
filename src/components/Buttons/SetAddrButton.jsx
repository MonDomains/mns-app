
import React, {createRef, Component} from 'react';
import { Modal, Spinner } from "react-bootstrap";
import { obscureAddress, obscureName } from "../../helpers/String";
import publicResolverABI from '../../abi/PublicResolver.json'
import { toast } from 'react-toastify';
import { getEnsName, getEnsResolver, writeContract } from '@wagmi/core'
import { chainId, publicResolver, rainbowConfig, universalResolver } from '../../config';
import { waitForTransactionReceipt } from '@wagmi/core'
import { monadTestnet } from 'viem/chains';
import { namehash, normalize } from 'viem/ens'
import { Link } from 'react-router';
import * as Icons from "react-bootstrap-icons";
import monadIcon from '../../assets/images/monad.svg';
import { isAddress, zeroAddress } from 'viem';

class SetAddrButton extends Component {

    constructor(props) {

        super(props);
 
        this.state = { 
           showModal: false,
           txPending: false,
           txCompleted: false,
           txReceipt: null,
           txHash: null,
           txError: null,
           mnsAddress: this.props.mnsAddress,
           step: 1,
        }; 

    }

    nextStep() {
        this.setState({ txError: null, step: this.state.step+1 })
    }

    prevStep() {
        this.setState({ txError: null, step: this.state.step-1 })
    }
 
    handleClose = () =>{
        this.setState({ 
            showModal: false,
            mnsAddress: this.props.mnsAddress
        });
    } 

    handleCloseFull = () =>{
        this.setState({ 
            showModal: false, 
            txError: null, 
            txPending: false, 
            txCompleted: false, 
            txHash: null, 
            txReceipt: null, 
            mnsName: null,
            mnsAddress: this.props.mnsAddress
        });
    } 
 
    handleShow = (id) =>{
        this.setState({ showModal: true });
    } 

    async handleSetAsPrimary() {
        
        try {
            
            if(!isAddress(this.state.mnsAddress))
                throw new Error("Provided adress is not a valid address format.")

            const mnsResolver = await getEnsResolver(rainbowConfig, {
                name: normalize(this.props.name),
                universalResolverAddress: universalResolver, 
                chainId: monadTestnet.id
            }); 
             
            this.setState({ txError: null, txHash: null, txReceipt: null, txPending: true, txCompleted: false });

            const txHash = await writeContract(rainbowConfig, {
                abi: publicResolverABI,
                address: mnsResolver ?? publicResolver,
                functionName: "setAddr",
                args: [namehash(normalize(this.props.name)), 60, this.state.mnsAddress],
                account: this.props.address,
                chainId: monadTestnet.id
            });

            this.setState({ txHash });

            const txReceipt = await waitForTransactionReceipt(rainbowConfig, {  hash: txHash });

            this.setState({ txPending: false, txCompleted: true, txError: null, txReceipt });

        } catch(e) {
            this.setState({ txPending: false, txCompleted: false, txHash: null, txReceipt: null, txError: e.message });
        } 
    }
 
    componentDidMount () {     
       
    }

    componentDidUpdate(prevProps, prevState) { 
        if(prevProps != this.props) {
             
        } 
    }

    render() {  
        return (
            <>
            {(this.props.isWrapped && this.props.isOwner) || (!this.props.isWrapped && this.props.isManager) ? 
            <button className="btn text-primary-emphasis fw-bold rounded-2" onClick={() => this.handleShow()}> 
                Change
            </button>
            :<></>
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
                    {this.state.step == 1 ? 
                        <>Set A record for the name </> : <></>
                    }
                    {this.state.step == 2 ? 
                        <>
                        {this.state.txHash == null 
                            && this.state.txReceipt == null 
                            && !this.state.txPending  
                            ? 
                            <>Confirm Details</>: <></>} 
                        {this.state.txPending && this.state.txHash == null ? "Waiting...": ""}
                        {this.state.txPending && this.state.txHash != null ? "Waiting For Transaction...": ""}
                        {!this.state.txPending && this.state.txReceipt ? "Transaction Complete": ""}
                        </> : <></>
                    }
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                {this.state.step == 1 ? 
                    <div className='d-flex flex-column'>
                        <ul className='d-flex flex-column justify-content-between list-unstyled gap-2'>
                            <li className='bg-body-tertiary border rounded-3 p-3 mt-2 d-flex flex-column gap-2 justify-content-between align-item-center'>
                                <b>mon address</b>
                                <div className='input-group'>
                                    <span className='input-group-text'>
                                        <img src={monadIcon} width={18} />
                                    </span>
                                    <input value={this.state.mnsAddress != zeroAddress ? this.state.mnsAddress: ""} type='text' className='form-control form-control-lg' placeholder='0x...' onChange={(e)=> this.setState({ mnsAddress: e.target.value })} />
                                </div>
                            </li>
                        </ul>
                    </div>
                : <></>}
                {this.state.step == 2 ?
                    <div className="d-flex flex-column gap-2"> 
                        <div className='fs-6 text-center text-primary'>
                                <Icons.Check2Circle size={98} />
                        </div>
                        <div className='text-center'>
                            Double check these details before confirming in your wallet.
                        </div>
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
                        {this.state.txHash ?
                            <li className='border rounded-3 p-3 mt-2 d-flex flex-column justify-content-between align-item-center'>
                                <Link to={import.meta.env.VITE_APP_SCAN_URL +"/tx/"+ this.state.txHash } target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                    <Icons.BoxArrowUpRight />
                                    <span className='ms-2'>View on Explorer</span>
                                </Link>
                            </li>: <></>
                        }
                        <ul className="d-flex flex-column justify-content-between list-unstyled gap-2"> 
                            
                            <li>
                                <div className='border rounded-3 p-3 mt-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                    <strong>Name: </strong>
                                    <span className='fw-bold text-break'>{obscureName(this.props.name, 50)}</span>
                                </div>
                            </li> 
                            <li>
                                <div className='border rounded-3 p-3 mt-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                    <strong>Action: </strong>
                                    <span className='fw-bold'>Set A record for the name</span>
                                </div>
                            </li> 
                            <li>
                                <div className='border rounded-3 p-3 mt-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                    <strong>Address: </strong>
                                    <span className='fw-bold text-break'>{this.state.mnsAddress}</span>
                                </div>
                            </li> 
                        </ul> 
                         
                    </div>
                : <></> }
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex flex-row align-items-center justify-content-between p-2 w-100 gap-2'>
                    { this.state.step == 1 && this.state.txHash == null  ? 
                        <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.handleCloseFull()}>
                            Cancel
                        </button> : <></>
                    }
                    { this.state.step == 2 && this.state.txHash == null  ? 
                        <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.prevStep()}>
                            Back
                        </button>: <></>
                    }
                    { this.state.step == 1 && this.state.txHash == null  ? 
                        <button className='btn btn-primary btn-lg w-100' onClick={() => this.nextStep()}>
                            Next
                        </button>: <></>
                    }
                    { this.state.step == 2 && this.state.txHash != null  ? 
                        <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.handleCloseFull()}>
                            {this.state.txPending ? "Close": "Done"}
                        </button>: <></>
                    } 
                    { this.state.step == 2 &&  this.state.txHash == null  ?
                        <button disabled={this.state.txPending} className="btn btn-lg btn-primary border-0 w-100" onClick={()=> this.handleSetAsPrimary()}>
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

export default SetAddrButton;