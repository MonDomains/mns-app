import { ethers, formatEther, keccak256, parseEther } from "ethers";
import { apolloClient, wagmiAdapter } from "../config";
import { readContract, writeContract } from '@wagmi/core'
import { toast } from "react-toastify";
import React, {Component} from 'react';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { waitForTransactionReceipt } from '@wagmi/core'
import spinner from '../assets/images/spinner.svg';
import moment from "moment";
import { Alert, Form, Modal, Spinner } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";  
import { GET_DOMAIN } from "../graphql/Domain";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { getDateSimple, getExpires, getLabelHash, getNameHash, getOneYearDuration, getTimeAgo, getTokenId, obscureLabel, obscureName } from "../helpers/String";
import { getBalance } from '@wagmi/core'
import { monadTestnet } from 'wagmi/chains'
import { BoxArrowUpRight, Check, DashCircleFill, FileMinus, PlusCircle, PlusCircleFill, PlusLg, TwitterX } from "react-bootstrap-icons";
import ConnectWalletButton from "./ConnectWalletButton";
import txProcessingGif from "../assets/images/tx_processing.gif"
import txProcessingGif2 from "../assets/images/tx_processing2.gif"

class RegisterName extends Component {
     
    resolver = import.meta.env.VITE_APP_PUBLIC_RESOLVER;
    data =  [];
     
    constructor(props) {
      super(props);

      this.state = {
         commitment: null,
         isCommitRequesting: false,
         isCommiting: false,
         isCommitted: false,
         secret: null,
         isRegistring: false,
         available: null,
         isAvailablePending: false,
         isPendingPrevCommitment: false,
         isCommitmentExists: false,
         isRegistered: false,
         isMakingCommitment: false,
         domain: null,
         isTimerCompleted: false,
         duration: 1,
         isFetchingPrice: false,
         isFetchedPrice: true,
         price: 0,
         isGettingBalance: false,
         balance: 0,
         showCounter: false,
         countdown: 0,
         reverseRecord: true,
         txHash: null,
         processing: false,
         processed: false, 
      };
    }
 
    getUnixTime () {
        return moment().utc().unix();
    }

    handleReverseRecord(e) {
        this.state.reverseRecord = !this.state.reverseRecord;
    }
 
