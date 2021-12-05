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
  const INITIAL_FORM_DATA = {
    street: "",
    city: "",
    zipCode: "",
    country: "",
  };

  const params = useParams();
  const { account, chainId } = useWeb3React();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [product, setProduct] = useState(true);
  const [copiesOwnedByUser, setCopiesOwnedByUser] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [waitingForTransaction, setWaitingForTransaction] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
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

  const handleFormChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const redeemItem = async () => {
    // Really poor validation just to have some
    let nonValid = false;
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        toast.error(`${key} cannot be empty`, { position: "bottom-right" });
        nonValid = true;
      }
    });
    if (nonValid) return;

    try {
      setWaitingForRedeemTransaction(true);
      const productId = params.id;
      const orderDetails = {
        sku: `SKU-${productId}`,
        shippingAddress: formData,
      }

      const redeemTransaction = await StoreContractInstance.redeemItem(productId, orderDetails);
      await redeemTransaction.wait(1);

      setFormData(INITIAL_FORM_DATA);
      toast.success("Redeeming successful", {position: "bottom-right"})
    } catch (e) {
      setWaitingForRedeemTransaction(false);
      toast.error(e.message, { position: "bottom-right" });
    }
  };

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
      {
        isApproved &&
          <div className={styles.form}>
            <p className={styles.formTitle}>Enter shipping details:</p>
            <p className={styles.label}>Street</p>
            <input type="text" value={formData["street"]} onChange={(e) => handleFormChange(e, "street")} />
            <p className={styles.label}>City</p>
            <input type="text" value={formData["city"]} onChange={(e) => handleFormChange(e, "city")} />
            <p className={styles.label}>Zip code</p>
            <input type="text" value={formData["zipCode"]} onChange={(e) => handleFormChange(e, "zipCode")} />
            <p className={styles.label}>Country</p>
            <input type="text" value={formData["country"]} onChange={(e) => handleFormChange(e, "country")} />
          </div>
      }
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
