import React, {useCallback, useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";

import styles from "./Orders.module.scss";
import {useContract} from "../../hooks/useContract";
import {StoreContract} from "../../static/contracts/StoreContract";
import {toast} from "react-toastify";

const Orders = () => {
  const { account, chainId } = useWeb3React();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isStoreManager, setIsStoreManager] = useState(false);
  const [waitingForMakeMeManagerTransaction, setWaitingForMakeMeManagerTransaction] = useState(false);
  const [orders, setOrders] = useState([]);
  const StoreContractInstance = useContract(StoreContract.address[chainId], StoreContract.abi);

  const fetchPageData = useCallback(async () => {
    const isUserStoreManager = await StoreContractInstance.isStoreManager(account);
    setIsStoreManager(isUserStoreManager);
    const redeemEvents = await StoreContractInstance.queryFilter("RedeemItem");
    const orders = [];
    for(let i = 0; i < redeemEvents.length; i++) {
      const order = {
        productId: redeemEvents[i].args.itemId.toString(),
        redeemer: redeemEvents[i].args.redeemer,
        sku: redeemEvents[i].args.orderDetails.sku,
        shippingAddress: {
          street: redeemEvents[i].args.orderDetails.shippingAddress.street,
          city: redeemEvents[i].args.orderDetails.shippingAddress.city,
          zipCode: redeemEvents[i].args.orderDetails.shippingAddress.zipCode,
          country: redeemEvents[i].args.orderDetails.shippingAddress.country,
        },
      }
      orders.push(order);
    }
    setOrders(orders)
    setIsPageLoading(false);
  }, [StoreContractInstance]);

  useEffect(() => {
    if (StoreContractInstance) {
      fetchPageData();
    }
  }, [StoreContractInstance]);


  const makeMeStoreManager = async () => {
    try {
      const transaction = await StoreContractInstance?.makeMeStoreManager();
      setWaitingForMakeMeManagerTransaction(true);
      await transaction.wait(1);
      setWaitingForMakeMeManagerTransaction(false);
    } catch (e) {
      toast.error(e.message, {
        position: "bottom-right",
      });
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

  if (!orders.length) {
    return <div className={styles.wrapperFlex}>No orders to display. Please buy and then redeem some products to see orders on this page.</div>;
  }

  return (
    <div className={styles.container}>
      {orders.map((order, i) => (
        <div key={i} className={styles.orderCard}>
          <p className={styles.addressWrapper}><span className={styles.label}>Redeemer:</span> {order.redeemer}</p>
          <p><span className={styles.label}>Product id:</span> {order.productId}</p>
          <p><span className={styles.label}>Product SKU:</span> {order.sku}</p>
          <p><span className={styles.label}>Address:</span> {order.shippingAddress.street}</p>
          <p><span className={styles.label}>City:</span> {order.shippingAddress.city}</p>
          <p><span className={styles.label}>ZipCode:</span> {order.shippingAddress.zipCode}</p>
          <p><span className={styles.label}>Country:</span> {order.shippingAddress.country}</p>
        </div>
      ))}
    </div>
  )
}

export default Orders;
