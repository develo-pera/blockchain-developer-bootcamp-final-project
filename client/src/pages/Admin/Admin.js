import React, { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import fleekStorage from "@fleekhq/fleek-storage-js";

import styles from "./Admin.module.scss";
import { useContract } from "../../hooks/useContract";
import { StoreContract } from "../../static/contracts/StoreContract";

const Admin = () => {
  const { account, chainId } = useWeb3React();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isStoreManager, setIsStoreManager] = useState(false);
  const [productImage, setProductImage] = useState();
  const [formData, setFormData] = useState({
    name: null,
    description: null,
    price: null,
    stock: null,
  });
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

  const changeImageHandler = async (event) => {
    setProductImage(event.target.files[0]);
  };

  const handleFormChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Really poor validation just to have some
    let nonValid = false;
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        toast.error(`${key} cannot be empty`);
        nonValid = true;
      }
    });
    if (!productImage) {
      toast.error(`product image cannot be empty`);
      nonValid = true;
    }
    if (nonValid) return;

    const nextStoreProductId = await StoreContractInstance.getNewItemId();
    const productId = nextStoreProductId.toString();

    const productImageArrayBuffer = await productImage.arrayBuffer();
    const productImageUint8Array = new Uint8Array(productImageArrayBuffer);

    const uploadedFile = await fleekStorage.upload({
      apiKey: process.env.RAZZLE_FLEEK_API_KEY,
      apiSecret: process.env.RAZZLE_FLEEK_API_SECRET,
      key: `${productId}.jpg`,
      data: productImageUint8Array,
      httpUploadProgressCallback: (event) => {
        console.log(Math.round((event.loaded / event.total) * 100) + "% done");
      },
    });

    const productMetadata = JSON.stringify({
      name: formData.name,
      description: formData.description,
      stock: formData.stock,
      image: uploadedFile.publicUrl,
    });

    const uploadedMetadata = await fleekStorage.upload({
      apiKey: process.env.RAZZLE_FLEEK_API_KEY,
      apiSecret: process.env.RAZZLE_FLEEK_API_SECRET,
      key: `${productId}.json`,
      data: productMetadata,
      httpUploadProgressCallback: (event) => {
        console.log(Math.round((event.loaded / event.total) * 100) + "% done");
      },
    });

    console.log(uploadedMetadata);
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Add new product</p>
      <p className={styles.label}>Product name</p>
      <input type="text" value={formData["name"]} onChange={(e) => handleFormChange(e, "name")} />
      <p className={styles.label}>Product Image</p>
      <input type="file" name="file" onChange={changeImageHandler} />
      <p className={styles.label}>Product description</p>
      <input type="text" value={formData["description"]} onChange={(e) => handleFormChange(e, "description")} />
      <p className={styles.label}>Price in ETH</p>
      <input type="number" min={0} value={formData["price"]} onChange={(e) => handleFormChange(e, "price")} />
      <p className={styles.label}>Stock</p>
      <input type="number" min={0} value={formData["stock"]} onChange={(e) => handleFormChange(e, "stock")} />
      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit
      </button>
    </div>
  );
};

export default Admin;
