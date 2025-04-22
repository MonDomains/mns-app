
import './App.scss';
import './assets/styles/style.css';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Notfound from "./pages/Notfound";
import Register from "./pages/Register";
import Name from "./pages/Name";
import Names from "./pages/Names";
import { Web3Modal } from './components/Web3Modal';
import Layouts from "./layouts";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./config" 
import Address from './pages/Address';


export default function App() {
  return ( 
        <Web3Modal>
          <ApolloProvider client={apolloClient}>
            <BrowserRouter forceRefresh={true}>
                  <Routes>  
                    <Route path='/' element={<Layouts.Home />}>
                      <Route index element={<Home />}  />
                    </Route>
                    <Route path="/" element={<Layouts.Page />}>
                      <Route path="/account" element={<Names />} />
                      <Route path="/names" element={<Names />} />
                      <Route path="/address/:address" element={<Address />} />
                      <Route path="/:name.mon" element={<Name />} />
                      <Route path="/register/:name.mon" element={<Register />} />
                      <Route path="/404" element={<Notfound />} />  
                      <Route path="*" element={<Navigate replace={true} to="/404" />} />
                    </Route>
                  </Routes> 
            </BrowserRouter>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} theme="light"></ToastContainer>
          </ApolloProvider>
        </Web3Modal> 
  );
};
