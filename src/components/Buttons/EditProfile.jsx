import React, {Component} from 'react';
import { monadTestnet } from "viem/chains";
import { apolloClient, publicResolver, rainbowConfig, scanUrl, universalResolver } from "../../config";
import publicResolverABI from "../../abi/PublicResolver.json";
import { Modal, Spinner, Tab, Tabs } from 'react-bootstrap';
import { namehash, zeroAddress } from 'viem';
import { Link } from 'react-router';
import * as Icons from "react-bootstrap-icons";
import { normalize } from 'viem/ens';
import { getEnsResolver, multicall, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { Interface } from 'ethers';
import { GET_SUBGRAPH_RECORDS } from '../../graphql/Domain';

class EditProfile extends Component {

    // Avatar (avatar)
    // Nickname (name)
    // bio (description)
    // Website (url)
    // Location (location)
    // Email (email)    

    // Twitter (com.twitter)
    // Discord (com.discord)
    // Telegram (org.telegram)
    // Github (com.github)

    // btc, xrp, ltc, dot, matic, doge, sol, bnb

    avatarRef = React.createRef()
    nameRef = React.createRef()
    descriptionRef = React.createRef()
    urlRef = React.createRef()
    locationRef = React.createRef()
    emailRef = React.createRef()
    twitterRef = React.createRef()
    discordRef = React.createRef()
    telegramRef = React.createRef()
    githubRef = React.createRef()
    btcRef = React.createRef()

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
           useLatestResolver: true,
           isRecordFetching: false
        }; 

       
    } 
 
    handleClose = () =>{
        this.setState({ 
            showModal: false
        });
    } 

    handleCloseFull = () =>{
        this.setState({ 
            showModal: false, 
            txError: null, 
            txPending: false, 
            txCompleted: false, 
            txHash: null, 
            txReceipt: null
        });
    } 
 
    handleShow = () =>{
        this.setState({ showModal: true });

    } 

    getTextCallData = (node, key, value) => { 
        let iface = new Interface([
            "function setText(bytes32 node,string calldata key, string calldata value)"
        ]); 
        let calldata = iface.encodeFunctionData(
            "setText", 
            [
                node, 
                key,
                value
            ]
        );
        return calldata;
    }

    getCallDataWithValidation = (node) => {
 
        const avatarData = this.getTextCallData(node, "avatar", this.avatarRef.current.value);
        const nameData = this.getTextCallData(node, "name", this.nameRef.current.value);
        const descriptionData = this.getTextCallData(node, "description", this.descriptionRef.current.value);
        const urlData = this.getTextCallData(node, "url", this.urlRef.current.value);
        const locationData = this.getTextCallData(node, "location", this.locationRef.current.value);
        const emailData = this.getTextCallData(node, "email", this.emailRef.current.value);
        const twitterData = this.getTextCallData(node, "com.twitter", this.twitterRef.current.value);
        const discordData = this.getTextCallData(node, "com.discord", this.discordRef.current.value);
        const telegramData = this.getTextCallData(node, "org.telegram", this.telegramRef.current.value);
        const githubData = this.getTextCallData(node, "com.github", this.githubRef.current.value);
 
        let calldata = []; 
        calldata.push(avatarData);
        calldata.push(nameData);
        calldata.push(descriptionData);
        calldata.push(urlData);
        calldata.push(locationData);
        calldata.push(emailData);
        calldata.push(twitterData);
        calldata.push(discordData);
        calldata.push(telegramData);
        calldata.push(githubData);
        return calldata;
    }

    getContractsData = (mnsResolver, node) => {

        const publicResolverContract = {
            address: mnsResolver,
            abi: publicResolverABI,
        }

        return [
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "avatar"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "name"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "description"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "url"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "location"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "email"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "com.twitter"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "com.discord"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "org.telegram"]
            },
            {
                ...publicResolverContract,
                functionName: "text",
                args: [node, "com.github"]
            }
        ]
    }
  
    async handleEditProfile() {
        try {

            this.setState({ txPending: true, txCompleted: false, txError: null });
 
            const mnsResolver = await getEnsResolver(rainbowConfig, {
                name: normalize(this.props.name),
                universalResolverAddress: universalResolver, 
                chainId: monadTestnet.id
            });

            if(mnsResolver == zeroAddress || mnsResolver == null)
                throw new Error("Resolver not found.");

            const node = namehash(normalize(`${this.props.name}`));
             
            // get items
            
            const calldata = this.getCallDataWithValidation(node);
              
            const hash = await writeContract(rainbowConfig, {
                abi: publicResolverABI,
                address: mnsResolver,
                functionName: "multicall",
                args: [calldata],
                account: this.props.address,
                chainId: monadTestnet.id
            });

            this.setState({ txHash: hash });

            const recepient = await waitForTransactionReceipt(rainbowConfig, {  hash: hash });

            this.setState({ txPending: false, txCompleted: true, txError: null, txReceipt: recepient });
        } catch(e) {
            console.log(e)
            this.setState({ txPending: false, txCompleted: false, txError: e.message, txHash: null, txReceipt: null });
        } 
    }
 
    componentDidMount () {     
      
    }

    componentDidUpdate(prevProps, prevState) { 

    }

    render() {
        return (   
            <>
            { ( this.props.isWrapped && this.props.isOwner) || this.props.isManager ?
            <button 
                className='btn bg-primary-subtle border border-primary-subtle fw-bold text-primary' 
                onClick={(e)=> this.handleShow()}
                {...this.props}>
                Edit Profile
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
                    <Modal.Header closeButton>
                    <Modal.Title> 
                        {this.state.step == 1 ? 
                            <>
                            {this.state.txHash == null 
                                && this.state.txReceipt == null 
                                && !this.state.txPending  
                                ? 
                                <>Edit Profile</>: <></>} 
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
                            <div className='border rounded-3 p-3 mt-2 d-flex flex-column justify-content-between align-item-center'>
                                <Link to={scanUrl +"/tx/"+ this.state.txHash } target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                    <Icons.BoxArrowUpRight />
                                    <span className='ms-2'>View your transaction</span>
                                </Link>
                            </div>: <></>
                        }
                        <div className='d-flex flex-column mt-2'>
                            <Tabs
                                defaultActiveKey="profile"
                                transition={false}
                                >
                                <Tab eventKey="profile" title="Profile" className='bg-body-tertiary border rounded-3 p-3 border-top-0 rounded-top-0'>
                                    <ul className='d-flex flex-column justify-content-between list-unstyled gap-2'>
                                        <li className='d-flex flex-column gap-2 justify-content-between align-item-center gap-3'>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Avatar</strong>
                                                    <small className='text-muted'>avatar</small>
                                                </div>
                                                <input name="avatar" defaultValue={this.props.records.avatar} className='form-control form-control-lg' placeholder='Your avatar URL' ref={this.avatarRef} />
                                            </div>
                                            <div className='d-flex flex-row gap-3'>
                                                <div className='d-flex flex-column gap-2 w-100'>
                                                    <div className='d-flex flex-row justify-content-between align-items-center'>
                                                        <strong>Nickname</strong>
                                                        <small className='text-muted'>name</small>
                                                    </div>
                                                    <input name="name" defaultValue={this.props.records.name} className='form-control form-control-lg' placeholder='John Smith' ref={this.nameRef} />
                                                </div>
                                            </div>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Short Bio</strong>
                                                    <small className='text-muted'>description</small>
                                                </div>
                                                <textarea name="bio" defaultValue={this.props.records.description} className='form-control form-control-lg' placeholder='I am a yield farmer' ref={this.descriptionRef} />
                                            </div>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Website</strong>
                                                    <small className='text-muted'>url</small>
                                                </div>
                                                <input name="url" defaultValue={this.props.records.url} className='form-control form-control-lg' placeholder='https://monadns.com' ref={this.urlRef} />
                                            </div>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Location</strong>
                                                    <small className='text-muted'>location</small>
                                                </div>
                                                <input name="location" defaultValue={this.props.records.location} className='form-control form-control-lg' placeholder='Metaverse' ref={this.locationRef} />
                                            </div>
                                            
                                        </li>
                                    </ul>
                                </Tab>
                                <Tab eventKey="accounts" title="Accounts" className='bg-body-tertiary border rounded-3 p-3 border-top-0 rounded-top-0'>
                                    <ul className='d-flex flex-column justify-content-between list-unstyled gap-2'>
                                        <li className='d-flex flex-column gap-4 justify-content-between align-item-center'>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Email</strong>
                                                    <small className='text-muted'>email</small>
                                                </div>
                                                <input name="email" defaultValue={this.props.records.email} className='form-control form-control-lg' placeholder='e.g hello@example.com' ref={this.emailRef} />
                                            </div>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Twitter(X)</strong>
                                                    <small className='text-muted'>com.twitter</small>
                                                </div>
                                                <input name="com.twitter" defaultValue={this.props.records["com.twitter"]} className='form-control form-control-lg' placeholder='e.g mondomains' ref={this.twitterRef} />
                                            </div>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Discord</strong>
                                                    <small className='text-muted'>com.discord</small>
                                                </div>
                                                <input name="com.discord" defaultValue={this.props.records["com.discord"]} className='form-control form-control-lg' placeholder='e.g mondomains' ref={this.discordRef} />
                                            </div>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Telegram</strong>
                                                    <small className='text-muted'>org.telegram</small>
                                                </div>
                                                <input name="org.telegram" defaultValue={this.props.records["org.telegram"]} className='form-control form-control-lg' placeholder='e.g mondomains' ref={this.telegramRef} />
                                            </div>
                                            <div className='d-flex flex-column gap-2 w-100'>
                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                    <strong>Github</strong>
                                                    <small className='text-muted'>com.github</small>
                                                </div>
                                                <input name="com.github" defaultValue={this.props.records["com.github"]} className='form-control form-control-lg' placeholder='e.g mondomains' ref={this.githubRef} />
                                            </div>
                                        </li>
                                    </ul>
                                </Tab>
                            </Tabs> 
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <div className='d-flex flex-row align-items-center justify-content-between p-2 w-100 gap-2'>
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
                        <button disabled={this.state.txPending} className="btn btn-lg btn-primary border-0 w-100" onClick={()=> this.handleEditProfile()}>
                            {this.state.txPending ? <><Spinner variant="light" size="sm" /> Waiting Transaction</>: <>Open Wallet</>} 
                        </button>: <></>
                    }
                    </div>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default EditProfile;
