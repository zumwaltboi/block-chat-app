import { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import {
  getTransactions,
  getTransactions2,
  getTransactions3,
  getTransactions4,
  getTransactions5,
  getTransactions6,
  getTransactions7,
} from "../lib/eth";
import styles from "./styles.module.css";
import Head from "next/head";

export default function Home() {
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [colors, setColors] = useState({});
  const [network, setNetwork] = useState("mainnet");

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const fetchTransactions = async () => {
    try {
      let transactions;
      switch (network) {
        case "mainnet":
          transactions = await getTransactions(address);
          break;
        case "goerli":
          transactions = await getTransactions2(address);
          break;
        case "sepolia":
          transactions = await getTransactions3(address);
          break;
        case "bsc":
          transactions = await getTransactions4(address);
          break;
        case "bsc-testnet":
          transactions = await getTransactions5(address);
          break;
        case "polygon":
          transactions = await getTransactions6(address);
          break;
        case "polygon-testnet":
          transactions = await getTransactions7(address);
          break;
        default:
          throw new Error(`Invalid network: ${network}`);
      }

      const formattedTransactions = transactions.map((transaction) => {
        let timestamp = "Invalid Date";
        if (typeof transaction.inputData === "string") {
          const date = new Date(transaction.timestamp);
          if (!isNaN(date)) {
            timestamp = date.toLocaleString();
          }
        }
        return { ...transaction, timestamp };
      });

      setTransactions(formattedTransactions);
      setColors({});
      window.scrollTo(0, 0); // scroll to top of page
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchTransactions();
  };

  const handleAddressClick = async (event, sender) => {
    event.preventDefault();
    setAddress(sender);
    await fetchTransactions();
  };

  const getColor = (sender) => {
    if (!colors[sender]) {
      const colorsArray = [
        "#282c33ff", // dark grey
        "#0d1c15", // dark green
        "#11202D", // dark blue
        "#1d215e", // sea green
        "#621B00", // seal brown
        "#123344", // cerulean
      ];
      const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
      setColors((prevColors) => ({ ...prevColors, [sender]: color }));
    }

    return colors[sender];
  };

  const handleNetworkChange = (event) => {
    const selectedNetwork = event.target.value;
    setNetwork(selectedNetwork);
    console.log("Selected network:", selectedNetwork);
  };

  const example = "0xb66cd966670d962C227B3EABA30a872DbFb995db";

  return (
    <div>
      <Head>
        <title>BlockChat</title>

        <meta
          name="keywords"
          content="blockchain, Ethereum, chat, decentralized"
        />
        <meta name="og:author" content="user137" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <meta property="og:title" content="BlockChat" />
        <meta
          property="og:description"
          content="Uncover the full story behind blockchain transaction's messages with our app. Switch between Ethereum, Polygon, BSC, and testnets to research with ease and create  content by sharing your findings."
        />
        <meta
          property="og:image"
          content="https://blockchat.auditutils.com/blockchat-logo-300-V02.5.png"
        />
        <meta property="og:url" content="https://blockchat.auditutils.com" />
        <meta property="og:type" content="website" />
      </Head>
      <div className={styles.container}>
        <div
          className={styles.header}
          style={{ display: "flex", alignItems: "center" }}
        >
          <a
            style={{
              textAlign: "center",
              flex: 1,
              alignItems: "center",
              marginBottom: "30px",
            }}
            href="https://blockchat.auditutils.com/"
          >
            <img
              style={{
                maxWidth: "120px",
                margin: "0px",
                padding: "0px",
                textAlign: "center",
                flex: 1,
                alignItems: "center",
              }}
              src="blockchat-logo-300-V02.5.png"
              alt="blockchat logo"
            />
          </a>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            <p>
              Enter an Ethereum address for viewing messages it sent and
              receive:
            </p>

            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className={styles.inputText}
              placeholder="0x..."
            />
            <select
              value={network}
              onChange={handleNetworkChange}
              className={styles.networkSelect}
            >
              <option value="mainnet">Ethereum</option>
              <option value="goerli">Goerli testnet</option>
              <option value="sepolia">Sepolia testnet</option>
              <option value="bsc">Bsc</option>
              <option value="bsc-testnet">Bsc testnet</option>
              <option value="polygon">Polygon</option>
              <option value="polygon-testnet">Polygon testnet</option>
            </select>
          </label>

          <button type="submit" className={styles.submitButton}>
            Load chat history
          </button>
        </form>
        {transactions.length > 0 && (
          <div className={styles.conversation}>
            <h2 style={{ color: "#fff" }}>Conversation:</h2>
            <ListGroup>
              {transactions.map((transaction, index) => {
                if (!transaction.inputData) {
                  return " ";
                }

                const color = getColor(transaction.from);

                return (
                  <ListGroupItem key={transaction.hash}>
                    <div
                      className={styles.message}
                      style={{
                        backgroundColor: color,
                      }}
                    >
                      {transaction.from === address ? (
                        <div>
                          <p className={styles.timestamp}>
                            time-UTC: {transaction.timestamp}
                            {", "}value:{transaction.value} TX:
                            <button
                              onClick={() => {
                                let etherscanUrl = "";
                                if (network === "mainnet") {
                                  etherscanUrl = `https://etherscan.io/tx/${transaction.hash}`;
                                } else if (network === "goerli") {
                                  etherscanUrl = `https://goerli.etherscan.io/tx/${transaction.hash}`;
                                } else if (network === "sepolia") {
                                  etherscanUrl = `https://${network}.etherscan.io/tx/${transaction.hash}`;
                                } else if (network === "bsc") {
                                  etherscanUrl = `https://bscscan.com/tx/${transaction.hash}`;
                                } else if (network === "bsc-testnet") {
                                  etherscanUrl = `https://testnet.bscscan.com/tx/${transaction.hash}`;
                                } else if (network === "polygon") {
                                  etherscanUrl = `https://polygonscan.com/tx/${transaction.hash}`;
                                } else if (network === "polygon-testnet") {
                                  etherscanUrl = `https://mumbai.polygonscan.com/tx/${transaction.hash}`;
                                }
                                if (etherscanUrl !== "") {
                                  window.open(etherscanUrl, "_blank");
                                }
                              }}
                              style={{
                                border: "none",
                                background: "#eab308",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  background: "#eab308",
                                }}
                              />
                            </button>
                          </p>
                          <hr />

                          <p className={styles.yoyo}>
                            <strong>From:</strong> {transaction.from}
                            <button
                              onClick={(event) => {
                                setAddress(transaction.from);
                                window.scrollTo(0, 0);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="gg_scan.svg"
                                alt="Copy address"
                                style={{ height: "20px" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.from);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="WhhCopy.svg"
                                alt="Copy address"
                                style={{ height: "20px" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                let etherscanUrl = "";
                                if (network === "mainnet") {
                                  etherscanUrl = `https://etherscan.io/address/${transaction.from}`;
                                } else if (network === "goerli") {
                                  etherscanUrl = `https://goerli.etherscan.io/address/${transaction.from}`;
                                } else if (network === "sepolia") {
                                  etherscanUrl = `https://${network}.etherscan.io/address/${transaction.from}`;
                                } else if (network === "bsc") {
                                  etherscanUrl = `https://testnet.bscscan.com/address/${transaction.from}`;
                                } else if (network === "bsc-testnet") {
                                  etherscanUrl = `https://bscscan.com/address/${transaction.from}`;
                                } else if (network === "polygon") {
                                  etherscanUrl = `https://polygonscan.com/address/${transaction.from}`;
                                } else if (network === "polygon-testnet") {
                                  etherscanUrl = `https://mumbai.polygonscan.com/address/${transaction.from}`;
                                }
                                if (etherscanUrl !== "") {
                                  window.open(etherscanUrl, "_blank");
                                }
                              }}
                              style={{
                                border: "none",
                                background: "#eab308",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  background: "#eab308",
                                }}
                              />
                            </button>
                          </p>

                          <p className={styles.yoyo}>
                            <strong>To:</strong> {transaction.to}
                            <button
                              onClick={(event) => {
                                setAddress(transaction.to);
                                window.scrollTo(0, 0);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="gg_scan.svg"
                                alt="Copy address"
                                style={{ height: "20px" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.to);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="WhhCopy.svg"
                                alt="Copy address"
                                style={{ height: "20px" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                let etherscanUrl = "";
                                if (network === "mainnet") {
                                  etherscanUrl = `https://etherscan.io/address/${transaction.to}`;
                                } else if (network === "goerli") {
                                  etherscanUrl = `https://goerli.etherscan.io/address/${transaction.to}`;
                                } else if (network === "sepolia") {
                                  etherscanUrl = `https://${network}.etherscan.io/address/${transaction.to}`;
                                } else if (network === "bsc") {
                                  etherscanUrl = `https://testnet.bscscan.com/address/${transaction.to}`;
                                } else if (network === "bsc-testnet") {
                                  etherscanUrl = `https://bscscan.com/address/${transaction.to}`;
                                } else if (network === "polygon") {
                                  etherscanUrl = `https://polygonscan.com/address/${transaction.to}`;
                                } else if (network === "polygon-testnet") {
                                  etherscanUrl = `https://mumbai.polygonscan.com/address/${transaction.to}`;
                                }
                                if (etherscanUrl !== "") {
                                  window.open(etherscanUrl, "_blank");
                                }
                              }}
                              style={{
                                border: "none",
                                background: "#eab308",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  background: "#eab308",
                                }}
                              />
                            </button>
                          </p>

                          {transaction.inputData && (
                            <>
                              <div className="spacer" />
                              <hr />
                              <p>
                                <strong>Message:</strong>{" "}
                                {transaction.inputData}
                              </p>
                            </>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className={styles.timestamp}>
                            time-UTC: {transaction.timestamp}
                            {", "}value:{transaction.value} TX:
                            <button
                              onClick={() => {
                                let etherscanUrl = "";
                                if (network === "mainnet") {
                                  etherscanUrl = `https://etherscan.io/tx/${transaction.hash}`;
                                } else if (network === "goerli") {
                                  etherscanUrl = `https://goerli.etherscan.io/tx/${transaction.hash}`;
                                } else if (network === "sepolia") {
                                  etherscanUrl = `https://${network}.etherscan.io/tx/${transaction.hash}`;
                                } else if (network === "bsc") {
                                  etherscanUrl = `https://bscscan.com/tx/${transaction.hash}`;
                                } else if (network === "bsc-testnet") {
                                  etherscanUrl = `https://testnet.bscscan.com/tx/${transaction.hash}`;
                                } else if (network === "polygon") {
                                  etherscanUrl = `https://polygonscan.com/tx/${transaction.hash}`;
                                } else if (network === "polygon-testnet") {
                                  etherscanUrl = `https://mumbai.polygonscan.com/tx/${transaction.hash}`;
                                }
                                if (etherscanUrl !== "") {
                                  window.open(etherscanUrl, "_blank");
                                }
                              }}
                              style={{
                                border: "none",
                                background: "#eab308",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  background: "#eab308",
                                }}
                              />
                            </button>
                          </p>
                          <hr />

                          <p className={styles.yoyo}>
                            <strong>From:</strong> {transaction.from}
                            <button
                              onClick={(event) => {
                                setAddress(transaction.from);
                                window.scrollTo(0, 0);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="gg_scan.svg"
                                alt="Copy address"
                                style={{ height: "20px" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.from);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="WhhCopy.svg"
                                alt="Copy address"
                                style={{ height: "20px" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                let etherscanUrl = "";
                                if (network === "mainnet") {
                                  etherscanUrl = `https://etherscan.io/address/${transaction.from}`;
                                } else if (network === "goerli") {
                                  etherscanUrl = `https://goerli.etherscan.io/address/${transaction.from}`;
                                } else if (network === "sepolia") {
                                  etherscanUrl = `https://${network}.etherscan.io/address/${transaction.from}`;
                                } else if (network === "bsc") {
                                  etherscanUrl = `https://testnet.bscscan.com/address/${transaction.from}`;
                                } else if (network === "bsc-testnet") {
                                  etherscanUrl = `https://bscscan.com/address/${transaction.from}`;
                                } else if (network === "polygon") {
                                  etherscanUrl = `https://polygonscan.com/address/${transaction.from}`;
                                } else if (network === "polygon-testnet") {
                                  etherscanUrl = `https://mumbai.polygonscan.com/address/${transaction.from}`;
                                }
                                if (etherscanUrl !== "") {
                                  window.open(etherscanUrl, "_blank");
                                }
                              }}
                              style={{
                                border: "none",
                                background: "#eab308",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  background: "#eab308",
                                }}
                              />
                            </button>
                          </p>

                          <p className={styles.yoyo}>
                            <strong>To:</strong> {transaction.to}
                            <button
                              onClick={(event) => {
                                setAddress(transaction.to);
                                window.scrollTo(0, 0);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="gg_scan.svg"
                                alt="Copy address"
                                style={{ height: "20px" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.to);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="WhhCopy.svg"
                                alt="Copy address"
                                style={{ height: "20px" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                let etherscanUrl = "";
                                if (network === "mainnet") {
                                  etherscanUrl = `https://etherscan.io/address/${transaction.to}`;
                                } else if (network === "goerli") {
                                  etherscanUrl = `https://goerli.etherscan.io/address/${transaction.to}`;
                                } else if (network === "sepolia") {
                                  etherscanUrl = `https://${network}.etherscan.io/address/${transaction.to}`;
                                } else if (network === "bsc") {
                                  etherscanUrl = `https://testnet.bscscan.com/address/${transaction.to}`;
                                } else if (network === "bsc-testnet") {
                                  etherscanUrl = `https://bscscan.com/address/${transaction.to}`;
                                } else if (network === "polygon") {
                                  etherscanUrl = `https://polygonscan.com/address/${transaction.to}`;
                                } else if (network === "polygon-testnet") {
                                  etherscanUrl = `https://mumbai.polygonscan.com/address/${transaction.to}`;
                                }
                                if (etherscanUrl !== "") {
                                  window.open(etherscanUrl, "_blank");
                                }
                              }}
                              style={{
                                border: "none",
                                background: "#eab308",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  background: "#eab308",
                                }}
                              />
                            </button>
                          </p>
                          {transaction.inputData && (
                            <>
                              <div className="spacer" />
                              <hr />
                              <p>
                                <strong>Message:</strong>{" "}
                                {transaction.inputData}
                              </p>
                              <p
                                style={{
                                  textAlign: "end",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    let etherscanLink = "";
                                    if (network === "mainnet") {
                                      etherscanLink = `https://etherscan.io/tx/${transaction.hash}`;
                                    } else if (network === "goerli") {
                                      etherscanLink = `https://${network}.etherscan.io/tx/${transaction.hash}`;
                                    } else if (network === "sepolia") {
                                      etherscanLink = `https://${network}.etherscan.io/tx/${transaction.hash}`;
                                    } else if (network === "bsc") {
                                      etherscanLink = `https://bscscan.com/tx/${transaction.hash}`;
                                    } else if (network === "bsc-testnet") {
                                      etherscanLink = `https://testnet.bscscan.com/tx/${transaction.hash}`;
                                    } else if (network === "polygon") {
                                      etherscanLink = `https://polygonscan.com/tx/${transaction.hash}`;
                                    } else if (network === "polygon-testnet") {
                                      etherscanLink = `https://mumbai.polygonscan.com/tx/${transaction.hash}`;
                                    }
                                    const timestamp = `${transaction.timestamp}`;
                                    const transactionData = `Shared from: https://blockchat.auditutils.com\n\nUTC-Date-Time: ${timestamp}\n\nFrom: ${transaction.from}\nTo: ${transaction.to}\n\nMessage: ${transaction.inputData}\n\nEtherscan: ${etherscanLink}`;
                                    navigator.clipboard.writeText(
                                      transactionData
                                    );
                                    alert(
                                      "Transaction data copied to clipboard!"
                                    );
                                  }}
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    marginLeft: "20px",
                                  }}
                                >
                                  <img
                                    src="GgShare.svg"
                                    alt="Copy transaction data"
                                    style={{ height: "20px" }}
                                  />
                                </button>

                                <button
                                  onClick={() => {
                                    let etherscanLink = "";
                                    if (network === "mainnet") {
                                      etherscanLink = `https://etherscan.io/tx/${transaction.hash}`;
                                    } else if (network === "goerli") {
                                      etherscanLink = `https://${network}.etherscan.io/tx/${transaction.hash}`;
                                    } else if (network === "sepolia") {
                                      etherscanLink = `https://${network}.etherscan.io/tx/${transaction.hash}`;
                                    } else if (network === "bsc") {
                                      etherscanLink = `https://bscscan.com/tx/${transaction.hash}`;
                                    } else if (network === "bsc-testnet") {
                                      etherscanLink = `https://testnet.bscscan.com/tx/${transaction.hash}`;
                                    } else if (network === "polygon") {
                                      etherscanLink = `https://polygonscan.com/tx/${transaction.hash}`;
                                    } else if (network === "polygon-testnet") {
                                      etherscanLink = `https://mumbai.polygonscan.com/tx/${transaction.hash}`;
                                    }
                                    const timestamp = `${transaction.timestamp}`;
                                    const transactionData = `Shared from: https://blockchat.auditutils.com\n\nUTC-Date-Time: ${timestamp}\n\nFrom: ${transaction.from}\nTo: ${transaction.to}\n\nMessage: ${transaction.inputData}\n\nEtherscan: ${etherscanLink}`;
                                    const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(
                                      transactionData
                                    )}`;
                                    window.open(telegramLink, "_blank");
                                  }}
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    marginLeft: "20px",
                                  }}
                                >
                                  <img
                                    src="telegram.png"
                                    alt="Share on Telegram"
                                    style={{ height: "20px" }}
                                  />
                                </button>
                                {/* <button
                                  onClick={() => {
                                    const etherscanLink = `https://etherscan.io/tx/${transaction.hash}`;
                                    const timestamp = `${transaction.timestamp}`;
                                    const transactionData = `UTC-Date-Time: ${timestamp}\n\nFrom: ${transaction.from}\nTo: ${transaction.to}\n\nMessage: ${transaction.inputData}\n\nEtherscan: ${etherscanLink}\n\nShared from: https://blockchat.auditutils.com`;
                                    const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                      transactionData
                                    )}`;
                                    window.open(twitterLink, "_blank");
                                  }}
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    marginLeft: "20px",
                                  }}
                                >
                                  <img
                                    src="twitter.svg"
                                    alt="Share on Twitter"
                                    style={{ height: "20px" }}
                                  />
                                </button> */}
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </div>
        )}
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "#282c33ff",
            padding: "20px",
            borderRadius: "15px",
            border: "3px solid rgba(10, 202, 166, 0.9)",
            Width: "80%",
            maxWidth: "600px",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            margin: "30px auto",
          }}
        >
          <p style={{ textAlign: "center", fontFamily: "monospace" }}>
            Example of an adress: 0xb66cd966670d962C227B3EABA30a872DbFb995db
          </p>

          <p style={{ textAlign: "center", fontFamily: "monospace" }}>
            <button
              onClick={(event) => {
                navigator.clipboard.writeText(example);
              }}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                marginLeft: "20px",
                color: "#ccc",
                width: "80%",
                maxWidth: "600px",
              }}
            >
              {" "}
              copy -{">"}
              <img
                src="WhhCopy.svg"
                alt="Copy address"
                style={{ height: "20px" }}
              />
            </button>{" "}
            <button
              onClick={(event) => {
                setAddress(example);
                window.scrollTo(0, 0);
              }}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                marginLeft: "20px",
                color: "#ccc",
              }}
            >
              {" "}
              click this icon to populate -{">"}
              <img
                src="gg_scan.svg"
                alt="Copy address"
                style={{ height: "20px" }}
              />
            </button>
          </p>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <h3 style={{ flex: 1, textAlign: "center", marginTop: "30px" }}>
            2023, BlockChat by AuditUtils
          </h3>
          <a href="https://auditutils.com/">
            <img
              className={styles["profile-image-au"]}
              src="https://auditutils.com/content/images/2023/02/au-pixelize.jpg"
              alt="auditutils logo pixel"
            />
          </a>
          <a href="https://user137-portfolio.auditutils.com">
            <img
              className={styles["profile-image-user137"]}
              src="https://user137-portfolio.auditutils.com/user137.PNG"
              alt="user137 Profile Picture"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
