import React, { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import styles from "./Admin.module.scss";
import { useContract } from "../../hooks/useContract";
import { StoreContract } from "../../static/contracts/StoreContract";

const Admin = () => {
  const { account, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState(true);
  const [isStoreManager, setIsStoreManager] = useState(false);
  const StoreContractInstance = useContract(StoreContract.address[chainId], StoreContract.abi);

  const fetchPageData = useCallback(async () => {
    const isUserStoreManager = await StoreContractInstance.isStoreManager(account);
    setIsStoreManager(isUserStoreManager);
    setIsLoading(false);
  }, [StoreContractInstance, account]);

  useEffect(() => {
    if (account && StoreContractInstance) {
      fetchPageData();
    }
  }, [account, StoreContractInstance]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  if (!isStoreManager) {
    return (
      <div className={styles.containerNonManager}>
        <p>
          Connected with <span className={styles.address}>{account}</span>
        </p>
        <p>
          In order to access this page you have to be the Store Manager. For demo purposes everyone can become Store
          Manager by clicking the button below.
        </p>
        <button className={styles.makeMeManagerButton}>Make me Store Manager</button>
      </div>
    );
  }

  return <div className={styles.container}>Admin page</div>;
};

export default Admin;
