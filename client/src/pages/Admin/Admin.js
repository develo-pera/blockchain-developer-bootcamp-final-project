import React, { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import styles from "./Admin.module.scss";
import { useContract } from "../../hooks/useContract";
import { StoreContract } from "../../static/contracts/StoreContract";

const Admin = () => {
  const { account, chainId } = useWeb3React();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isStoreManager, setIsStoreManager] = useState(false);
  const [waitingForMakeMeManagerTransaction, setWaitingForMakeMeManagerTransaction] = useState(false);
  const StoreContractInstance = useContract(StoreContract.address[chainId], StoreContract.abi);

  const fetchPageData = useCallback(async () => {
    const isUserStoreManager = await StoreContractInstance.isStoreManager(account);
    setIsStoreManager(isUserStoreManager);
    setIsPageLoading(false);
  }, [StoreContractInstance, account]);

  useEffect(() => {
    if (account && StoreContractInstance) {
      fetchPageData();
    }
  }, [account, StoreContractInstance]);

  const makeMeStoreManager = async () => {
    try {
      const transaction = await StoreContractInstance?.makeMeStoreManager();
      setWaitingForMakeMeManagerTransaction(true);
      await transaction.wait(1);
      setWaitingForMakeMeManagerTransaction(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (isPageLoading) {
    return <div className={styles.wrapperFlex}>Loading....</div>;
  }

  if (!isStoreManager) {
    return (
      <div className={styles.wrapperFlex}>
        <div className={styles.containerNonManager}>
          <p>
            Connected with <span className={styles.address}>{account}</span>
          </p>
          <p>
            In order to access this page you have to be the Store Manager. For demo purposes everyone can become Store
            Manager by clicking the button below.
          </p>
          <button
            disabled={waitingForMakeMeManagerTransaction}
            className={styles.makeMeManagerButton}
            onClick={makeMeStoreManager}
          >
            {waitingForMakeMeManagerTransaction ? "Waiting for transaction" : "Make me Store Manager"}
          </button>
        </div>
      </div>
    );
  }

  return <div className={styles.container}>Admin page</div>;
};

export default Admin;
