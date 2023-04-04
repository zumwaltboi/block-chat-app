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
  const [loading, setLoading] = useState(false); // add loading state
  const [gif, setGif] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const addressParam = searchParams.get("address");
    const networkParam = searchParams.get("network");

    if (addressParam) {
      setAddress(addressParam);
    }

    if (networkParam) {
      setNetwork(networkParam);
    }
  }, []);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  // {isClicked && <div>This will disappear when you click the button</div>}

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
    } finally {
      setLoading(false); // set loading state to false
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await fetchTransactions();
    const searchParams = new URLSearchParams();
    searchParams.set("address", address);
    searchParams.set("network", network);
    window.history.replaceState({}, "", `?${searchParams.toString()}`);
    const button = document.querySelector(`.${styles.submitButton}`);
    button.classList.remove("loading");
  };

  const handleAddressClick = async (event, sender) => {
    event.preventDefault();
    setAddress(sender);
    setLoading(true);
    await fetchTransactions();
    const searchParams = new URLSearchParams();
    searchParams.set("address", sender);
    searchParams.set("network", network);
    window.history.replaceState({}, "", `?${searchParams.toString()}`);
  };

  const getColor = (sender) => {
    if (!colors[sender]) {
      const colorsArray = [
        "#282c33", // dark grey
        "#26282B", // raisin black
        "#0A2A45", // midnight blue
        "transparent", // transparent
        "#1E1E1E", // eerie blk3
        "#002928", // midnight green
        "#001515", // rich black
        "#082136", // oxford blue
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

  function handleButtonClick() {
    console.log("Button clicked!");
    const gifs = ["loading_blocks.gif", "loading_blocks.gif"];
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    setGif(randomGif);
    // Your code to handle the button click goes here
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const euler = "0xb66cd966670d962C227B3EABA30a872DbFb995db";
  const safemoon = "0x678ee23173dce625A90ED651E91CA5138149F590";
  const blockchat = "0xe03948003A4346fa8108f8DA1Cf3C12549f0542d";

  return (
    <div>
      <Head>
        <title>BlockChat</title>

        <meta
          name="keywords"
          content="blockchain, Ethereum, chat, decentralized"
        />
        <meta name="author" content="AuditUtils" />
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
          content="Uncover the full story behind blockchain transaction's messages with our app. Switch between Ethereum, Polygon, BSC, and testnets to research with ease and create content by sharing your findings."
        />
        <meta
          property="og:image"
          content="https://blockchat.auditutils.com/android-chrome-192x192.png"
        />
        <meta property="og:url" content="https://blockchat.auditutils.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BlockChat" />
        <meta
          name="twitter:description"
          content="Uncover the full story behind blockchain transaction's messages with our app. Switch between Ethereum, Polygon, BSC, and testnets to research with ease and create content by sharing your findings."
        />
        <meta
          name="twitter:image"
          content="https://blockchat.auditutils.com/android-chrome-192x192.png"
        />

        <meta property="telegram:title" content="BlockChat" />
        <meta
          property="telegram:description"
          content="Uncover the full story behind blockchain transaction's messages with our app. Switch between Ethereum, Polygon, BSC, and testnets to research with ease and create content by sharing your findings."
        />
        <meta
          property="telegram:image"
          content="https://blockchat.auditutils.com/android-chrome-192x192.png"
        />

        <meta property="og:site_name" content="BlockChat" />
        <meta property="og:locale" content="en_US" />

        <meta property="linkedin:title" content="BlockChat" />
        <meta
          property="linkedin:description"
          content="Uncover the full story behind blockchain transaction's messages with our app. Switch between Ethereum, Polygon, BSC, and testnets to research with ease and create content by sharing your findings."
        />
        <meta
          property="linkedin:image"
          content="https://blockchat.auditutils.com/android-chrome-192x192.png"
        />

        <meta property="discord:title" content="BlockChat" />
        <meta
          property="discord:description"
          content="Uncover the full story behind blockchain transaction's messages with our app. Switch between Ethereum, Polygon, BSC, and testnets to research with ease and create content by sharing your findings."
        />
        <meta
          property="discord:image"
          content="https://blockchat.auditutils.com/android-chrome-192x192.png"
        />
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
              marginBottom: "20px",
            }}
            href="https://blockchat.auditutils.com/"
          >
            <img
              style={{
                maxWidth: "300px",
                width: "100%",
                margin: "0px",
                padding: "0px",
                textAlign: "center",
                flex: 1,
                alignItems: "center",
                marginBottom: "20px",
                // backgroundColor: "#282c33ff",
                // borderRadius: "12px",
                marginTop: "15px",

                // filter: "blur(1px)",
                // filter: "grayscale(100%)",
                // filter: "opacity(30%)",
              }}
              src="logo_v4_long_01.svg"
              alt="blockchat logo"
            />
          </a>
        </div>
        {/* <div className={styles.showExampleContainer}>
          <div className={styles.myDropdown} onClick={toggleDropdown}>
            Show examples
          </div>
        </div> */}
        <div className={styles.container}></div>
        <div className={styles.settingsButtonContainer}>
          <div className={styles.settingsButton} onClick={toggleDropdown}>
            How to
          </div>
          <button className={styles.settingsButton} onClick={handleClick}>
            Options
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p>Enter an blockchain address:</p>
          <label className={styles.label}>
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className={styles.inputText}
              placeholder="0x..."
            />
          </label>
          <p>Choose a network:</p>
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
          {isClicked && (
            <div className={styles.settingsArea}>
              Options:
              <div>
                Enter a secondary adress:
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className={styles.inputText}
                  placeholder="0x..."
                />
              </div>
              <div
                style={{
                  margin: "10px 0px",
                  textAlign: "center",
                  color: "#00ffff",
                }}
              ></div>
              or:
              <div>
                Enter a transaction hash:{" "}
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className={styles.inputText}
                  placeholder="0x..."
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className={`${styles.submitButton} ${
              loading ? styles.loading : ""
            }`}
            disabled={loading}
            onClick={handleButtonClick}
          >
            {loading ? (
              <div className={styles.loadingContainer}>
                {gif && <img src={`/${gif}`} alt="In progress" />}
              </div>
            ) : (
              "Click to LOAD"
            )}
          </button>
        </form>

        {transactions.length > 0 && (
          <div className={styles.conversation}>
            <h2 style={{ color: "#f0fff0" }}>Conversation:</h2>
            <ListGroup>
              {transactions.map((transaction, index) => {
                if (!transaction.inputData) {
                  return " ";
                }

                const color = getColor(transaction.from);
                const id = `transaction-${transaction.hash}`;
                console.log(`Transaction ${index} has an id of ${id}`);

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
                            UTC:{transaction.timestamp}
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
                                // background: "#eab308",
                                background: "#ffd700",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  // background: "#eab308",
                                  background: "#ffd700",
                                }}
                              />
                            </button>{" "}
                            <button
                              className={styles.myBtn}
                              onClick={(event) => {
                                window.scrollTo(0, 0);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                // marginLeft: "20px",
                              }}
                            >
                              <img
                                src="CarbonArrowUp.svg"
                                alt="top"
                                style={{ height: "18px" }}
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
                                // background: "#eab308",
                                background: "#ffd700",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  // background: "#eab308",
                                  background: "#ffd700",
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
                                // background: "#eab308",
                                background: "#ffd700",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  // background: "#eab308",
                                  background: "#ffd700",
                                }}
                              />
                            </button>
                          </p>

                          {transaction.inputData && (
                            <>
                              <div className="spacer" />
                              <hr />
                              <p
                                style={{
                                  textAlign: "start",
                                }}
                              >
                                <strong>Message:</strong>
                              </p>
                              <div style={{ marginBottom: "10px" }}></div>
                              <p className={styles.messageContent}>
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
                                    const transactionData = `--------------------\n\n${transaction.inputData}\n\n--------------------\n\n\n🕰️UTC Date/Time: ${timestamp}\n💸Value in native money of ${network}: ${transaction.value}\n📤From: ${transaction.from}\n📥To: ${transaction.to}\n\n\n🌐BlockChat:\nhttps://blockchat.auditutils.com/?address=${address}&network=${network}`;
                                    navigator.clipboard.writeText(
                                      transactionData
                                    );
                                    alert(
                                      "Message content copied to clipboard. Let's past it to share it!"
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
                                    const transactionData = `--------------------\n\n${transaction.inputData}\n\n--------------------\n\n\n🕰️UTC Date/Time: ${timestamp}\n💸Value in native money of ${network}: ${transaction.value}\n📤From: ${transaction.from}\n📥To: ${transaction.to}\n\n\n🌐BlockChat:\nhttps://blockchat.auditutils.com/?address=${address}&network=${network}`;
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
                              </p>
                            </>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className={styles.timestamp}>
                            UTC:{transaction.timestamp}
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
                                // background: "#eab308",
                                background: "#ffd700",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  // background: "#eab308",
                                  background: "#ffd700",
                                }}
                              />
                            </button>{" "}
                            <button
                              className={styles.myBtn}
                              onClick={(event) => {
                                window.scrollTo(0, 0);
                              }}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                // marginLeft: "20px",
                              }}
                            >
                              <img
                                src="CarbonArrowUp.svg"
                                alt="top"
                                style={{ height: "18px" }}
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
                                // background: "#eab308",
                                background: "#ffd700",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  // background: "#eab308",
                                  background: "#ffd700",
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
                                // background: "#eab308",
                                background: "#ffd700",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                                alt="Etherscan logo"
                                style={{
                                  height: "20px",
                                  // background: "#eab308",
                                  background: "#ffd700",
                                }}
                              />
                            </button>
                          </p>
                          {transaction.inputData && (
                            <>
                              <div className="spacer" />
                              <hr />
                              <p
                                style={{
                                  textAlign: "start",
                                }}
                              >
                                <strong>Message:</strong>
                              </p>
                              <div style={{ marginBottom: "10px" }}></div>
                              <p className={styles.messageContent}>
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
                                    const transactionData = `--------------------\n\n${transaction.inputData}\n\n--------------------\n\n\n🕰️UTC Date/Time: ${timestamp}\n💸Value in native money of ${network}: ${transaction.value}\n📤From: ${transaction.from}\n📥To: ${transaction.to}\n\n\n🌐BlockChat:\nhttps://blockchat.auditutils.com/?address=${address}&network=${network}`;
                                    navigator.clipboard.writeText(
                                      transactionData
                                    );
                                    alert(
                                      "Message content copied to clipboard. Let's past it to share it!"
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
                                    const transactionData = `--------------------\n\n${transaction.inputData}\n\n--------------------\n\n\n🕰️UTC Date/Time: ${timestamp}\n💸Value in native money of ${network}: ${transaction.value}\n📤From: ${transaction.from}\n📥To: ${transaction.to}\n\n\n🌐BlockChat:\nhttps://blockchat.auditutils.com/?address=${address}&network=${network}`;
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
        <div>
          {/* <div className={styles.myContainer}>
            <p className={styles.myTitle}>
              Explore chat related to this account through different
              blockchains:
            </p>
            <div className={styles.mySection}>
              <p className={styles.myTitle}>
                <a href="https://rekt.news/euler-rekt/" target={"_blank"}>
                  <strong>Euler</strong> exploiter address:
                </a>
              </p>
              <div className={styles.myContent}>
                <p className={styles.myAddress}>
                  0xb66cd966670d962C227B3EABA30a872DbFb995db
                </p>
                <button
                  onClick={(event) => {
                    const searchParams = new URLSearchParams();
                    searchParams.set(
                      "address",
                      "0xb66cd966670d962C227B3EABA30a872DbFb995db"
                    );
                    searchParams.set("network", "mainnet");
                    window.location.href = `?${searchParams.toString()}`;
                  }}
                  className={styles.myButton}
                >
                  <img
                    src="gg_scan.svg"
                    alt="Copy address"
                    className={styles.myImage}
                  />
                </button>
              </div>
            </div>
          </div> */}

          {isDropdownOpen && (
            <div className={styles.myContainer}>
              <p className={styles.myTitle}>
                Discover inter-network discutions by changing blockchain:
              </p>
              <hr className={styles.myHr} />
              <div className={styles.mySection}>
                <p className={styles.myTitle}>
                  <a href="https://rekt.news/safemoon-rekt/" target={"_blank"}>
                    <strong>Safemoon</strong> exploiter address:
                  </a>
                </p>
                <div className={styles.myContent}>
                  <p className={styles.myAddress}>
                    0x678ee23173dce625A90ED651E91CA5138149F590
                  </p>

                  <button
                    onClick={(event) => {
                      const searchParams = new URLSearchParams();
                      searchParams.set(
                        "address",
                        "0x678ee23173dce625A90ED651E91CA5138149F590"
                      );
                      searchParams.set("network", "bsc");
                      window.location.href = `?${searchParams.toString()}`;
                    }}
                    className={styles.myButton}
                  >
                    <img
                      src="gg_scan.svg"
                      alt="Copy address"
                      className={styles.myImage}
                    />
                  </button>
                </div>
              </div>
              <hr className={styles.myHr} />
              <div className={styles.mySection}>
                <p className={styles.myTitle}>
                  <a href="https://rekt.news/euler-rekt/" target={"_blank"}>
                    <strong>Euler</strong> exploiter address:
                  </a>
                </p>
                <div className={styles.myContent}>
                  <p className={styles.myAddress}>
                    0xb66cd966670d962C227B3EABA30a872DbFb995db
                  </p>
                  <button
                    onClick={(event) => {
                      const searchParams = new URLSearchParams();
                      searchParams.set(
                        "address",
                        "0xb66cd966670d962C227B3EABA30a872DbFb995db"
                      );
                      searchParams.set("network", "mainnet");
                      window.location.href = `?${searchParams.toString()}`;
                    }}
                    className={styles.myButton}
                  >
                    <img
                      src="gg_scan.svg"
                      alt="Copy address"
                      className={styles.myImage}
                    />
                  </button>
                </div>
              </div>
              <hr className={styles.myHr} />
              <div className={styles.mySection}>
                <p className={styles.myTitle}>
                  <a href="https://rekt.news/wormhole-rekt/" target={"_blank"}>
                    <strong>Wormhole</strong> attacker address:
                  </a>
                </p>
                <div className={styles.myContent}>
                  <p className={styles.myAddress}>
                    0x629e7da20197a5429d30da36e77d06cdf796b71a
                  </p>

                  <button
                    onClick={(event) => {
                      const searchParams = new URLSearchParams();
                      searchParams.set(
                        "address",
                        "0x629e7da20197a5429d30da36e77d06cdf796b71a"
                      );
                      searchParams.set("network", "mainnet");
                      window.location.href = `?${searchParams.toString()}`;
                    }}
                    className={styles.myButton}
                  >
                    <img
                      src="gg_scan.svg"
                      alt="Copy address"
                      className={styles.myImage}
                    />
                  </button>
                </div>
              </div>
              <hr className={styles.myHr} />
              <div className={styles.mySection}>
                <p className={styles.myTitle}>
                  <a href="https://rekt.news/ronin-rekt/" target={"_blank"}>
                    <strong>Ronin</strong> attaker address:
                  </a>
                </p>
                <div className={styles.myContent}>
                  <p className={styles.myAddress}>
                    0x098b716b8aaf21512996dc57eb0615e2383e2f96
                  </p>

                  <button
                    onClick={(event) => {
                      const searchParams = new URLSearchParams();
                      searchParams.set(
                        "address",
                        "0x098b716b8aaf21512996dc57eb0615e2383e2f96"
                      );
                      searchParams.set("network", "mainnet");
                      window.location.href = `?${searchParams.toString()}`;
                    }}
                    className={styles.myButton}
                  >
                    <img
                      src="gg_scan.svg"
                      alt="Copy address"
                      className={styles.myImage}
                    />
                  </button>
                </div>
              </div>
              <hr className={styles.myHr} />
              <div className={styles.mySection}>
                <p className={styles.myTitle}>
                  <a
                    href="https://rekt.news/polynetwork-rekt/"
                    target={"_blank"}
                  >
                    <strong>PolyNetwork</strong> remaining funds adresses:
                  </a>
                </p>
                <div className={styles.myContent}>
                  <p className={styles.myAddress}>
                    0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963
                  </p>

                  <button
                    onClick={(event) => {
                      const searchParams = new URLSearchParams();
                      searchParams.set(
                        "address",
                        "0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963"
                      );
                      searchParams.set("network", "mainnet");
                      window.location.href = `?${searchParams.toString()}`;
                    }}
                    className={styles.myButton}
                  >
                    <img
                      src="gg_scan.svg"
                      alt="Copy address"
                      className={styles.myImage}
                    />
                  </button>
                </div>
                <div className={styles.myContent}>
                  <p className={styles.myAddress}>
                    0x0D6e286A7cfD25E0c01fEe9756765D8033B32C71
                  </p>

                  <button
                    onClick={(event) => {
                      const searchParams = new URLSearchParams();
                      searchParams.set(
                        "address",
                        "0x0D6e286A7cfD25E0c01fEe9756765D8033B32C71"
                      );
                      searchParams.set("network", "bsc");
                      window.location.href = `?${searchParams.toString()}`;
                    }}
                    className={styles.myButton}
                  >
                    <img
                      src="gg_scan.svg"
                      alt="Copy address"
                      className={styles.myImage}
                    />
                  </button>
                </div>
                <div className={styles.myContent}>
                  <p className={styles.myAddress}>
                    0x5dc3603C9D42Ff184153a8a9094a73d461663214
                  </p>

                  <button
                    onClick={(event) => {
                      const searchParams = new URLSearchParams();
                      searchParams.set(
                        "address",
                        "0x5dc3603C9D42Ff184153a8a9094a73d461663214"
                      );
                      searchParams.set("network", "polygon");
                      window.location.href = `?${searchParams.toString()}`;
                    }}
                    className={styles.myButton}
                  >
                    <img
                      src="gg_scan.svg"
                      alt="Copy address"
                      className={styles.myImage}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, textAlign: "center" }}>
          <a
            style={{
              textAlign: "center",
              flex: 1,
              alignItems: "center",
            }}
            href="https://blockchat.auditutils.com/"
          >
            <img
              style={{
                maxWidth: "150px",
                // marginTop: "30px",
                padding: "0px",
                textAlign: "center",
                flex: 1,
                alignItems: "center",
                // backgroundColor: "#282c33ff",
                // borderRadius: "9px",
                marginTop: "60px",
              }}
              src="logo_v4_512_01.png"
              alt="blockchat logo"
            />
          </a>
        </div>

        <div
          className={styles.myContainer}
          style={{ backgroundColor: "transparent", marginTop: "10px" }}
        >
          <div className={styles.mySection}>
            <p className={styles.myTitle}>
              <a href="https://blockchat.auditutils.com/" target={"_self"}>
                <strong>BlockChat</strong> address:
              </a>
            </p>
            <div className={styles.myContent}>
              <p className={styles.myAddress}>
                0xe03948003A4346fa8108f8DA1Cf3C12549f0542d
              </p>
              <button
                onClick={(event) => {
                  const searchParams = new URLSearchParams();
                  searchParams.set(
                    "address",
                    "0xe03948003A4346fa8108f8DA1Cf3C12549f0542d"
                  );
                  searchParams.set("network", "sepolia");
                  window.location.href = `?${searchParams.toString()}`;
                }}
                className={styles.myButton}
              >
                <img
                  src="gg_scan.svg"
                  alt="Copy address"
                  className={styles.myImage}
                />
              </button>
            </div>
          </div>
        </div>
        <h3
          style={{
            flex: 1,
            textAlign: "center",
            marginTop: "10px",
            fontFamily: "monospace",
          }}
        >
          2023 BlockChat by AuditUtils.com
        </h3>
        <div
          // className={styles.header}
          style={{
            // display: "flex",
            alignItems: "center",
            marginTop: "60px",
            textAlign: "end",
            // padding: "20px",
          }}
        >
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
