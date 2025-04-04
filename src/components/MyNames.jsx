
import moment from 'moment';
import React, {Component} from 'react';
import { orderly } from 'viem/chains';
import * as Icons from "react-bootstrap-icons";
import { apolloClient } from '../config';
import { GET_MY_DOMAINS } from '../graphql/Domain';
import { NavLink } from 'react-bootstrap';
import { getExpires } from '../helpers/String';
import avatar from "../assets/images/avatar.svg";
import { Link } from 'react-router';

class MyNames extends Component {
 
    constructor(props) { 
        super(props); 
        this.state = {
            expiryDate: moment().utc().unix(),
            first: 10,
            page: 0,
            skip: 0,
            orderBy: "createdAt",
            orderDirection: "desc",
            name: "",
            whereFilter: {},
            isLoading: false,
            domains: null
        };  
    }

    buildWhereFilter() {
        let filter = { 
          and: [
          
                {
                    or: [ 
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
        if(this.state.name && this.state.name.length > 0) {
          filter.and.push({ name_contains: this.state.name });
        } 
        return filter;
    }
    
    delay = async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    
    async setName (e) {
        if (e.key != 'Enter' || e.keyCode != 13 ) await this.delay(500); 
        const name = e.target.value;
        this.setState({ name })
    } 

    setOrderBy (orderBy) {
        this.setState({ orderBy });
    }

    setOrderDirection (orderDirection) {
        this.setState({ orderDirection: orderDirection });
    }

    async handleQuery() {
        this.setState({ isLoading: true });
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
        
        this.setState({ isLoading: false });
        if(data && data.domains && data.domains.length > 0)
            this.setState({ domains: data.domains });
    }

    componentDidMount () {     
        this.handleQuery();
    }

    componentDidUpdate(prevProps, prevState) { 
        if(prevState.orderDirection != this.state.orderDirection) {
            this.handleQuery();
        }

        if(prevState.orderBy != this.state.orderBy) {
            this.handleQuery();
        }

        if(prevState.name != this.state.name) {
            this.handleQuery();
        }

        if(prevProps.address != this.props.address) {
            this.handleQuery();
        }
    } 

    render() {  
        return (<>  
            <div className="d-flex flex-column gap-3 p-0">
                <h2>Names</h2>
                <div className="d-flex flex-column bg-body-tertiary border border-light-subtle rounded-2 p-2 gap-4 fs-5">
                    <div className="d-flex flex-column flex-md-row flex-column-reverse gap-2 justify-content-between">
                        <div className="d-flex flex-row gap-2 align-items-center">
                            {/*<input className="form-check-input rounded-circle me-3 ms-1" type="checkbox" role="button" /> */}
                            <select defaultValue={"createdAt"} className="form-select form-select-lg" onChange={(e)=> this.setOrderBy(e.target.value)}>
                                <option value="expiryDate">Expiry date</option>
                                <option value="name">Name</option>
                                <option selected value="createdAt">Creation date</option>
                            </select>
                            <button className={"btn btn-lg btn-outline " + (this.state.orderDirection == "desc" ? "border-light-subtle": "")} onClick={()=> this.setOrderDirection("desc")}>
                                <Icons.SortDown />
                            </button>
                            <button className={"btn btn-lg btn-outline " + (this.state.orderDirection == "asc" ? "border-light-subtle": "") } onClick={()=> this.setOrderDirection("asc")}>
                                <Icons.SortUp />
                            </button>
                        </div>
                        <div className="d-flex flex-shrink-1"> 
                            <div className='input-group border rounded-1'>
                                <span className='input-group-text bg-light-subtle border-0 ps-2'><Icons.Search/></span>
                                <input type="text" placeholder="Search" className={"form-control form-control-lg ps-1 bg-light-subtle shadow-none border-0"} onKeyUp={(e)=> this.setName(e) } />
                            </div>
                        </div>
                    </div>  
                
                { this.state.isLoading ? <span>Loading...</span> : <> 
                    { this.state.domains == null || this.state.domains.length < 1 ? 
                        <div className="alert alert-info">No domain(s) found</div>:
                        <>
                            <ul className="list-group" key={"domains"}>
                                { this.state.domains.map((domain) => (
                                    <>
                                    <li className="p-3 list-group-item " key={domain.id}>
                                        <Link to={"/"+ domain.name } className="text-truncate text-decoration-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
                                            <div className="d-flex flex-row gap-2 align-items-center">
                                                <img src={avatar} width={42} />
                                                <div className="d-flex flex-column text-truncate align-items-start">
                                                    <h3 className='m-0'>{domain.name}</h3>
                                                    <small className="text-muted">Expires {getExpires(domain.registration?.expiryDate)}</small>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row justify-content-between gap-2">
                                                <span className="badge bg-success-subtle text-success-emphasis">Owner</span>
                                                <Icons.ArrowRightShort />
                                            </div>
                                        </Link>
                                    </li> 
                                    </>
                                )) }  
                            </ul> 
                        </>
                    }
                </>}
            </div>
            </div> 
        </>)
    } 
}

export default MyNames;