import { ethers, formatEther, keccak256, parseEther } from "ethers";
import { apolloClient, wagmiAdapter } from "../config";
import { readContract, writeContract } from '@wagmi/core'
import { toast } from "react-toastify";
import React, {Component} from 'react';
import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { waitForTransactionReceipt } from '@wagmi/core'
import spinner from '../assets/images/spinner.svg';
import moment from "moment";
import { Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";  
import { GET_DOMAIN } from "../graphql/Domain";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { getDateSimple, getExpires, getLabelHash, getNameHash, getOneYearDuration, getTimeAgo, getTokenId, obscureLabel, obscureName } from "../helpers/String";
import { getBalance } from '@wagmi/core'
import { monadTestnet } from 'wagmi/chains'

class Register extends Component {
     
    resolver = import.meta.env.VITE_APP_PUBLICRESOLVER;
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
         reverseRecord: true
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

            // 551880000000000000n
            console.log(parseEther(this.state.price.toString()))
            console.log(this.state.price.toString())

            const _hash = await writeContract(wagmiAdapter.wagmiConfig, {
                abi: monRegisterControllerABI,
                address: import.meta.env.VITE_APP_MONREGISTERCONTROLLER,
                functionName: "register",
                args: [ this.props.name, this.props.owner, this.getDuration(), this.resolver, this.data, this.state.reverseRecord ],
                account: this.props.owner,
                value: this.state.price,
                chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
            });

            toast.success("Your transaction has been sent.");

            const recepient = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {  hash: _hash });

            console.log(recepient);

            toast.success("Your transaction has been completed.");

            this.setState({ isRegistring: false, isRegistered: true, available: false });

        } catch(e) {
            toast.error(e.message);
            this.setState({ isRegistring: false, isRegistered: false });
        } 
    }

    async handleAvailable() {
        console.log("available")

        let _available = false; 

        try {

            this.setState({ isAvailablePending: true });

            _available = await readContract(wagmiAdapter.wagmiConfig, {
                abi: monRegisterControllerABI,
                address: import.meta.env.VITE_APP_MONREGISTERCONTROLLER,
                functionName: 'available',
                args: [this.props.name],
                account: this.props.owner,
                chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
            });

            this.setState({ isAvailablePending: false });
            this.setState({ available: _available });

        } catch (e) {

            this.setState({ isAvailablePending: false });
            toast.error(e.message);

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
 
    async handlePrice() {
        console.log("handlePrice")
        let _price = false; 
 
        try {
            this.setState({ isFetchingPrice: true });
            _price = await readContract(wagmiAdapter.wagmiConfig, {
                abi: monRegisterControllerABI,
                address: import.meta.env.VITE_APP_MONREGISTERCONTROLLER,
                functionName: 'rentPrice',
                args: [this.props.name, this.getDuration()],
                account: this.props.owner,
                chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
            });
            
            console.log(_price)
            this.setState({ isFetchingPrice: false, price: _price.base });
        } catch(e) {
            this.setState({ isFetchedPrice: false });
            toast.error(e.message);
        }
    }

    async handleBalance() {
        console.log("handleBalance")
        try {

            this.setState({ isGettingBalance : true });

            const balance = await getBalance(wagmiAdapter.wagmiConfig, {
                address: this.props.owner, 
            });

            this.setState({ isGettingBalance : false, balance: balance.value });
            console.log("balance:"+ balance.value)
        } catch(e) {
            this.setState({ isGettingBalance : false });
            toast.error(e.message);
        }
    }

    componentDidMount () {   
        
        console.log("commitments:"+ this.state.commitments);
        
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
    }
 
    render() {  
        
        return (
            <> 
              
            {this.state.available ? 
                <div className="container">
                    <div className="d-flex flex-column justify-content-center mt-3">
                        <ul className="d-flex flex-column justify-content-center gap-3">
                            <li>
                                <strong>Duration</strong>
                                <p className="text-muted"> 
                                    Your name will be registered for {this.state.duration} year. Additional years may be added after the registration has been completed.
                                </p>
                                <div className="customCounter">
                                    <button onClick={(e)=> this.handleDurationDown(e)} className="countminus"></button>
                                    <div><small>{this.state.duration} year </small></div>
                                    <button onClick={(e)=> this.handleDurationUp(e)} className="countplus"></button>
                                </div>
                            </li>
                            <li className="d-flex flex-row justify-content-between align-items-top gap-2">
                                <div>
                                    <strong>Use as primary name</strong>
                                    <p className="text-muted">
                                        This links your address to this name, allowing dApps to display it as your profile when connected to them. You can only have one primary name per address.
                                    </p> 
                                </div>
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    defaultChecked={this.state.reverseRecord}
                                    onChange={(e)=> this.handleReverseRecord(e)}
                                /> 
                            </li>
                            <li className="text-center fw-bold fs-5">
                                <span>Total: <span className="fw-bold">{formatEther(  this.state.price.toString()) } {import.meta.env.VITE_APP_NATIVE_TOKEN} </span> + GAS Fee</span>
                            </li>
                        </ul> 
                        {this.isFetchingPrice || this.state.isGettingBalance ? 
                            <button className="btn btn-lg btn-primary  align-self-center">
                                <img width={25} src={spinner} /> Checking...
                            </button>
                            : 
                            <>
                                { this.state.balance < this.state.price ?
                                    <button disabled="disabled" className="btn btn-light">
                                        Unsufficient Balance {this.state.balance}
                                    </button>
                                    :
                                    
                                    <> 
                                        <button disabled={this.state.isRegistring ? "disabled": ""} className="btn btn-lg btn-primary align-self-center" onClick={(e)=> this.handleRegister() }>
                                            {this.state.isRegistring ? <><img width={25} src={spinner} />Waiting Transaction</>: <>REGISTER</>} 
                                        </button>
                                    </>
                                       
                                }
                                
                            </>
                        }
                    </div>
                </div>
                : 
                <> </>
            }

            {this.state.isRegistered ? 
                <>
                    <Modal 
                        size="lg" 
                        show={this.state.isRegistered}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                            <Modal.Header>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    <h2>You claimed <b>{obscureName(this.props.name, 50)}.mon</b> 😎</h2>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="fs-4">
                                <h3>What's next?</h3> 
                                <p>
                                    See your domains on My Domains page.
                                </p>
                                <p>
                                <Link className="btn btn-success btn-lg" to={"/account"}>Go to My Domains</Link>
                                </p>
                                <p>
                                    <small>Please note that It may take time for your domain to appear in "My Domains" page. This doesn't mean you could not minted. Data indexer service may delay a bit time</small>
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <button onClick={()=> this.setState({ isRegistered: false })} className="btn btn-default">Close</button>
                            </Modal.Footer>
                        </Modal> 
                </>
                : 
                <></>
            }
            </>
        )  
      
    }
        
}

export default Register;