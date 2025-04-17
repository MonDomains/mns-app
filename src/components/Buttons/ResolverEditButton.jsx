import React, { Component} from 'react';
import { monadTestnet } from "viem/chains";
import { explorerUrl, mnsRegistry, publicResolver, rainbowConfig } from "../../config";
import mnsRegistryABI from "../../abi/Registry.json";
import { Form, Modal, Spinner } from 'react-bootstrap';
import { isAddress, namehash, zeroAddress } from 'viem';
import { Link } from 'react-router';
import * as Icons from "react-bootstrap-icons";
import { normalize } from 'viem/ens';
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'

class ResolverEditButton extends Component {

    constructor(props) {

        super(props);
 
        this.state = { 
           showModal: false,
           txPending: false,
           txCompleted: false,
           txReceipt: null,
           txHash: null,
           txError: null,
           resolverAddress: publicResolver,
           step: 1,
           useLatestResolver: true
        }; 

    } 
 
    handleClose = () =>{
        this.setState({ 
            showModal: false,
            resolverAddress: this.props.resolverAddress
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
            resolverAddress: publicResolver
        });
    } 
 
    handleShow = (id) =>{
        this.setState({ showModal: true });
    } 

    async handleEditResolver() {
        
        try {
            
            if(!isAddress(this.state.resolverAddress))
                throw new Error("Provided resolver adress is not a valid address format.")
 
            this.setState({ txError: null, txHash: null, txReceipt: null, txPending: true, txCompleted: false });
  
            const txHash = await writeContract(rainbowConfig, {
                abi: mnsRegistryABI,
                address: mnsRegistry,
                functionName: "setResolver",
                args: [namehash(normalize(this.props.name)), this.state.resolverAddress],
                account: this.props.address,
                chainId: monadTestnet.id
            });

            this.setState({ txHash });

            const txReceipt = await waitForTransactionReceipt(rainbowConfig, {  hash: txHash });

            this.setState({ txPending: false, txCompleted: true, txError: null, txReceipt });

        } catch(e) {
            console.log(e)
            this.setState({ txPending: false, txCompleted: false, txHash: null, txReceipt: null, txError: e.message });
        } 
    }

    handleUseLatestResolver () {
        this.setState({ 
            useLatestResolver: !this.state.useLatestResolver, 
            resolverAddress: this.state.useLatestResolver ? publicResolver: "" 
        });
    }

    handleResolverChange(e) {
        this.setState({ resolverAddress: e.target.value, txError: null });
    }
 
    componentDidMount () {     
       
    }

    componentDidUpdate(prevProps, prevState) { 
        if(prevState.useLatestResolver != this.state.useLatestResolver && this.state.useLatestResolver) {
            this.setState({ resolverAddress: publicResolver, txError: null });
        }

        if(prevState.useLatestResolver != this.state.useLatestResolver && !this.state.useLatestResolver) {
            this.setState({ resolverAddress: "", txError: null });
        } 
    }

    render() {
        return (   
            <>
            <button className='btn bg-primary-subtle text-primary-emphasis fw-bold' 
                onClick={(e)=> this.handleShow()}
                {...this.props}>
                Edit
            </button>

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
                            <>
                            {this.state.txHash == null 
                                && this.state.txReceipt == null 
                                && !this.state.txPending  
                                ? 
                                <>Edit Resolver</>: <></>} 
                            {this.state.txPending && this.state.txHash == null ? "Waiting...": ""}
                            {this.state.txPending && this.state.txHash != null ? "Waiting For Transaction...": ""}
                            {!this.state.txPending && this.state.txReceipt ? "Transaction Complete": ""}
                            </> : <></>
                        }
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { this.state.txError != null ?  
                            <div className="alert alert-danger text-break">{this.state.txError}</div>
                            : <></>
                        } 
                        {this.state.txPending && this.state.txHash != null ? 
                            <div className='alert alert-info'>
                                <Spinner className='lg' />
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
                            <div className='border rounded-3 p-3 mt-2 d-flex flex-column justify-content-between align-item-center'>
                                <Link to={import.meta.env.VITE_APP_SCAN_URL +"/tx/"+ this.state.txHash } target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                    <Icons.BoxArrowUpRight />
                                    <span className='ms-2'>View your transaction</span>
                                </Link>
                            </div>: <></>
                        }
                        <div className='d-flex flex-column'>
                            <ul className='d-flex flex-column justify-content-between list-unstyled gap-2'>
                                <li className='bg-body-tertiary border rounded-3 p-3 mt-2 d-flex flex-row gap-2 justify-content-between align-item-center'>
                                    <div className='d-flex flex-wrap gap-2'>
                                        <Form.Check
                                            type="switch"
                                            defaultChecked={this.state.useLatestResolver}
                                            className="form-switch-lg"
                                            onChange={(e)=> this.handleUseLatestResolver(e)}
                                        />
                                        <span>Use latest Resolver </span>
                                        <Link target='_blank' className='text-decoration-none' to={explorerUrl +"/address/"+ publicResolver}>
                                            <Icons.BoxArrowUpRight />
                                        </Link>
                                    </div> 
                                </li>
                                { !this.state.useLatestResolver ?
                                    <li  className='bg-body-tertiary border rounded-3 p-3 mt-2 d-flex flex-column gap-2 justify-content-between align-item-center'>
                                        <b>Custom Resolver</b>
                                        <div className='input-group'>
                                            <input disabled={this.state.useLatestResolver} value={this.state.resolverAddress != zeroAddress ? this.state.resolverAddress: ""} type='text' className='form-control form-control-lg' placeholder='Enter on Monad address' onChange={(e)=> this.handleResolverChange(e)} />
                                        </div>
                                    </li>: <></>
                                }
                                
                            </ul>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <div className='d-flex flex-row align-items-center justify-content-between p-2 w-100 gap-2'>
                    { this.state.step == 1 && this.state.txHash == null  ? 
                        <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.handleCloseFull()}>
                            Cancel
                        </button> : <></>
                    } 
                    { this.state.step == 1 && this.state.txHash != null  ? 
                        <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.handleCloseFull()}>
                            {this.state.txPending ? "Close": "Done"}
                        </button>: <></>
                    } 
                    { this.state.step == 1 &&  this.state.txHash == null  ?
                        <button disabled={this.state.txPending} className="btn btn-lg btn-primary border-0 w-100" onClick={()=> this.handleEditResolver()}>
                            {this.state.txPending ? <><Spinner variant="light" size="sm" /></>: <>Open Wallet</>} 
                        </button>: <></>
                    }
                    </div>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default ResolverEditButton;
