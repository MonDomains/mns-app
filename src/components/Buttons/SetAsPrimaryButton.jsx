
import React, {Component} from 'react';
import { Modal, Spinner } from "react-bootstrap";
import { obscureAddress, obscureName } from "../../helpers/String";
import reverRegistrarABI from '../../abi/ReverseRegistrar.json'
import { toast } from 'react-toastify';
import { getEnsName, getEnsResolver, writeContract } from '@wagmi/core'
import { chainId, publicResolver, rainbowConfig, reverseRegistrar, universalResolver } from '../../config';
import { waitForTransactionReceipt } from '@wagmi/core'
import { monadTestnet } from 'viem/chains';
import { namehash, normalize } from 'viem/ens'
import { Link } from 'react-router';
import * as Icons from "react-bootstrap-icons";

class SetAsPrimaryButton extends Component {

    constructor(props) {
  
        super(props);
  
        this.state = { 
           showModal: false,
           txPending: false,
           txCompleted: false,
           txReceipt: null,
           txHash: null,
           txError: null,
           mnsName: null
        };
 
    }
 
    handleClose = () =>{
        this.setState({ showModal: false });
    } 

    handleCloseFull = () =>{
        this.setState({ showModal: false, txError: null, txPending: false, txCompleted: false, txHash: null, txReceipt: null, mnsName: null });
    } 
 
    handleShow = (id) =>{
        this.setState({ showModal: true });
    } 

    async handleSetAsPrimary() {
        
        try {
 
            const mnsResolver = await getEnsResolver(rainbowConfig, {
                name: normalize(this.props.name),
                universalResolverAddress: universalResolver, 
                chainId: monadTestnet.id
            });  

            this.setState({ txError: null, txHash: null, txReceipt: null, txPending: true, txCompleted: false });

            const txHash = await writeContract(rainbowConfig, {
                abi: reverRegistrarABI,
                address: reverseRegistrar,
                functionName: "setName",
                args: [normalize(this.props.name)],
                account: this.props.address,
                chainId: chainId
            });

            this.setState({ txHash });

            const txReceipt = await waitForTransactionReceipt(rainbowConfig, {  hash: txHash });

            this.setState({ txPending: false, txCompleted: true, txError: null, txReceipt });

        } catch(e) {
            this.setState({ txPending: false, txCompleted: false, txHash: null, txReceipt: null, txError: e.message });
        } 
    }

    async handleNameQuery() {
        const mnsName = await getEnsName(rainbowConfig, {
            address: this.props.address,
            universalResolverAddress: universalResolver,
            chainId: monadTestnet.id
        });
        this.setState({ mnsName })
    }
  
    componentDidMount () {     
       this.handleNameQuery();
    }

    componentDidUpdate(prevProps, prevState) { 
        if(prevProps != this.props) {
            this.handleNameQuery();
        }
    }

    render() { 
        if(this.state.mnsName == this.props.name) 
            return (<></>);

        return (
            <>
            <button className="btn bg-primary-subtle border-primary-subtle text-primary fw-bold rounded-2" onClick={() => this.handleShow()}> 
                <Icons.PersonPlusFill className='mb-1'  />  Set as primary name
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
                    {this.state.txHash == null 
                        && this.state.txReceipt == null 
                        && !this.state.txPending  
                        ? 
                        <>Confirm Details</>: <></>} 
                    {this.state.txPending && this.state.txHash == null ? "Waiting...": ""}
                    {this.state.txPending && this.state.txHash != null ? "Waiting For Transaction...": ""}
                    {!this.state.txPending && this.state.txReceipt ? "Transaction Complete": ""}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column"> 
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
                        <ul className="d-flex flex-column justify-content-between list-unstyled gap-2">
                            <li className='fs-6 text-center text-primary'>
                                <Icons.Check2Circle size={98} />
                            </li>
                            <li className='text-center'>
                                Double check these details before confirming in your wallet.
                            </li>
                            {this.state.txHash ?
                                <li className='border rounded-3 p-3 mt-2 d-flex flex-column justify-content-between align-item-center'>
                                    <Link to={import.meta.env.VITE_APP_SCAN_URL +"/tx/"+ this.state.txHash } target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                        <Icons.BoxArrowUpRight />
                                        <span className='ms-2'>View your transaction</span>
                                    </Link>
                                </li>: <></>
                            }
                            <li>
                                <div className='border rounded-3 p-3 mt-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                    <strong>Name: </strong>
                                    <span className='fw-bold'>{obscureName(this.props.name, 50)}</span>
                                </div>
                            </li> 
                            <li>
                                <div className='border rounded-3 p-3 mt-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                    <strong>Action: </strong>
                                    <span className='fw-bold'>Set the primary name for your address</span>
                                </div>
                            </li> 
                            <li>
                                <div className='border rounded-3 p-3 mt-2 d-flex flex-column flex-lg-row justify-content-between align-item-center'>
                                    <strong>Address: </strong>
                                    <span className='fw-bold'>{obscureAddress(this.props.address, 100)}</span>
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
                    { this.state.txHash != null  ? 
                        <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.handleCloseFull()}>
                            {this.state.txPending ? "Close": "Done"}
                        </button>: <></>
                    }

                    { this.state.txHash == null  ?
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

export default SetAsPrimaryButton;