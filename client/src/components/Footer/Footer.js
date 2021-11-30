import React from "react";

import styles from "./Footer.modules.scss";

const Footer = () => (
  <div className={styles.footer}>
    &copy; dCommerce | Made by{" "}
    <a
      href="https://github.com/develo-pera/blockchain-developer-bootcamp-final-project"
      target="_blank"
      rel="noopener noreferrer"
    >
      @developera
    </a>
    <br />
    Final Project for Consensys Blockchain Bootcamp 2021
  </div>
);

export default Footer;
