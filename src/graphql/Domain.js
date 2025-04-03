import { gql } from "@apollo/client";

export const GET_SUBGRAPH_RECORDS = `
query getSubgraphRecords($id: String!) {  
    domain(id: $id) {
        name    
        isMigrated    
        createdAt    
        resolver {      
            texts      
            coinTypes    
        }    
        id  
    }
}
`;

export const GET_DOMAIN = gql`
    query Domains( $name: String ) {
        domains ( 
            first: 1
            where: {
                name: $name
            }
        )
        {
            id
            name
            labelName
            labelhash
            owner {
                id
            }
            wrappedOwner {
                id
            }
            registrant {
                id
            }
            registration {
                registrationDate
                expiryDate
            }
            createdAt
        }
    }
`;

export const GET_MY_DOMAINS = gql`
    query Domains( $addr: String, $expiry:BigInt, $skip: Int, $first: Int) {
        domains ( 
            orderBy: createdAt
            orderDirection: desc
            skip: $skip
            first: $first
            where:  {
                and: [
                    {
                        or: [ 
                            {
                                registrant: $addr
                            },
                            {
                                wrappedOwner: $addr
                            }
                        ]
                    },
                    {  ## addr reverse node
                        parent_not: "0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2"
                    },
                    {
                        or: [
                            {
                                expiryDate_gt: $expiry
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
        )
        {
            ...DomainDetails    
            registration {
                ...RegistrationDetails  
            }
            wrappedDomain {
                ...WrappedDomainDetails
            } 
        }
    }

    fragment DomainDetails on Domain {
        ...DomainDetailsWithoutParent
        parent {
            name    
            id  
        }
    }  

    fragment DomainDetailsWithoutParent on Domain {
        id
        labelName
        labelhash
        name
        isMigrated
        createdAt
        resolvedAddress {
            id
        }
        owner {
            id
        }
        registrant {
            id
        }
        wrappedOwner {
            id
        }
    }  

    fragment RegistrationDetails on Registration {
        registrationDate
        expiryDate
    }

    fragment WrappedDomainDetails on WrappedDomain { 
        expiryDate
        fuses
    }

`;