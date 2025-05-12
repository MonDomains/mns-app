
import Search from "../components/Search";

function Home() { 
    return ( 
        <div className="d-flex flex-column w-100 justify-content-center text-center gap-3 align-items-center">
            <h1 className="display-3 fw-bold text-primary gradient">Create Your Web3 Identity</h1>
            <p className="fs-4 text-secondary">
                Your web3 name. decentralized and built on Monad
            </p>
            <Search size="lg" />
        </div>
     );
}

export default Home;