import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { injected } from "../connectors";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import styles from "./Layout.modules.scss";
import UnsupportedNetwork from "../components/UnsupportedNetwork/UnsupportedNetwork";
import Footer from "../components/Footer/Footer";

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
    <div className={styles.pageLayout}>
      {/*
        TODO: change this so info about loading state is passed to header so we hide only connect button on loading and not the whole Header component
      */}
      <Header metamaskLoading={isLoading} />
      <div className={styles.content}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
