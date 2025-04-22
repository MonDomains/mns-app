
import moment from 'moment';
import React, {Component} from 'react';
import { monadTestnet } from 'viem/chains';
import * as Icons from "react-bootstrap-icons";
import { apolloClient, bulkRenewal, explorerUrl, gracePeriod, rainbowConfig } from '../config';
import { GET_MY_DOMAINS } from '../graphql/Domain';
import { Modal, Spinner } from 'react-bootstrap';
import { getExpires } from '../helpers/String';
import avatar from "../assets/images/avatar.svg";
import { Link } from 'react-router';
import { getBalance, getGasPrice, readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { ethers, formatEther } from 'ethers';
import staticBulkRenewalABI from "../abi/StaticBulkRenewal.json";
import ExpiresText from './Buttons/ExpiresText';
import GasInfoBox from './Buttons/GasInfoBox';
import CopyText from './Buttons/CopyText';
import ShareButton from './Buttons/ShareButton';

class Names extends Component {
    constructor(props) { 
        super(props); 

        this.state = {
            expiryDate: moment().utc().unix(),
            first: 10,
            page: 0,
            skip: 0,
            orderBy: "createdAt",
            orderDirection: "desc",
            q: "",
            whereFilter: {},
            isLoading: false,
            domains: [],
            error: null,
            moreDomains: true,
            clear: false,
            selectionMode: false,
            selectedDomains: [],
            selectedCount: 0,
            showModal: false,
            step: 1,
            duration: 1,
            isGasPricePending: false,
            gasPrice: 0,
            isFetchingPrice: false,
            total: 0,
            isExtending: false,
            txHash: null,
            isTxPending: false,
            txReceipt: null,
            balance: 0,
            isFetchingBalance: false,
        };  
    }
     
    async handleExtend() { 
        try {
            let names = this.state.selectedDomains.filter(t=> t.isSelected == true).map(t=> t.labelName);
            this.setState({ error: null, isExtending: true, isTxPending: false });
            let txHash = await writeContract(rainbowConfig, {
                abi: staticBulkRenewalABI,
                address: bulkRenewal,
                functionName: 'renewAll',
                args: [names, this.getDuration()],
                account: this.props.address,
                value: this.state.total,
                chainId: monadTestnet.id
            }); 
            this.setState({ txHash, isTxPending: true });
            const txReceipt = await waitForTransactionReceipt(rainbowConfig, {  hash: txHash });
            this.setState({ txReceipt, isExtending: false, isTxPending: false });
            
        } catch(e) {
            this.setState({ isExtending: false, txHash: null, txReceipt: null, isTxPending: false, error: e.message });
        }
    }

    async handlePrice() { 
        let totalPrice; 
        try {
            let names = this.state.selectedDomains.filter(t=> t.isSelected == true).map(t=> t.labelName);
            this.setState({error: null, isFetchingPrice: true }); 
            totalPrice = await readContract(rainbowConfig, {
                abi: staticBulkRenewalABI,
                address: bulkRenewal,
                functionName: 'rentPrice',
                args: [names, this.getDuration()],
                account: this.props.address,
                chainId: monadTestnet.id
            }); 
            this.setState({ isFetchingPrice: false, total: totalPrice });
        } catch(e) {
            this.setState({ isFetchingPrice: false, error: e.message });
        }
    }
 
    async handleBalance() {
        try { 
            this.setState({error: null, isFetchingBalance : true });
            const balance = await getBalance(rainbowConfig, {
                address: this.props.address, 
            }); 
            this.setState({ isFetchingBalance : false, balance: balance.value });
        } catch(e) {
            this.setState({ isFetchingBalance : false, balance: 0, error: e.message });
        }
    }

    async handleGasPrice() { 
        try { 
            this.setState({ error: null, gasPrice: 0, isGasPricePending: true })
            const gasPrice = await getGasPrice(rainbowConfig);
            this.setState({ gasPrice, isGasPricePending: false })
        } catch(e) { 
            this.setState({ gasPrice: 0, isGasPricePending: false, error: e.message })
        }
    }

    async handleQuery() { 
        try { 
            this.setState({  isLoading: true, error: null }); 
            const variables = {  
                addr: this.props.address?.toLowerCase(), 
                expiry: this.state.expiry, 
                orderBy: this.state.orderBy, 
                orderDirection: this.state.orderDirection, 
                whereFilter: this.buildWhereFilter(), 
                skip: this.state.skip, 
                first : this.state.first
            };  
            const { data } = await apolloClient.query({
                query: GET_MY_DOMAINS,
                variables: variables,
                notifyOnNetworkStatusChange: true
            });
            
            if(data.domains == null || data.domains.length == 0) 
                this.setState({ moreDomains: false })
            
            let domains = this.state.domains.concat(data.domains);
            let selectedDomains = this.mergeUnique(this.state.selectedDomains, domains)
            this.setState({ isLoading: false, domains, selectedDomains });

        } catch (e) {
            this.setState({ isLoading: false, error: e.message });
        }
    }

    handleDurationDown(e) {
        if(this.state.duration > 1) {
            this.setState({ duration: this.state.duration - 1 });
        }
    }

    handleDurationUp(e) {
        if(!this.state.isCommitted) {
            this.setState({ duration: this.state.duration + 1 });
        }       
    }

    getDuration() {
        return this.state.duration * 60 * 60 * 24 * 365;
    }

    nextStep() {
        if(this.state.step < 3)
        this.setState({ step: this.state.step+1 });
    }

    prevStep() {
        if(this.state.step > 1)
            this.setState({ step: this.state.step-1 });
    }

    closeExtendModal = () =>{ 
        this.setState({ showModal: false, step: 1, duration: 1 });
    }

    closeExtendModalFull = () =>{ 
        this.setState({ 
            showModal: false, 
            step: 1, 
            duration: 1, 
            selectedCount: 0, 
            selectionMode: false,
            txHash: null,
            txReceipt: null
        });
        this.handleAllCheck();
    } 
 
    showExtendModal = (id) =>{
        this.setState({ showModal: true });
    } 

    buildWhereFilter() {
        let filter = { 
          and: [
          
                {
                    or: [ 
                        /*
                        {
                            owner: this.props.address.toLowerCase()
                        },*/
                        {
                            registrant: this.props.address.toLowerCase()
                        },
                        {
                            wrappedOwner: this.props.address.toLowerCase()
                        }
                    ]
                },
                {    
                    parent_not: "0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2"
                },
                {
                    or: [
                        {
                            expiryDate_gt: this.state.expiryDate
                        },
                        {
                            expiryDate: null
                        }
                    ]
                },
                {
                    or: [
                        {
                            owner_not: "0x0000000000000000000000000000000000000000"
                        },
                        {
                            resolver_not: null
                        },
                        {
                            and: [
                                {
                                    registrant_not: "0x0000000000000000000000000000000000000000"
                                },
                                {
                                    registrant_not: null
                                }
                            ]
                        }
                    ]
                }
          ]
        }
        if(this.state.q.length > 0) {
          filter.and.push({ name_contains: this.state.q.toLocaleLowerCase() });
        } 
        return filter;
    }
    
    timer = null;

    delay = async (ms) => {  
        return new Promise((resolve) => { 
            clearTimeout(this.timer);
            this.timer = setTimeout(resolve, ms) 
        });
    };
    
    async setQuery (e) {  
        if (e.key != 'Enter' || e.keyCode != 13 ) {
            await this.delay(500);
        } 
        const q = e.target.value;
        if(q != this.state.q)
            this.setState({ q, domains: [], page: 0, skip: 0  });        
    }

    setOrderBy (orderBy) {
        if(this.state.orderBy != orderBy)
            this.setState({ orderBy, domains: [], selectedDomains: [], page: 0, skip: 0  });
    }

    setOrderDirection (orderDirection) {
        if(this.state.orderDirection != orderDirection)
            this.setState({ orderDirection, domains: [], selectedDomains: [], page: 0, skip: 0 });
    }
  
    mergeUnique(arr1, arr2){
        return arr1.concat(arr2.filter(function (item) {
            return arr1.filter(t=> t.name == item.name).length < 1;
        }));
    }

    nextPage () { 
        let p = this.state.page+1;
        let f = this.state.first;
        if(this.state.isLoading == false)
            this.setState({ page: p, skip: p * f })
    }

    handleAllCheck() {
        let mode = !this.state.selectionMode;
        this.setState({ selectionMode: mode });
        let selectedDomains = []; 
        if(mode) {
            selectedDomains.push(...this.state.selectedDomains.map(t => { 
                t.isSelected = true; 
                return t;
            }));
        } else {
            selectedDomains.push(...this.state.selectedDomains.map(t=> { 
                t.isSelected = false; 
                return t;  
            }));
        }
        let selectedCount = selectedDomains.length;
        this.setState({ selectedDomains, selectedCount});  
    }

    handleItemClick (e, domain) { 
        let mode = this.state.selectionMode;
        if(!mode)  return true; 
        e.preventDefault(); 
        this.setSelectedDomains(domain);
        return false;
    }

    handleSelectItem(e, domain) {   
        this.setState({ selectionMode: true });
        this.setSelectedDomains(domain);
        return false;
    }
 
    setSelectedDomains(domain) {
        let selectedDomains = this.state.selectedDomains; 
        let index = selectedDomains.findIndex(t=> t.name == domain.name);
        let item = selectedDomains[index];
        if(item.isSelected) {
            item.isSelected = false;
        } else {
            item.isSelected = true;
        }
        selectedDomains[index] = item; 
        let selectedCount = selectedDomains.filter(t=> t.isSelected == true).length;
        this.setState({ selectedDomains, selectedCount });        
        if(selectedCount < 1) this.setState({ selectionMode: false });
    }

    handleScroll () { 
        if ( window.innerHeight + document.documentElement.scrollTop + 300
            >= document.documentElement.offsetHeight
        ) {
            this.nextPage();
        }
    };


    componentDidMount () {     
        this.handleQuery();
        window.addEventListener('scroll', (e) => this.handleScroll());
    }

    componentDidUpdate(prevProps, prevState) { 
        if(
            (prevState.orderBy != this.state.orderBy) || 
            (prevState.orderDirection != this.state.orderDirection) || 
            (prevState.q != this.state.q) || 
            (prevState.skip != this.state.skip) || 
            (prevProps.address != this.props.address)
        ) {
            this.handleQuery();
        }  

        if(prevState.step != this.state.step && this.state.step == 2) {
            this.handleGasPrice();
            this.handlePrice();
        }

        if(prevState.duration != this.state.duration && this.state.step == 2) {
            this.handlePrice();
        }

        if(prevState.selectedCount != this.state.selectedCount) {
            this.handlePrice();
        }

        if(prevState.step != this.state.step && this.state.step == 3) {
            this.handleBalance();
        }
        
    } 

    render() {  
        return (<>  

            { this.props.mode == "view" ?  
                <div className='bg-light-subtle border border-light-subtle rounded-4 p-0 mb-4'>
                    <div className='bg-primary bg-gradient rounded-top-4 position-relative' style={{height: 150}}>
                        <div className='position-absolute top-50 start-0 ms-4'>
                            <img src={avatar} width={128} role="button" />
                        </div>
                         
                    </div> 
                    <div className='d-flex flex-row p-3 align-items-end justify-content-end gap-2'>
                    { this.props.name ? 
                        <a className='btn bg-primary-subtle' href={`/${this.props.name}`}>
                            View Profile
                        </a> :
                        <a className='btn bg-primary-subtle' href={ `${explorerUrl}/address/${this.props.address}` } target='_blank' >
                            View Address
                        </a> 
                    }
                    </div>
                    <div className='d-flex flex-column p-4 pt-1 gap-2'>
                        <h1 className='fw-bold text-trunctate text-wrap text-break'>
                            {this.props.name || this.props.address}
                            <CopyText className="btn btn-default p-0 ms-2 mb-2" text={this.props.name || this.props.address} />
                        </h1>
                        
                        <div className='d-flex flex-column flex-md-row align-items-start justify-content-between gap-2'>
                            
                        </div>
                    </div>
                </div>   : <></>
            }
        
            <div className="d-flex flex-column gap-3 p-0">
                { !this.props.mode == "view" ? <h2 className='fw-bold'>Names</h2> : <></> }
                <div className="d-flex flex-column bg-light-subtle border border-light-subtle rounded-2 gap-2">
                    <div className="d-flex flex-column flex-md-row flex-column-reverse gap-3 justify-content-between p-3 border-bottom sticky-top bg-light-subtle">
                        <div className="d-flex flex-row gap-3 align-items-center">
                            <a className={ "btn rounded-circle border-2 fw-bold "+ (this.state.selectionMode ? 'border-primary text-primary': 'border-secondary text-secondary') } onClick={()=> this.handleAllCheck()}>
                                <Icons.CheckLg className='fw-bold' />
                            </a>
                            {!this.state.selectionMode ? <>
                                <select defaultValue={"createdAt"} className="form-select form-select-lg bg-light-subtle" onChange={(e)=> this.setOrderBy(e.target.value)}>
                                    <option value="expiryDate">Expiry date</option>
                                    <option value="name">Name</option>
                                    <option value="createdAt">Creation date</option>
                                </select>
                                <button className={"bg-light-subtle btn btn-lg btn-outline " + (this.state.orderDirection == "desc" ? "border-light-subtle text-primary": "")} onClick={()=> this.setOrderDirection("desc")}>
                                    <Icons.SortDown />
                                </button>
                                <button className={"bg-light-subtle btn btn-lg btn-outline " + (this.state.orderDirection == "asc" ? "border-light-subtle text-primary": "") } onClick={()=> this.setOrderDirection("asc")}>
                                    <Icons.SortUp />
                                </button>
                            </> 
                            : <>
                                <strong className='fs-5'>{this.state.selectedCount} selected</strong>
                                <button className='btn btn-primary btn-lg float-end' onClick={() => this.showExtendModal()}>
                                    <Icons.FastForwardFill /> Extend
                                </button>
                            </> }
                        </div>
                        <div className="d-flex flex-shrink-1">  
                            <div className='input-group border rounded-1'>
                                <span className='input-group-text bg-light-subtle border-0 ps-2'><Icons.Search/></span>
                                <input type="text" placeholder="Search" className={"form-control form-control-lg ps-1 bg-light-subtle shadow-none border-0"} onKeyUp={(e)=> this.setQuery(e) } />
                            </div> 
                        </div> 
                    </div> 
                    { 
                        !this.state.isLoading && 
                        this.state.error != null ?  
                            <div className="alert alert-danger m-3">{this.state.error}</div>:  
                        <></>
                    }

                    { 
                        !this.state.isLoading && 
                        (this.state.domains == null || this.state.domains.length < 1) 
                        && this.state.moreDomains == false ?  
                            <div className="alert alert-primary m-3">No domain(s) found</div>:  
                        <></>
                    }
                    
                    { this.state.error == null && (this.state.domains != null || this.state.domains?.length > 0) ?
                        <ul className='list-unstyled'>
                            { this.state.domains.map((domain) => (
                                <>
                                <li className={'border-bottom border-light-subtle p-3 '+ (this.state.selectedDomains.filter(t=> t.name == domain.name).pop().isSelected ? "bg-primary-subtle": "" ) } key={domain.name}>
                                    <div className="d-flex flex-row gap-2 align-items-start align-items-center">
                                        <div className='position-relative'>
                                            <img src={avatar} width={36} role="button" onClick={ (e) => { return this.handleSelectItem(e, domain) } } /> 
                                            { this.state.selectedDomains.filter(t=> t.name == domain.name).pop().isSelected ?
                                                <Icons.Check size={12} role='button' onClick={ (e) => { return this.handleSelectItem(e, domain) } } className='bg-primary bg-gradient bg-opacity-25 rounded-circle w-100 h-100 position-absolute top-50 start-50 translate-middle text-white' />
                                                : <></>
                                            } 
                                        </div>
                                        <Link onClick={(e)=> { return this.handleItemClick(e, domain)} } to={"/"+ domain.name } 
                                            className="w-100 text-truncate text-decoration-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover d-flex flex-row gap-2 align-items-center justify-content-between text-truncate">
                                            <div className="d-flex flex-column text-truncate align-items-start">
                                                <h5 className='m-0 fw-bold'>{domain.labelName}<small className='text-body-secondary'>.mon</small></h5>
                                                <ExpiresText expires={domain.registration?.expiryDate} />
                                            </div>
                                            <div className="d-flex flex-column flex-md-row justify-content-between gap-2 align-items-end">
                                                { domain.name === this.props.name ?
                                                    <span><small className="badge bg-primary-subtle text-primary-emphasis">Primary</small></span>
                                                    : <></>
                                                } 
                                                { domain.registrant.id === this.props.address.toLowerCase() || domain.wrappedOwner?.id === this.props.address.toLowerCase() ?
                                                    <span><small className="badge bg-primary-subtle text-primary-emphasis">Owner</small></span>
                                                    : <></>
                                                }
                                            </div>
                                        </Link>
                                    </div> 
                                </li> 
                                </>
                            )) }
                        </ul> : <></>
                    }

                    { this.state.isLoading ? <div className="d-flex flex-row align-items-center justify-content-center mb-4 gap-2"><Spinner variant='primary' /> Loading...</div> : <> </>}
                    
                    { !this.state.isLoading && this.state.domains != null && this.state?.domains.length >= this.state.first && this.state.moreDomains == true ? 
                        <div className='d-flex flex-row align-items-center justify-content-center p-3'>
                            <button onClick={(e)=> this.nextPage()} className='btn btn-outline-primary'>Load More</button> 
                        </div> 
                    :<></> }
                </div>
            </div> 
            
            <a href="https://docs.monadns.com/faq/why-is-my-mns-name-not-in-my-names/" target='_blank' className='position-relative text-decoration-none text-body-emphasis d-flex flex-row align-items-start gap-4 p-4 bg-body-tertiary border border-light-subtle rounded-2 mt-4'>
                <Icons.QuestionCircle size={32} className='mt-3' />
                <div className='d-flex flex-column'>
                    <h4>Some names may not appear</h4>
                    <p>
                    Offchain names do not currently appear in this list. You can still view them by searching for them directly. Click to learn more.
                    </p>
                </div>
                <Icons.ArrowUpRightCircle className='position-absolute top-0 end-0 m-3 text-primary-emphasis' />
            </a>
            
            {this.renderModal()}
            
        </>)
    }  

    renderModal() {
        return (
            <Modal
                show={this.state.showModal} 
                onHide={() => this.state.isTxPending ? this.closeExtendModalFull(): this.closeExtendModal()}  
                size="lg"
                dialogClassName="modal-90w"
                scrollable={true}
                centered
            >
                <Modal.Header className='text-center'>
                <Modal.Title className='text-center'>
                    {this.state.txHash == null 
                        && this.state.txReceipt == null 
                        && !this.state.isExtending 
                        && !this.state.isTxPending
                        ? 
                        <>Extend {this.state.selectedCount} names</>: <></>} 
                    {this.state.isExtending && !this.state.isTxPending ? "Extending...": ""}
                    {this.state.isTxPending ? "Waiting Transaction...": ""}
                    {this.state.txReceipt ? "Transaction Complete": ""}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body className='overflow-'>
                    {this.state.error != null ?  
                        <div className="alert alert-danger">{this.state.error}</div>
                        : <></>
                    } 

                    {this.state.step == 1 ?
                        <ul className='list-unstyled' key={"step1"}>
                            { this.state.selectedDomains.filter(t=> t.isSelected == true).map((domain) => (
                                <li className='bg-body-tertiary border border-light-subtle rounded-2 p-3 mb-2'>
                                    <div className="d-flex flex-row gap-2 align-items-center text-truncate">
                                        <div className='position-relative'>
                                            <img src={avatar} width={42} /> 
                                            { this.state.selectedDomains.filter(t=> t.name == domain.name).pop().isSelected ?
                                                <Icons.Check size={12} className='bg-primary bg-gradient bg-opacity-25 rounded-circle w-100 h-100 position-absolute top-50 start-50 translate-middle text-white' />
                                                : <></>
                                            } 
                                        </div>
                                        <div className="d-flex flex-column text-truncate align-items-start">
                                            <h3 className='m-0'>{domain.labelName}<small className='text-body-secondary fw-bold'>.mon</small></h3>
                                            <ExpiresText expires={domain.registration?.expiryDate} />
                                        </div>
                                    </div>
                                </li>
                            )) }
                        </ul> : <></>
                    }

                    {this.state.step == 2 ? 
                        <div className='d-flex flex-column gap-3'>
                            adf
                            <div className='d-flex flex-row align-items-center justify-content-between p-2'>
                                <div className='flex-fill text-muted fw-bold'>
                                    <GasInfoBox handleError={this.handleError} />
                                </div>
                                <div className='rounded-3 bg-primary p-2 text-white'>
                                    {import.meta.env.VITE_APP_NATIVE_TOKEN}
                                </div>
                            </div>
                            <div className='bg-body-tertiary border border-light-subtle rounded-2 p-3'>
                                <ul className='list-unstyled d-flex flex-column gap-2' key="price">
                                    <li className='d-flex flex-column flex-md-row justify-content-between fw-bold'>
                                        <span className='text-muted'>
                                            <b>Estimated Total</b>
                                        </span>
                                        <span>
                                             {
                                                this.state.isFetchingPrice  ? 
                                                <> Checking... </> : 
                                                <>  <span>{formatEther(this.state.total)} {import.meta.env.VITE_APP_NATIVE_TOKEN}</span> </>
                                             }
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div> : <></>
                    }
                    
                    {this.state.step == 3 ?
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <ul className='list-unstyled w-100' key="step3">
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
                                {this.state.isTxPending ? 
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
                                    <span className='fw-bold'>{this.state.selectedCount} names</span>
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
                        </div> : <></>
                    } 
                </Modal.Body>
                <Modal.Footer className='d-flex flex-row align-items-center justify-content-between p-2'>
                    { this.state.txHash == null ? 
                    <div className='flex-fill'>
                        {this.state.step > 1 && this.state.txHash == null ?
                            <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.prevStep()}>
                                Back
                            </button> : <></>   
                        } 
                        {this.state.step == 1 && this.state.txHash == null ?
                            <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.closeExtendModal()}>
                                Cancel
                            </button> : <></>
                        }
                    </div> : <></>
                    }
                    <div className='flex-fill'> 
                        { this.state.step == 3 && this.state.txHash != null  ? 
                            <button className='btn btn-default bg-primary-subtle btn-lg w-100' onClick={() => this.closeExtendModalFull()}>
                                {this.state.isTxPending ? "Close": "Done"}
                            </button>
                            : <></>
                        }

                        { this.state.step == 3 && this.state.txHash == null  ?
                            <button className={'btn btn-lg w-100 btn-primary'} disabled={this.state.isExtending || this.state.isFetchingBalance || (this.state.balance < this.state.total)} onClick={(e)=> this.handleExtend()}>
                                {this.state.isExtending || this.state.isFetchingBalance ? <><Spinner size='sm' /></>: ""}
                                {!this.state.isFetchingBalance && this.state.balance < this.state.total ? "Unsufficient Balance": ""}
                                {!this.state.isExtending && !this.state.isFetchingBalance && this.state.balance >= this.state.total ? "Extend": ""}
                            </button>
                            : <></> 
                        }  

                        { this.state.step < 3 ?
                            <button className='btn btn-primary btn-lg w-100' onClick={(e)=> this.nextStep()}>
                                Next
                            </button>: <></>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default Names;