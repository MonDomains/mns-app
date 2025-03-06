import { Form } from "react-bootstrap";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import { Outlet } from "react-router";


export default function Home() {
    return (
        <>
            <div className="container-fluid p-0 m-0">
                <Header showSearch={false} /> 
            </div>
            <div className="container-fluid">
                <div className="row" style={ { minHeight: "calc(100vh - 13em)" }}>
                    <Outlet />
                </div>
            </div>
            <div className="container-fluid">
                <Footer />
            </div>
        </>
    )
}