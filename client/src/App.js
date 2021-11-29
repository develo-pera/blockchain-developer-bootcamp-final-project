import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import Layout from "./layouts/layout";

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Route exact path="/" component={Home} />
      </Layout>
    </Web3ReactProvider>
  );
};

export default App;
