import { ToastContainer } from "react-toastify";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import { Outlet } from "react-router-dom";
import {Alert} from "react-bootstrap";


export default function Home() {
    return (
        <div>
            <main>
            <Header />
            <Alert key={"warning"} variant={"warning"} className="text-center">
                This is a <b>TEST</b> version. You are using Monad Name Service on <b>Monad Testnet</b>. 
            </Alert>
            <section>
                <div className='container-fluid'>  
                <Outlet />
                </div>
            </section>
            <Footer/>
            </main>
            
        </div>
    )
}