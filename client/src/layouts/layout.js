import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import {injected} from "../connectors";
import { useWeb3React} from "@web3-react/core";

const Layout = ({children}) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const { activate, error } = useWeb3React();

  useEffect(() => {
    setIsLoading(true);
    injected.isAuthorized().then(async (authorized) => {
      if (authorized) {
        await activate(injected);
      }
      setIsLoading(false);
    })
  }, []);

  return (
    <>
      {!isLoading && <Header/>}
      {children}
    </>
  )
};

export default Layout;
