import { EnsPlugin, EnsResolver, ethers, MulticoinProviderPlugin, Network, NetworkPlugin } from "ethers";
import { mnsRegistry, NODE_PROVIDER_URL, publicResolver } from "../config";
import { Component } from "react";
import { monadTestnet } from "viem/chains";


class MnsEthers extends Component {
    constructor(props) { 
        super(props); 
        this.state = {
            resolving: false,
            name: "",
            address: ""
        }
    }

    async resolverName () {
        this.setState({ resolving: true });

         
        const mnsRegistry = "0x6442eC5c3CCDaF112d6B78F9189cD111d516fE1E"; // MNS registry on Monad Testnet. 
        const network = new Network("Monad Testnet", 10143);
        const plugin = new EnsPlugin(mnsRegistry, network.chainId);
        network.attachPlugin(plugin);
        const provider = new ethers.JsonRpcProvider(NODE_PROVIDER_URL, network);
        const address = await provider.resolveName("0xalice.mon");
        
        console.log(address);
            
        
        //console.log(ensAddress)
        //const resolver = new EnsResolver(provider, publicResolver, "0xramazan.mon");
        //const address = await resolver.getAddress();
        const name = await provider.lookupAddress("0xd1b3Cf4B18D061EAF28ea7ad91bC01E43598e252")
        console.log("name: "+ name);

        //const resolver = await provider.getResolver("0xramazan.mon");
        //console.log(resolver)
        //const address = await provider.resolveName("0xramazan.mon");
        
        this.setState({ resolving: false, address, name })
    }

    componentDidMount() {
        this.resolverName();
    }
    
    render () {
        return (<>
            {this.state.resolving ? <> Resolving... </>: this.state.address }
            <br></br>
            {this.state.resolving ? <> Resolving... </>: this.state.name }
        </>)
    }
}

export default MnsEthers;