import Footer from "../partials/Footer";
import Header from "../partials/Header";
import { Outlet } from "react-router";

export default function Page() {
    return (
        <div>
            <div className="container-fluid p-0 m-0">
                <Header showSearch={true}/> 
            </div>
            <div className='container align-items-center mt-lg-5 p-4 p-lg-0' style={ { maxWidth:980 }}>  
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