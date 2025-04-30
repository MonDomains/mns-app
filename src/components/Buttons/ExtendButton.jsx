import React, {createRef, Component} from 'react';
import { Modal, Spinner } from "react-bootstrap";
import { obscureAddress, obscureName } from "../../helpers/String";
import publicResolverABI from '../../abi/PublicResolver.json'
import { toast } from 'react-toastify';
import { getBalance, getEnsName, getEnsResolver, readContract, writeContract } from '@wagmi/core'
import { chainId, publicResolver, rainbowConfig, registrarController, universalResolver } from '../../config';
import { waitForTransactionReceipt } from '@wagmi/core'
import { monadTestnet } from 'viem/chains';
import { namehash, normalize } from 'viem/ens'
import { Link } from 'react-router';
import * as Icons from "react-bootstrap-icons";
import monadIcon from '../../assets/images/monad.svg';
import { formatEther, isAddress, zeroAddress } from 'viem';
import registerControllerABI from '../../abi/MONRegisterController.json'
import moment from 'moment';
import GasInfoBox from './GasInfoBox';

class ExtendButton extends Component {

    constructor(props) {

        super(props);
 
        this.state = this.getDefaultState(); 

    }

    getDefaultState() {
        return { 
            showModal: false,
            txPending: false,
            txCompleted: false,
            txReceipt: null,
            txHash: null,
            txError: null, 
            step: 1,
            duration: 1,
            price: 0,
            balance: 0,
            isGettingBalance: false,
            isFetchingPrice: false,
            total: 0,
            editDurationMode: false
        }
    }

    nextStep() {
        this.setState({ txError: null, step: this.state.step+1 })
    }

    prevStep() {
        this.setState({ txError: null, step: this.state.step-1 })
    }
 
    handleClose = () =>{
        this.setState({
            showModal: false
        });
    } 

    handleCloseFull = () =>{
        this.setState(this.getDefaultState());
    } 
 
    handleShow = (id) =>{
        this.setState({ showModal: true });
    } 

    handleDurationDown(e) {
        if(this.state.duration > 1) {
            this.setState({ duration: this.state.duration - 1 });
        }
    }

    handleDurationUp(e) {
        this.setState({ duration: this.state.duration + 1 });
    }

    getDuration() {
        return this.state.duration * 60 * 60 * 24 * 365;
    }

    async handlePrice() {  
        try {
            this.setState({ txError: null, isFetchingPrice: true }); 
            const totalPrice = await readContract(rainbowConfig, {
                abi: registerControllerABI,
                address: registrarController,
                functionName: 'rentPrice',
                args: [this.props.labelName, this.getDuration()],
                chainId: monadTestnet.id
            }); 
            this.setState({ isFetchingPrice: false, total: totalPrice.base });
        } catch(e) {
            this.setState({ isFetchingPrice: false, txError: e.message });
        }
    }
 
    async handleBalance() {
        try { 
            this.setState({ txError: null, isFetchingBalance : true });
            const balance = await getBalance(rainbowConfig, {
                address: this.props.address, 
            });   
            if(balance.value < this.state.total) 
                throw new Error("The total cost of executing this transaction exceeds the balance of the account.");
            this.setState({ isFetchingBalance : false, balance: balance.value });
        } catch(e) { 
            this.setState({ isFetchingBalance : false, balance: 0, txError: e.message });
        }
    }

