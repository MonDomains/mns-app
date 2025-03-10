import React from "react";  
import { useAccount } from "wagmi";
import { GET_MY_DOMAINS } from "../graphql/Domain";
import { useQuery } from "@apollo/client";
import { getExpires, getTimeAgo, getTokenId, obscureName } from "../helpers/String";
import moment from "moment";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { Alert, Spinner } from "react-bootstrap";
import spinner from '../assets/images/spinner.svg';
import { ArrowRightShort } from "react-bootstrap-icons";
import { NavLink } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Account = () => {
  const { address: owner, isConnected } = useAccount();
  const now = moment().utc().unix();
  const { data, loading, error, refetch } = useQuery(GET_MY_DOMAINS, { variables: { owner, now }, notifyOnNetworkStatusChange: true });
  
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
              {data.domains == null || data.domains.length < 1 ? <div className="alert alert-info">No domain(s) found</div>: <></>}
                <ul className="list-group">
                    { data.domains.map((domain) => (
                      <>
                        <li className="p-2 list-group-item " key={domain.id}>
                          <NavLink to={"/"+ domain.name } className="text-truncate text-decoration-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
                            <div className="d-flex flex-row gap-2 ">
                              <LazyLoadImage 
                                  src={import.meta.env.VITE_APP_METADATA_API + "/temp-image/"+ domain.labelName}
                                  width={64}
                                  alt={domain.name}
                                  placeholder={<Spinner />}
                                  className="rounded-2"
                              />
                              <div className="d-flex flex-column text-truncate">
                                <h3>{domain.name}</h3>
                                <small className="text-muted">Expires {getExpires(domain.expiryDate)}</small>
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
            </>
          }
          </div>
      </div> 
    </>
  )
};

export default Account;