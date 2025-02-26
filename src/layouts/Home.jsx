import { Form } from "react-bootstrap";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import { Outlet } from "react-router-dom";


export default function Home() {
    return (
        <>
            <div className="container-fluid p-0 m-0">
                <Header /> 
            </div>
            <div className="container-fluid">
                <div className="row" style={ { height: 500 }}>
                    <Outlet />
                </div>
            </div>
            <div className="container-fluid fixed-bottom">
                <Footer />
            </div>
        </>
    )
}