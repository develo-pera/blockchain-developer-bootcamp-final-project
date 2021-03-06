import React, { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";
import { useContract } from "../../hooks/useContract";
import { StoreContract } from "../../static/contracts/StoreContract";

const Home = () => {
  const { active, chainId } = useWeb3React();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const StoreContractInstance = useContract(StoreContract.address[chainId], StoreContract.abi);

  const fetchPageData = useCallback(async () => {
    const nextProductId = await StoreContractInstance.getNewItemId();
    const products = [];
    for (let i = 1; i < nextProductId; i++) {
      const resp = await fetch(`https://${process.env.RAZZLE_DCOMMERCE_BASE_URL}/${i}.json`);
      const metadata = await resp.json();
      const priceInWei = await StoreContractInstance.itemPrice(i);
      const priceEther = Number(ethers.utils.formatEther(priceInWei));
      const productData = {
        id: i,
        ...metadata,
        priceInWei,
        priceEther,
      };
      products.push(productData);
    }
    setProductList(products);
    setIsPageLoading(false);
  }, [StoreContractInstance]);

  useEffect(() => {
    if (StoreContractInstance && !productList.length) {
      fetchPageData();
    }
  }, [StoreContractInstance]);

  const handleBuyClick = async (id, priceInWei) => {
    try {
      const transaction = await StoreContractInstance.buyItems(id, 1, { value: priceInWei });
      await transaction.wait(1);
      toast.success("Purchase successful", { position: "bottom-right" });
    } catch (e) {
      toast.error(e.message, { position: "bottom-right" });
    }
  };

  if (!active) {
    return <div className={styles.wrapperFlex}>Please connect with your Metamask to continue</div>;
  }

  if (isPageLoading) {
    return <div className={styles.wrapperFlex}>Fetching products....</div>;
  }

  if (!productList.length) {
    return (
      <div className={styles.wrapperFlex}>
        <p>No products added. Go to Admin page and add some.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.productsGrid}>
        {productList.map((product, i) => (
          <div key={i}>
            <img src={product.image} alt="Product image" />
            <p className={styles.productName}>{product.name}</p>
            <p className={styles.productDescription}>{product.description}</p>
            <p className={styles.productPrice}>{product.priceEther} ETH</p>
            <button className={styles.buyButton} onClick={() => handleBuyClick(product.id, product.priceInWei)}>
              Buy item
            </button>
            <Link to={`/redeem/${product.id}`}>
              <button className={styles.redeemButton}>Redeem item</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