    async handleExtend() { 
        try {
              
            this.setState({ txError: null, txHash: null, txReceipt: null, txPending: true, txCompleted: false });

            const txHash = await writeContract(rainbowConfig, {
                abi: registerControllerABI,
                address: registrarController,
                functionName: "renew",
                args: [ this.props.labelName, this.getDuration() ],
                account: this.props.address,
                value: this.state.total,
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
       this.handlePrice();
       this.handleBalance();
    }

    componentDidUpdate(prevProps, prevState) { 
       
        if(prevState.step != this.state.step && this.state.step == 1) {
            this.handlePrice();
        }

        if(prevState.duration != this.state.duration && this.state.step == 1) {
            this.handlePrice();
        }

        if(prevProps.name != this.props.name) {
            this.handlePrice();
            this.handleBalance();
        }

        if(prevState.step != this.state.step && this.state.step == 2) {
            this.handleBalance();
        }
    }

    render() {  
        return (
            <>
            
            {this.props.isOwner == true ? 
                <button onClick={(e)=> this.handleShow()}
                    className='btn bg-primary-subtle border border-primary-subtle fw-bold text-primary' 
                >
                    <Icons.FastForwardFill className='mb-1'  /> Extend
                </button>
            : <></>}

            <Modal {...this.props} 
                show={this.state.showModal} 
                onHide={() => this.handleClose()}  
                size="lg" 
                dialogClassName="modal-90w"
                centered
            >
                <Modal.Header>
                <Modal.Title className='text-break'>
                    {this.state.step == 1 ? 
                        <>Extend {this.props.name} </> : <></>
                    }
                    {this.state.step == 2 ? 
                        <>
                        {this.state.txHash == null 
                            && this.state.txReceipt == null 
                            && !this.state.txPending  
                            ? 
                            <>Confirm Extend Details</>: <></>} 
                        {this.state.txPending && this.state.txHash == null ? "Waiting...": ""}
                        {this.state.txPending && this.state.txHash != null ? "Waiting For Transaction...": ""}
                        {!this.state.txPending && this.state.txReceipt ? "Transaction Complete": ""}
                        </> : <></>
                    }
                </Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    {this.state.step == 1 ? 
                        <div className='d-flex flex-column gap-3'>
                            <div className="d-flex flex-row justify-content-between align-items-center fs-1 border bg-body-tertiary border border-light-subtle rounded-2">
                                <button className="btn btn-lg" onClick={(e)=> this.handleDurationDown(e)}>
                                    <Icons.DashCircleFill size={48} className={this.state.duration > 1 ? 'text-primary': 'text-secondary'} />
                                </button>
                                <small className='fs-5' onClick={(e)=> this.setState({ editDurationMode: true })}>{this.state.duration} year(s) </small>
                                <button className="btn btn-lg" onClick={(e)=> this.handleDurationUp(e)}>
                                    <Icons.PlusCircleFill size={48} className='text-primary' />
                                </button>
                            </div>
                            <div className='d-flex flex-row align-items-center justify-content-between p-2'>
                                <div className='flex-fill text-muted fw-bold'>
                                    <GasInfoBox />
                                </div>
                                <div className='rounded-3 bg-primary p-2 text-white'>
                                    {import.meta.env.VITE_APP_NATIVE_TOKEN}
                                </div>
                            </div>
                            <div className='bg-body-tertiary border border-light-subtle rounded-2 p-3'>
                                <ul className='list-unstyled d-flex flex-column gap-2'>
                                    <li className='d-flex flex-column flex-md-row justify-content-between fw-bold'>
                                        <span className='text-muted'>
                                            <b>Estimated Total</b>
                                        </span>
                                        <span>
                                            {this.state.isFetchingPrice}
                                            {
                                                this.state.isFetchingPrice  ? 
                                                <Spinner variant='primary' size='sm' /> : 
                                                <>  <span>{formatEther(this.state.total)} {import.meta.env.VITE_APP_NATIVE_TOKEN}</span> </>
                                            }
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    : <></>}

                    {this.state.step == 2 ?
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <ul className='list-unstyled w-100'>
                                {this.state.txHash == null ? 
                                <li>
                                    <p className='text-center'>
                                        <Icons.Wallet size={72} className='text-primary' />
                                    </p>
                                    <p className='text-center'>
                                        <b>Double check these details before confirming in your wallet.</b>
                                    </p>
                                </li>:   <>  </>
                                }
                                {this.state.txPending ? 
                                    <li className='alert alert-info'>
                                        <p className='text-center'>
                                            <Spinner className='lg' />
                                        </p>
                                        <p className='text-center'>
                                            Waiting for transaction...
                                        </p>
                                    </li>: <></>
                                }
                                {this.state.txReceipt ? 
                                    <li className='alert alert-success'>
                                        <p className='text-center'>
                                            <Icons.CheckLg size={72} className='text-success' />
                                        </p>
                                        <p className='text-center'>
                                            Your transaction is now complete!
                                        </p>
                                    </li>: <></>
                                }
                                {this.state.txHash ?
                                    <li className='border rounded-3 p-3  mt-2 d-flex flex-row justify-content-between'>
                                        <Link to={import.meta.env.VITE_APP_SCAN_URL +"/tx/"+ this.state.txHash } target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                            <Icons.BoxArrowUpRight />
                                            <span className='ms-2'>View on Explorer</span>
                                        </Link>
                                    </li>: <></>
                                }
                                <li className='bg-body-tertiary border border-light-subtle rounded-2 p-3 p-3 mt-2 d-flex flex-row justify-content-between'>
                                    <span className=''>Name</span>
                                    <span className='fw-bold'>{this.props.name}</span>
                                </li>
                                <li className='bg-body-tertiary border border-light-subtle rounded-2 p-3 p-3 mt-2 d-flex flex-row justify-content-between'>
                                    <span className=''>Action</span>
                                    <span className='fw-bold'>Extend Registration</span>
                                </li>
                                <li className='bg-body-tertiary border border-light-subtle rounded-2 p-3 p-3  mt-2 d-flex flex-row justify-content-between'>
                                    <span className=''>Duration</span>
                                    <span className='fw-bold d-flex flex-column align-items-end gap-2'>
                                        <span>{this.state.duration} year(s)</span>
                                        <small className='text-muted'>New expiry: {moment().utc().add(this.state.duration, "year").format("ll")} </small>
                                    </span>
                                </li>
                                <li className='bg-body-tertiary border border-light-subtle rounded-2 p-3 p-3  mt-2 d-flex flex-column flex-md-row justify-content-between'>
                                    <span className=''>Cost</span>
                                    <span className='fw-bold'>{formatEther(this.state.total)} {import.meta.env.VITE_APP_NATIVE_TOKEN} + fees</span>
                                </li>
                            </ul>  
                        </div> 
                    : <></> }

                    { 
                        this.state.txError != null ?  
                            <div className="alert alert-danger mt-3 text-break">{this.state.txError}</div>:  
                        <></>
                    }
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
                    { this.state.step == 2 && this.state.txHash == null  ?
                        <button className={'btn btn-lg w-100 btn-primary'} disabled={this.state.txPending || this.state.isFetchingBalance || (this.state.balance < this.state.total)} onClick={(e)=> this.handleExtend()}>
                            {this.state.txPending || this.state.isFetchingBalance ? <><Spinner size='sm' /></>: ""}
                            {!this.state.isFetchingBalance && this.state.balance < this.state.total ? "Unsufficient Balance": ""}
                            {!this.state.txPending && !this.state.isFetchingBalance && this.state.balance >= this.state.total ? "Extend": ""}
                        </button>
                        : <></> 
                    } 
                    </div>
                </Modal.Footer>
            </Modal>
            </>
            
        )
    }
  
}

export default ExtendButton;