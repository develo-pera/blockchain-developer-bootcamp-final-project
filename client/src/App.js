import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { Route } from "react-router-dom";
import "./styles/App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layouts/Layout";
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
import Redeem from "./pages/Redeem/Redeem";

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/admin" component={Admin} />
        <Route path="/redeem/:id" component={Redeem} />
      </Layout>
      <ToastContainer />
    </Web3ReactProvider>
  );
};

export default App;