    async handleRegister () { 
         
        try {

            this.setState({ isRegistring: true, isRegistered: false });
 
            const _hash = await writeContract(wagmiAdapter.wagmiConfig, {
                abi: monRegisterControllerABI,
                address: import.meta.env.VITE_APP_REGISTER_CONTROLLER,
                functionName: "register",
                args: [ this.props.name, this.props.owner, this.getDuration(), this.resolver, this.data, this.state.reverseRecord ],
                account: this.props.owner,
                value: this.state.price,
                chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
            });

            this.setState({ txHash: _hash });

            toast.success("Your transaction has been sent.");

            this.setState({ processing: true, processed: false });
            
            const recepient = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {  hash: _hash });

            toast.success("Your transaction has been completed.");

            this.setState({ processing: false, processed: true });

            this.setState({ isRegistring: false, isRegistered: true, available: false });

        } catch(e) {
            toast.error("An error occured.");
            console.error(e)
            this.setState({ isRegistring: false, isRegistered: false });
        } 
    }

    async handleAvailable() { 
        let _available = false; 

        try {

            this.setState({ isAvailablePending: true });

            _available = await readContract(wagmiAdapter.wagmiConfig, {
                abi: monRegisterControllerABI,
                address: import.meta.env.VITE_APP_REGISTER_CONTROLLER,
                functionName: 'available',
                args: [this.props.name],
                account: this.props.owner,
                chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
            });

            if(!_available) {
                this.props.navigate("/"+ this.props.name + ".mon");
            }

            this.setState({ isAvailablePending: false });
            this.setState({ available: _available });

        } catch (e) {

            this.setState({ isAvailablePending: false });
            toast.error("An error occured.");

        }
    } 

    async handleQuery() {

        try {
            let name = this.props.name + ".mon";
            const result = await apolloClient.query( {
                query: GET_DOMAIN,
                variables: {
                    name
                }
            }); 
            this.setState({ domain: result.data.domains[0] })
        } catch(e) {
            console.log(e);
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
        return this.state.duration * getOneYearDuration();
    }

    getText() {
        return encodeURIComponent(
`I've just minted ${obscureName(this.props.name, 20)}.mon on @monad_xyz.

Mint yours! Click the link below 👇

https://app.monadns.com/${this.props.name}.mon?v=${this.getUnixTime()} 
 
Powered by @monadns `);

    }
 
    async handlePrice() { 

        console.log("handlePrice    ")
        let _price = false; 
 
        try {
            this.setState({ isFetchingPrice: true });
            _price = await readContract(wagmiAdapter.wagmiConfig, {
                abi: monRegisterControllerABI,
                address: import.meta.env.VITE_APP_REGISTER_CONTROLLER,
                functionName: 'rentPrice',
                args: [this.props.name, this.getDuration()],
                account: this.props.owner,
                chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
            });
             
            this.setState({ isFetchingPrice: false, price: _price.base });
        } catch(e) {
            this.setState({ isFetchedPrice: false });
            toast.error("An error occured.");
        }
    }

    async handleBalance() {
        try {
            if(this.props.owner == null) return;

            this.setState({ isGettingBalance : true });

            const balance = await getBalance(wagmiAdapter.wagmiConfig, {
                address: this.props.owner, 
            });

            this.setState({ isGettingBalance : false, balance: balance.value });
        } catch(e) {
            this.setState({ isGettingBalance : false });
            toast.error("An error occured.");
        }
    }
 
    componentDidMount () {   

        
        if(this.state.available === null) { 
            this.handleAvailable();
            this.handleQuery();  
        }
   
        if(!this.state.available) {
            this.handleQuery();  
        }

        if(this.state.duration) { 
            this.handlePrice();
            this.handleBalance(); 
        } 
 
    }

    componentDidUpdate(prevProps, prevState) { 
         
        if(prevProps.name != this.props.name) {
            this.handleAvailable();
            this.handleQuery();
            this.handlePrice();
            this.handleBalance();
        } 

        if(prevState.duration != this.state.duration) {
            this.handlePrice();
            this.handleBalance(); 
        }  

        if(prevProps.isConnected != this.props.isConnected || prevProps.isDisconnected != this.props.isDisconnected) {
            this.handlePrice();
            this.handleBalance();
        } 
    }
 
    render() {  
        
        return (
            <>  
            
            {this.state.isAvailablePending ?
                <div className="d-flex flex-column align-items-center">
                    <Spinner size="lg" variant="primary" />
                </div>
                : <></> 
            }

            {this.state.available && !this.state.processing ? 
                <div className="d-flex flex-column justify-content-center gap-5 p-3">
                    <h5>Register</h5>
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center align-items-lg-top gap-5">
                        <div>
                            <img className="rounded-2" width={250} src={import.meta.env.VITE_APP_METADATA_API + "/temp-image/"+ this.props.name} alt={this.props.name} />
                        </div>
                        <ul className="list-unstyled d-flex flex-column justify-content-center gap-3">
                            <li>
                                <h5 className="fw-bold">Duration</h5>
                                <div className="d-flex flex-row justify-content-between align-items-center fs-1 border border-1 border-light-subtle">
                                    <button className="btn border-0" onClick={(e)=> this.handleDurationDown(e)}><DashCircleFill size={24} className="text-primary" /> </button>
                                    <div><small>{this.state.duration} year </small></div>
                                    <button className="btn border-0" onClick={(e)=> this.handleDurationUp(e)}> <PlusCircleFill size={24} className="text-primary" /> </button>
                                </div>
                            </li>
                            <li className="d-flex flex-row justify-content-between align-items-top gap-2">
                                <div>
                                    <h5 className="fw-bold">Set as Primary Name</h5>
                                    <p className="text-muted">
                                        This links your address to this name, allowing dApps to display it as your profile when connected to them. You can only have one primary name per address.
                                    </p> 
                                </div>
                                <Form.Check
                                    type="switch"
                                    defaultChecked={this.state.reverseRecord}
                                    className="form-switch-lg"
                                    onChange={(e)=> this.handleReverseRecord(e)}
                                /> 
                            </li>
                            <li className="text-left fs-5 d-flex flex-row justify-content-between">
                                <span className="fw-bold">Estimated Total: </span>
                                {this.state.isFetchingPrice  ? 
                                    <> Price Updating... </> : 
                                    <>  <span>{formatEther(  this.state.price.toString()) } {import.meta.env.VITE_APP_NATIVE_TOKEN}</span> </>
                                }
                            </li>
                        </ul> 
                    </div>
                    <div className="d-flex flex-column justify-content-end align-items-end">
                            
                        { !this.props.isConnected  ? <ConnectWalletButton></ConnectWalletButton> : 
                            <>
                                {this.state.isFetchingPrice || this.state.isGettingBalance ? 
                                    <button className="btn btn-lg btn-primary border-0">
                                        <Spinner size="sm" /> Waiting...
                                    </button>
                                    : 
                                    <> 
                                        { this.state.balance < this.state.price ?
                                            <button disabled="disabled" className="btn btn-lg btn-danger border-0">
                                                Unsufficient Balance {this.state.balance}
                                            </button>
                                            : 
                                            <> 
                                                <button disabled={this.state.isRegistring ? "disabled": ""} className="btn btn-lg btn-primary border-0" onClick={(e)=> this.handleRegister() }>
                                                    {this.state.isRegistring ? <> <Spinner size="sm" /> Waiting For Transaction</>: <>Register</>} 
                                                </button>
                                            </>
                                            
                                        } 
                                    </>
                                }
                            </>
                        }
                    </div>                       
                </div>
                : 
                <> </>
            }

            {this.state.processing ? 
                <div className="d-flex flex-column justify-content-center align-items-center gap-3 p-3">
                    <h2>Registering <span>{obscureName( this.props.name , 20)}.mon</span> </h2>

                    <div className="d-flex flex-column justify-content-center align-items-center  gap-4">
                        <img width={240} src={txProcessingGif} />
                        <p className="fs-5 fw-bold mb-0">
                            Your transaction being processed...
                        </p> 
                        <Link to={import.meta.env.VITE_APP_SCAN_URL +"/tx/"+ this.state.txHash } target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                            <BoxArrowUpRight />
                            <span className='ms-2'>View on Monad Explorer</span>
                        </Link>
                    </div>
                </div>
                : 
                <></>
            }

            {this.state.processed ? 
                <div className="d-flex flex-column justify-content-center align-items-center gap-3 p-3">
                    <h2><Check /> Successfully Registered</h2>

                    <div className="d-flex flex-column justify-content-center align-items-center  gap-4">
                        <img className="rounded-2" width={250} src={import.meta.env.VITE_APP_METADATA_API + "/temp-image/"+ this.props.name} alt={this.props.name} />
                        <p className="fs-5 fw-bold mb-0 text-center">
                            Your are the owner of <span>{obscureName( this.props.name , 20)}.mon</span>
                        </p>
                        <Link to={import.meta.env.VITE_APP_TOKEN_URL +"/"+ getTokenId(this.props.name)} target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                                <BoxArrowUpRight />
                                <span className='ms-2'>View on Explorer</span>
                        </Link>
                        <Link target="_blank" to={"https://x.com/intent/post?text="+ this.getText()} className="btn btn-lg btn-dark border rounded-2"> Share on <TwitterX /></Link>
                        <div className="d-flex flex-row gap-3">
                            <NavLink to={"/"} className="btn btn-lg btn-primary border rounded-2">Mint Another</NavLink>
                            <NavLink to={"/"+ this.props.name +".mon"} className="btn btn-lg btn-primary border rounded-2">Manage Domain</NavLink>
                        </div>
                    </div>
                </div>
                : 
                <></>
            }
        </>
        )  
      
    }
        
}

export default RegisterName;