import { gql } from "@apollo/client";

export const GET_SUBGRAPH_RECORDS = gql`
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
    query Domains( $addr: String, $expiry: BigInt, $orderBy: String, $orderDirection: String, $whereFilter: Domain_filter, $skip: Int, $first: Int) {
        domains ( 
            orderBy: $orderBy
            orderDirection: $orderDirection
            skip: $skip
            first: $first
            where: $whereFilter
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