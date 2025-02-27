import React from "react";  
import { useAccount } from "wagmi";
import { GET_MY_DOMAINS } from "../graphql/Domain";
import { useQuery } from "@apollo/client";
import { getExpires, getTimeAgo, getTokenId, obscureName } from "../helpers/String";
import moment from "moment";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { Alert } from "react-bootstrap";
import spinner from '../assets/images/spinner.svg';
import { ArrowRightShort } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const Account = () => {
  const { address: owner, isConnected } = useAccount();
  const now = moment().utc().unix();
  const { data, loading, error, refetch } = useQuery(GET_MY_DOMAINS, { variables: { owner, now }, notifyOnNetworkStatusChange: true });
  
  if (!isConnected)
    return ( 
        <Alert key={"warning"} variant={"warning"} className="d-flex flex-row gap-3 w-100 p-4 align-items-center justify-content-center">
          You need to connect wallet first to see your domains. <ConnectWalletButton></ConnectWalletButton>
        </Alert> 
      )
 
  if (error) return <div className="container alert alert-danger"> {error.message} </div>
  return (
    <>   
      <div className="d-flex flex-column gap-3">
          <h2>My Domains</h2> 
          <div className="d-flex flex-column rounded-4 bg-body-tertiary rounded-4 p-3 gap-4 fs-5">
            { loading ? <span>Loading...</span>
          :
            <>
              {data.domains == null || data.domains.length < 1 ? <div className="alert alert-info">No domain(s) found</div>: <></>}
                <ul className="list-group">
                    { data.domains.map((domain) => (
                      <>
                        <li className="list-group-item" key={domain.id}>
                          <NavLink to={"/"+ domain.name } className={"text-decoration-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover d-flex flex-row justify-content-between align-items-center"}>
                            <div className="d-flex flex-row gap-2">
                              <img className="rounded-2" width={64} src={import.meta.env.VITE_APP_METADATA_API + "/temp-image/"+ domain.labelName} alt={domain.name} />
                              <div className="d-flex flex-column">
                              <h3>{obscureName(domain.name, 30)}</h3>
                              <small className="text-muted">Expires {getExpires(domain.expiryDate)}</small>
                              </div>
                            </div>
                            <div className="d-flex flex-row gap-2">
                              <span className="badge bg-success-subtle text-success-emphasis">Owner</span>
                              <div className="d-flex flex-row">
                                <ArrowRightShort />
                              </div> 
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