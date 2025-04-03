
import React, {Component} from 'react';
import { Modal, Spinner } from "react-bootstrap";
import baseRegistrarImplementationABI from '../abi/BaseRegistrarImplementation.json'
import nameWrapperABI from '../abi/NameWrapper.json'
import { toast } from 'react-toastify';
import { writeContract } from '@wagmi/core'
import { chainId, rainbowConfig } from '../config';
import { waitForTransactionReceipt } from '@wagmi/core' 
import { getTokenId } from '../helpers/String';

class TransferOwnership extends Component {

    constructor(props) {
  
        super(props);
  
        this.state = {
           domain: null,
           showModal: undefined,
           pending: false,
           completed: false,
           newOwner: null
        };

        this.inputRef = React.createRef();
 
    }
    
    handleClose = () =>{
        this.setState({ showModal: undefined });
    } 
 
    handleShow = (id) =>{
        this.setState({ showModal: id });
    } 

    async handleTransfer() {
         
        try {
 
            this.setState({ pending: true, completed: false });
  
            console.log([ this.props.owner, this.inputRef.current.value.trim(), getTokenId(this.props.domain.labelName)])
            const _hash = await writeContract(rainbowConfig, {
                abi: baseRegistrarImplementationABI,
                address: import.meta.env.VITE_APP_BASE_REGISTRAR,
                functionName: "safeTransferFrom",
                args: [ this.props.owner, this.inputRef.current.value.trim(), getTokenId(this.props.domain.labelName)],
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

    async handleWrappedTransfer() {
         
        try {
 
            this.setState({ pending: true, completed: false });
  
            const _hash = await writeContract(rainbowConfig, {
                abi: nameWrapperABI,
                address: import.meta.env.VITE_APP_NAME_WRAPPER,
                functionName: "safeTransferFrom",
                args: [ this.props.owner, this.inputRef.current.value.trim(), BigInt(this.props.domain.id), 1, "0x"],
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
  
    render() {  
        return (
            <>
            <button className="btn btn-lg btn-primary rounded-2 border-0" onClick={() => this.handleShow(this.props.domain.id)}> 
                Transfer
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
                <Modal.Title>Transfer Ownership</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="d-flex flex-column gap-2">
                    <span className='fw-bold'>New Owner: </span>
                    <input ref={this.inputRef} className='form-control' placeholder='New owner address' />
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-default" onClick={() => this.handleClose() }>Cancel</button>
                    {this.props.domain.wrappedOwner === this.props.owner?.toLowerCase()}
                    <button className="btn btn-lg btn-primary border-0" onClick={()=> this.props.domain.wrappedOwner?.id === this.props.owner.toLowerCase() ? this.handleWrappedTransfer() : this.handleTransfer()}>
                        {this.state.pending ? <><Spinner variant="light" size="sm" /> Waiting Transaction</>: <>Confirm</>} 
                    </button> 
                </Modal.Footer>
            </Modal>
            </>
            
        )
    }
  
}

export default TransferOwnership;