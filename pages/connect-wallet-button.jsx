import React, { useState } from "react";

import Web3 from "web3";

function ConnectWalletButton({ setAddress3 }) {
  const [chainId, setChainId] = useState("0x13881"); // default to Ethereum mainnet

  async function handleClick() {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask not installed or enabled");
      }

      const provider = window.ethereum;
      await provider.request({ method: "eth_requestAccounts" });

      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();

      if (networkId.toString() !== chainId) {
        // Switch network if not already connected to the selected network
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainId }],
        });
      }

      const accounts = await web3.eth.getAccounts();
      setAddress3(accounts[0]);
    } catch (error) {
      console.error(error);
      alert(
        "Please install and connect to an Ethereum wallet that supports the Ethereum Provider API."
      );
    }
  }

  function handleNetworkChange(event) {
    setChainId(event.target.value);
  }

  return (
    <div className="wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "1em",
          fontFamily: "monospace",
        }}
      >
        <p>Choose a network:</p>
        <div>
          <select value={chainId} onChange={handleNetworkChange}>
            <option value="0x1">Ethereum</option>
            <option value="0x5">Eth Goerli</option>
            <option value="0xaa36a7">Eth Sepolia</option>
            <option value="0x38">Bsc</option>
            <option value="0x61">Bsc testnet</option>
            <option value="0x89">Polygon</option>
            <option value="0x13881">Polygon mumbai</option>
            <option value="0x44d">Polygon zkEVM</option>
            <option value="0xa">Optimism</option>
            <option value="0x1a4">Optimism Goerli</option>
            <option value="0xA4B1">Arbitrum</option>
            <option value="0x66eed">Arbitrum Goerli</option>
          </select>
          <button
            onClick={handleClick}
            style={{
              color: "#0acaa6e6",
              fontFamily: "monospace",
              fontSize: "1.4em",
              fontWeight: "bold",
              backgroundColor: "transparent",
            }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectWalletButton;
