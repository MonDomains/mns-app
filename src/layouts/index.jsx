import Footer from "../partials/Footer";
import Header from "../partials/Header";
import { Outlet } from "react-router";
import TopAlert from "../partials/TopAlert";

export default function Index() {
    return (
        <>
            <TopAlert /> 
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