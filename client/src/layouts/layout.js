import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { injected } from "../connectors";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import UnsupportedNetwork from "../components/UnsupportedNetwork/UnsupportedNetwork";

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { activate, error } = useWeb3React();

  useEffect(() => {
    setIsLoading(true);
    injected.isAuthorized().then(async (authorized) => {
      if (authorized) {
        await activate(injected);
      }
      setIsLoading(false);
    });
  }, []);

  if (error && error.constructor === UnsupportedChainIdError) {
    return <UnsupportedNetwork />;
  }

  return (
    <>
      {/*
        TODO: change this so info about loading state is passed to header so we hide only connect button on loading and not the whole Header component
      */}
      {!isLoading && <Header />}
      {children}
    </>
  );
};

export default Layout;
