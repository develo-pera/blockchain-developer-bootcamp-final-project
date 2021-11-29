import React from "react";
import { useWeb3React } from "@web3-react/core";
import MMLogo from "../static/metamask-logo.svg";
import { injected } from "../connectors";
import { shortenAddress } from "../utils/shortenAddress";

const MetamaskConnectButton = () => {
  const { activate, active, account, deactivate } = useWeb3React();

  console.log({ activate, active, account, deactivate });

  if (active) {
    return (
      <div>
        <img src={MMLogo} alt="Metamask Logo" />
        <p>{shortenAddress(account)}</p>
        <button onClick={deactivate}>Log Out</button>
      </div>
    );
  }

  return (
    <button onClick={() => activate(injected)}>
      <img src={MMLogo} alt="Metamask Logo" />
      Connect
    </button>
  );
};

export default MetamaskConnectButton;