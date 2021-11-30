import React from "react";
import { useWeb3React } from "@web3-react/core";
import MMLogo from "../../static/metamask-logo.svg";
import { injected } from "../../connectors";
import { shortenAddress } from "../../utils/shortenAddress";
import styles from "./NavigationControls.module.scss";

const NavigationControls = () => {
  const { activate, active, account, deactivate } = useWeb3React();

  console.log({ activate, active, account, deactivate });

  if (active) {
    return (
      <div className={styles.controls}>
        <p>{shortenAddress(account)}</p>
        <button onClick={deactivate}>Log Out</button>
      </div>
    );
  }

  return (
    <button className={styles.connectButton} onClick={() => activate(injected)}>
      <img className={styles.metamaskLogo} src={MMLogo} alt="Metamask Logo" />
      Connect
    </button>
  );
};

export default NavigationControls;
