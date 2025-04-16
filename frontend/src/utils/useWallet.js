import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { CoinbaseWalletConnector } from "@web3-react/coinbase-wallet-connector";

// Supported wallet connectors
const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
const walletconnect = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/ff29d1f94aef4776a8998993be732800",
  },
  qrcode: true,
});
const coinbaseWallet = new CoinbaseWalletConnector({
  url: "https://mainnet.infura.io/v3/ff29d1f94aef4776a8998993be732800",
  appName: "etherStore",
});

export const useWallet = () => {
  const { activate, deactivate, active, account, library } = useWeb3React();
  const [connectionErr, setError] = useState(null);

  const connectMetaMask = async () => {
    try {
      await activate(injected);
    } catch (err) {
      setError(err);
    }
  };

  const connectWalletConnect = async () => {
    try {
      await activate(walletconnect);
    } catch (err) {
      setError(err);
    }
  };

  const connectCoinbaseWallet = async () => {
    try {
      await activate(coinbaseWallet);
    } catch (err) {
      setError(err);
    }
  };

  const disconnect = () => {
    deactivate();
  };

  return {
    connectMetaMask,
    connectWalletConnect,
    connectCoinbaseWallet,
    disconnect,
    account,
    active,
    library,
    connectionErr,
  };
};
