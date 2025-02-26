import Footer from "../partials/Footer";
import Header from "../partials/Header";
import { Outlet } from "react-router-dom";

export default function Page() {
    return (
        <div>
            <div className="container-fluid p-0 m-0">
                <Header /> 
            </div>
            <div className='container p-5'>  
                <div className="row">
                    <Outlet />
                </div>
            </div>
            <div className="container-fluid mt-5">
                <Footer />
            </div>
        </div>
    )
}