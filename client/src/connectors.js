import { InjectedConnector } from "@web3-react/injected-connector";

export const ChainId = {
  Mainnet: 1,
  Ropsten: 3,
  Rinkeby: 4,
  Goerli: 5,
  Kovan: 42,
  Localhost: 1337,
};

export const injected = new InjectedConnector({ supportedChainIds: [ChainId.Localhost, ChainId.Kovan] });
