import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import styles from "./Redeem.module.scss";
import { useContract } from "../../hooks/useContract";
import { StoreContract } from "../../static/contracts/StoreContract";
import { DCommerceContract } from "../../static/contracts/DCommerceContract";
import { toast } from "react-toastify";

const Redeem = () => {
  const params = useParams();
  const { account, chainId } = useWeb3React();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [product, setProduct] = useState(true);
  const [copiesOwnedByUser, setCopiesOwnedByUser] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [waitingForTransaction, setWaitingForTransaction] = useState(false);
  const [waitingForRedeemTransaction, setWaitingForRedeemTransaction] = useState(false);
  const StoreContractInstance = useContract(StoreContract.address[chainId], StoreContract.abi);
  const DCommerceContractInstance = useContract(DCommerceContract.address[chainId], DCommerceContract.abi);

  const fetchPageData = useCallback(async () => {
    const productId = params.id;
    const resp = await fetch(`https://${process.env.RAZZLE_DCOMMERCE_BASE_URL}/${productId}.json`);
    const metadata = await resp.json();
    const priceInWei = await StoreContractInstance.itemPrice(productId);
    const priceEther = Number(ethers.utils.formatEther(priceInWei));
    const productData = {
      id: productId,
      ...metadata,
      priceInWei,
      priceEther,
    };
    const userBalance = await DCommerceContractInstance.balanceOf(account, productId);
    const isApprovedAlready = await DCommerceContractInstance.isApprovedForAll(account, StoreContractInstance.address);

    setIsApproved(isApprovedAlready);
    setProduct(productData);
    setCopiesOwnedByUser(userBalance.toNumber());
    setIsPageLoading(false);
  }, [StoreContractInstance]);

  useEffect(() => {
    if (StoreContractInstance) {
      fetchPageData();
    }
  }, [StoreContractInstance]);

  const setStoreAsOperator = async () => {
    try {
      setWaitingForTransaction(true);
      const transaction = await DCommerceContractInstance.setApprovalForAll(StoreContractInstance.address, true);
      await transaction.wait(1);
      const isApproved = await DCommerceContractInstance.isApprovedForAll(account, StoreContractInstance.address);

      setWaitingForTransaction(false);
      toast.success("Approval successful", { position: "bottom-right" });
      setIsApproved(isApproved);
    } catch (e) {
      setWaitingForTransaction(false);
      toast.error(e.message, { position: "bottom-right" });
    }
  };

  const redeemItem = () => console.log("redeem");

  const onButtonClick = isApproved ? redeemItem : setStoreAsOperator;

  if (isPageLoading) {
    return <div className={styles.wrapperFlex}>Fetching product....</div>;
  }

  if (!copiesOwnedByUser) {
    return (
      <div className={styles.wrapperFlex}>
        You don't own any copy of this product so there's nothing to redeem.
        <br />
        Go to home page and buy one.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <img src={product.image} alt="Product image" />
      <p className={styles.productName}>{product.name}</p>
      <p className={styles.productDescription}>{product.description}</p>
      <p className={styles.disclaimer}>
        {isApproved
          ? `You own ${copiesOwnedByUser} out of ${product.stock} copies. Would you like to redeem one now?`
          : `Before you can redeem you have to approve. You have to do this only once`}
      </p>
      <button onClick={onButtonClick} className={styles.redeemButton}>
        {isApproved
          ? waitingForRedeemTransaction
            ? "Redeeming..."
            : "Redeem"
          : waitingForTransaction
          ? "Approving..."
          : "Approve"}
      </button>
    </div>
  );
};

export default Redeem;
