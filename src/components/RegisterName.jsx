import { ethers, formatEther, AbiCoder, Interface, namehash } from "ethers";
import { apolloClient, chainId, rainbowConfig, registrarController } from "../config";
import { getGasPrice, readContract, writeContract } from '@wagmi/core'
import { toast } from "react-toastify";
import React, {Component} from 'react';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { waitForTransactionReceipt } from '@wagmi/core'
import moment from "moment";
import { Form, Spinner } from "react-bootstrap";
import { Link, NavLink } from "react-router";  
import { GET_DOMAIN } from "../graphql/Domain";
import { obscureName } from "../helpers/String";
import { getBalance } from '@wagmi/core'
import { BoxArrowUpRight, Check, DashCircleFill, EvStationFill, PlusCircleFill, TwitterX } from "react-bootstrap-icons";
import ConnectWalletButton from "./ConnectWalletButton";
import txProcessingGif from "../assets/images/tx_processing.gif"
import { LazyLoadImage } from "react-lazy-load-image-component";
import { normalize } from "viem/ens";
import ViewOnExplorer from "./Buttons/ViewOnExplorer";
import ViewOnMarketPlace from "./Buttons/ViewOnMarketPlace";
import GasInfoBox from "./Buttons/GasInfoBox";

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
         gasPrice: 0,
         isPendingGasPrice: false,
      };
    }

    
 
    getUnixTime () {
        return moment().utc().unix();
    }

    handleReverseRecord(e) {
        this.state.reverseRecord = !this.state.reverseRecord;
    }
 
    async handleGasPrice() {
        
        try {
            this.state.isGasPricePending = true;
            const gasPrice = await getGasPrice(rainbowConfig);
            this.state.gasPrice = gasPrice;
            this.state.isGasPricePending = false;
        } catch(e) {
            console.log(e.message)
            this.state.gasPrice = 0;
            this.state.isGasPricePending = false;
        }
    }
 
    async handleRegister () { 
         
        try {

            const nameHash = namehash(normalize(`${this.props.name}`));
            
            let iface = new Interface([
                "function setAddr(bytes32 node,address a)"
            ]);
            let calldata = iface.encodeFunctionData(
                "setAddr", 
                [
                    nameHash, 
                    this.props.registrant
                ]
            ); 
            
            this.setState({ isRegistring: true, isRegistered: false });

            const _hash = await writeContract(rainbowConfig, {
                abi: monRegisterControllerABI,
                address: registrarController,
                functionName: "register",
                args: [ String(this.props.labelName), this.props.registrant, this.getDuration(), namehash(normalize(this.props.name)), this.resolver, [calldata], this.state.reverseRecord, 0],
                account: this.props.registrant,
                value: this.state.price,
                chainId: chainId
            }); 

            this.setState({ txHash: _hash });

            toast.success("Your transaction has been sent.");

            this.setState({ processing: true, processed: false });
            
            const recepient = await waitForTransactionReceipt(rainbowConfig, {  hash: _hash });

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

            _available = await readContract(rainbowConfig, {
                abi: monRegisterControllerABI,
                address: registrarController,
                functionName: 'available',
                args: [this.props.labelName],
                account: this.props.registrant,
                chainId: chainId
            });

            if(!_available) {
                this.props.navigate("/"+ this.props.labelName + ".mon");
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
            let name = this.props.labelName + ".mon";
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
        return this.state.duration * (1 * 60 * 60 * 24 * 365);
    }

    getText() {
        return encodeURIComponent(
`I've just minted ${obscureName(this.props.labelName, 20)}.mon 😎

Powered by @MonDomains, built on @monad_xyz

Mint yours! 👇

https://dapp.monadns.com/${this.props.labelName}.mon?v=${this.getUnixTime()} 
 
 `);

    }
 
    async handlePrice() { 
        let _price = false; 
        try {
            this.setState({ isFetchingPrice: true });
            _price = await readContract(rainbowConfig, {
                abi: monRegisterControllerABI,
                address: registrarController,
                functionName: 'rentPrice',
                args: [this.props.labelName, this.getDuration()],
                account: this.props.registrant,
                chainId: chainId
            });
             
            this.setState({ isFetchingPrice: false, price: _price.base });
        } catch(e) {
            this.setState({ isFetchedPrice: false });
            toast.error("An error occured.");
        }
    }

    async handleBalance() {
        try {
            if(this.props.registrant == null) return;

            this.setState({ isGettingBalance : true });

            const balance = await getBalance(rainbowConfig, {
                address: this.props.registrant, 
            });

            this.setState({ isGettingBalance : false, balance: balance.value });
        } catch(e) {
            this.setState({ isGettingBalance : false });
            toast.error("An error occured.");
        }
    }
 
    componentDidMount () {   

        this.handleGasPrice();

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
         
        if(prevProps.labelName != this.props.labelName) {
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
                <div className="d-flex flex-column align-items-center p-5">
                    <Spinner size="lg" variant="primary" />
                </div>
                : <></> 
            }

            {this.state.available && !this.state.processing ? 
                <div className="d-flex flex-column justify-content-center gap-5 p-3">
                    <div className="d-flex flex-row align-items-center justify-content-between">
                        <h4>Register</h4>
                        <span className="gap-2">
                            <GasInfoBox />
                        </span>
                    </div>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-5">
                        <LazyLoadImage 
                            src={import.meta.env.VITE_APP_METADATA_API + "/preview/"+ this.props.labelName + ".mon"}
                            alt={this.props.name}
                            placeholder={<Spinner />}
                            className="rounded-1 preview"
                        />  
                        <ul className="list-unstyled d-flex flex-column justify-content-center gap-4">
                            <li>
                                <h5 className="fw-bold">Duration</h5>
                                <div className="d-flex flex-row justify-content-between align-items-center fs-1 border border-1 border-light-subtle">
                                    <button className="btn border-0" onClick={(e)=> this.handleDurationDown(e)}><DashCircleFill size={24} className="text-primary" /> </button>
                                    <div><small>{this.state.duration} year </small></div>
                                    <button className="btn border-0" onClick={(e)=> this.handleDurationUp(e)}> <PlusCircleFill size={24} className="text-primary" /> </button>
                                </div>
                            </li>
                            <li className="d-flex flex-row justify-content-between align-items-top gap-5">
                                <div>
                                    <h5 className="fw-bold">Set as Primary Name</h5>
                                    <p className="text-muted text-wrap">
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
                                    <>  <span>{formatEther(this.state.price.toString()) } {import.meta.env.VITE_APP_NATIVE_TOKEN}</span> </>
                                }
                            </li>
                        </ul> 
                    </div>
                    <div className="d-flex flex-column justify-content-end align-items-end">
                            
                        { !this.props.isConnected  ? <ConnectWalletButton></ConnectWalletButton> : 
                            <>
                                {this.state.isFetchingPrice || this.state.isGettingBalance ? 
                                    <button className="btn btn-lg btn-primary border-0">
                                        <Spinner variant="light" size="sm" /> Waiting...
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
                                                    {this.state.isRegistring ? <> <Spinner variant="light" size="sm" /> Waiting For Transaction</>: <>Register</>} 
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
                    <h2>Registering <span>{obscureName( this.props.labelName , 20)}.mon</span> </h2>

                    <div className="d-flex flex-column justify-content-center align-items-center  gap-4">
                        <img width={240} src={txProcessingGif} />
                        
                        <p className="fs-5 fw-bold mb-0">
                            Your transaction being processed...
                        </p> 
                        <Link to={import.meta.env.VITE_APP_SCAN_URL +"/tx/"+ this.state.txHash } target='_blank' className='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>
                            <BoxArrowUpRight />
                            <span className='ms-2'>View on Explorer</span>
                        </Link>
                    </div>
                </div>
                : 
                <></>
            }

            {this.state.processed ? 
                <div className="d-flex flex-column flex-fill align-items-center gap-4 p-4">
                    <h2 className="text-center"><Check /> Successfully Registered</h2>       
                    <LazyLoadImage 
                        src={`${import.meta.env.VITE_APP_METADATA_API }/preview/${this.props.labelName}.mon`}
                        alt={this.props.name}
                        placeholder={<Spinner />}
                        className="rounded-1 preview"
                    /> 
                    <Link target="_blank" to={`https://x.com/intent/post?text=${this.getText()}`} className="btn btn-lg bg-black text-white border rounded-2"> 
                        Share on <TwitterX />
                    </Link>  
                    <p className="fs-5 fw-bold mb-0 text-center">
                        Your are the owner of <span>{obscureName( this.props.labelName , 20)}.mon</span>
                    </p> 
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4">
                         
                        <ViewOnExplorer name={this.props.name} isWrapped={this.props.isWrapped} labelName={this.props.labelName} />
                        <ViewOnMarketPlace name={this.props.name} isWrapped={this.props.isWrapped} labelName={this.props.labelName} />
                         
                    </div> 
                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
                        <NavLink to={"/"} className="btn btn-lg btn-primary border rounded-2">
                            Mint Another
                        </NavLink>
                        <NavLink to={`/${this.props.labelName}.mon`} className="btn btn-lg btn-primary border rounded-2">
                            Manage Domain
                        </NavLink>
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