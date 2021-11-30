import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { Route } from "react-router-dom";
import "./styles/App.scss";
import Layout from "./layouts/Layout";
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/admin" component={Admin} />
      </Layout>
    </Web3ReactProvider>
  );
};

export default App;
