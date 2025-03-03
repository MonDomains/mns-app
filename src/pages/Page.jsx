import React from "react";
import { Outlet } from "react-router";  

const Page = () => { 
  return (
    <> 
      <div className="container-fluid">
        <Navbar showSearch={true} />
      </div>
    </>
  )
};

export default Page;