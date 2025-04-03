import React, { useState } from "react";  
import { useAccount } from "wagmi";
import { GET_MY_DOMAINS } from "../graphql/Domain";
import { useQuery } from "@apollo/client";
import { getExpires } from "../helpers/String";
import moment from "moment";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { Alert, Spinner } from "react-bootstrap";
import { ArrowRightShort } from "react-bootstrap-icons";
import { NavLink } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Account = () => {
  const { address: addr, isConnected } = useAccount();
  const expiry = moment().utc().unix();
  const first = 10;
  const [page, setPage] = useState(0);
  const [skip, setSkip] = useState(0);
  
  const { data, loading, error, refetch } = useQuery(GET_MY_DOMAINS, { variables: {  addr: addr?.toLocaleLowerCase(), expiry, skip, first }, notifyOnNetworkStatusChange: true });
  
  
  if (!isConnected)
    return ( 
        <Alert key={"warning"} variant={"warning"} className="d-flex flex-column flex-lg-row gap-3 w-100 p-4 align-items-center justify-content-center">
          You need to connect wallet first to see your domains. <ConnectWalletButton></ConnectWalletButton>
        </Alert> 
      )
 
  if (error) return <div className="container alert alert-danger"> {error.message} </div>
  
  return (
    <>   
      <div className="d-flex flex-column gap-3 p-0">
          <h2>My Domains</h2>
          <div className="d-flex flex-column bg-body-tertiary border border-light-subtle rounded-2 p-2 gap-4 fs-5">
            { loading ? <span>Loading...</span>
          :
            <>
                {data.domains == null || data.domains.length < 1 ? 
                  <div className="alert alert-info">No domain(s) found</div>: 
                  
                  <>

                  <ul className="list-group">
                    { data.domains.map((domain) => (
                      <>
                        <li className="p-3 list-group-item " key={domain.id}>
                          <NavLink to={"/"+ domain.name } className="text-truncate text-decoration-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
                            <div className="d-flex flex-row gap-2 ">
                              
                              <div className="d-flex flex-column text-truncate">
                                <h3>{domain.name}</h3>
                                <small className="text-muted">Expires {getExpires(domain.registration?.expiryDate)}</small>
                              </div>
                            </div>
                            <div className="d-flex flex-row justify-content-between gap-2">
                              <span className="badge bg-success-subtle text-success-emphasis">Owner</span>
                                <ArrowRightShort />
                            </div>
                          </NavLink>
                        </li> 
                      </>
                      )) 
                    }  
                </ul> 

                <div className="d-flex flex-row justify-content-between gap-3">
                  <button onClick={() => {
                    let p = page > 1 ? parseInt(page) - 1 : 0;
                    let s = p * parseInt(first);
                    setPage(p);
                    setSkip(s) 
                    refetch() 
                  }} className="btn btn-default">{"<"} Prev</button>
                  <button onClick={() => {
                    let p = parseInt(page) + 1;
                    let s = p * parseInt(first);
                    setPage(p);
                    setSkip(s) 
                    refetch() 
                  }} className="btn btn-default">Next {">"}</button>
                  </div>
                  </>
                }
 
                
            </>
          }
          </div>
      </div> 
    </>
  )
};

export default Account;