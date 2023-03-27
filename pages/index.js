import { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { getTransactions } from "../lib/eth";
import styles from "./styles.module.css";

export default function Home() {
  const [address, setAddress] = useState("");
  const [secondAddress, setSecondAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [colors, setColors] = useState({});

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSecondAddressChange = (event) => {
    setSecondAddress(event.target.value);
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      (transaction.from === address && transaction.to === secondAddress) ||
      (transaction.from === secondAddress && transaction.to === address) ||
      transaction.from === address ||
      transaction.to === address
  );

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `/api?address=${address}&limit=200&timestamp=true`,
        { timeout: 10000 } // set timeout to 10 seconds
      );
      const data = await response.json();

      const formattedTransactions = data.transactions.map((transaction) => {
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

  const example = "0xb66cd966670d962C227B3EABA30a872DbFb995db";

  return (
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
          }}
          href="https://blockchat.auditutils.com/"
        >
          <img
            style={{
              maxWidth: "200px",
              margin: "0px",
              padding: "0px",
              textAlign: "center",
              flex: 1,
              alignItems: "center",
            }}
            src="blockchat-logo-300.png"
            alt="blockchat logo"
          />
        </a>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          <p>Enter an Ethereum address: </p>

          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={styles.inputText}
            placeholder="0x..."
          />
           {/* <input
          type="text"
          value={secondAddress}
          onChange={handleSecondAddressChange}
          placeholder="2nd Eth address (optional)"
          className={styles.inputText}
        /> */}
        </label>
        <button type="submit" className={styles.submitButton}>
          Load chat history
        </button>
      </form>
      {transactions.length > 0 && (
        <div className={styles.conversation}>
          <h2>Conversation:</h2>
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
                          time-UTC: {transaction.timestamp}{", "}value:{transaction.value} ETH{" "} TRX:
                          <button
                            onClick={() => {
                              window.open(
                                `https://etherscan.io/tx/${transaction.hash}`,
                                "_blank"
                              );
                            }}
                            style={{
                              border: "none",
                              background: "write",
                              cursor: "pointer",
                              marginLeft: "20px",
                            }}
                          >
                            
                            <img
                              src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                              alt="Etherscan logo"
                              style={{ height: "20px" }}
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
                              window.open(
                                `https://etherscan.io/address/${transaction.to}`,
                                "_blank"
                              );
                            }}
                            style={{
                              border: "none",
                              background: "white",
                              cursor: "pointer",
                              marginLeft: "20px",
                            }}
                          >
                            <img
                              src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                              alt="Etherscan logo"
                              style={{ height: "20px" }}
                            />
                          </button>
                        </p>
                        <p  className={styles.yoyo}>
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
                              window.open(
                                `https://etherscan.io/address/${transaction.to}`,
                                "_blank"
                              );
                            }}
                            style={{
                              border: "none",
                              background: "white",
                              cursor: "pointer",
                              marginLeft: "20px",
                            }}
                          >
                            <img
                              src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                              alt="Etherscan logo"
                              style={{ height: "20px" }}
                            />
                          </button>
                        </p>

                        {transaction.inputData && (
                          <>
                            <div className="spacer" />
                            <hr />
                            <p>
                              <strong>Message:</strong> {transaction.inputData}
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className={styles.timestamp}>
                          time-UTC: {transaction.timestamp}{", "}value:{transaction.value} ETH{" "}TRX:
                          <button
                            onClick={() => {
                              window.open(
                                `https://etherscan.io/tx/${transaction.hash}`,
                                "_blank"
                              );
                            }}
                            style={{
                              border: "none",
                              background: "write",
                              cursor: "pointer",
                              marginLeft: "10px",
                            }}
                          >
                            
                            <img
                              src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                              alt="Etherscan logo"
                              style={{ height: "20px", background: "write" }}
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
                              window.open(
                                `https://etherscan.io/address/${transaction.from}`,
                                "_blank"
                              );
                            }}
                            style={{
                              border: "none",
                              background: "white",
                              cursor: "pointer",
                              marginLeft: "20px",marginLeft: "20px",
                            }}
                          >
                            <img
                              src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                              alt="Etherscan logo"
                              style={{ height: "20px" }}
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
                              window.open(
                                `https://etherscan.io/address/${transaction.to}`,
                                "_blank"
                              );
                            }}
                            style={{
                              border: "none",
                              background: "white",
                              cursor: "pointer",
                              marginLeft: "20px",
                            }}
                          >
                            <img
                              src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                              alt="Etherscan logo"
                              style={{ height: "20px" }}
                            />
                          </button>
                        </p>
                        {transaction.inputData && (
                          <>
                            <div className="spacer" />
                            <hr />
                            <p>
                              <strong>Message:</strong> {transaction.inputData}
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
          padding: "10px",
          borderRadius: "15px",
          border: "3px solid rgba(10, 202, 166, 0.9)",
        }}
      >
        <p style={{ textAlign: "center", fontFamily: "monospace" }}>
          Example of an hacker adress:
          0xb66cd966670d962C227B3EABA30a872DbFb995db
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
              window.scrollTo(0, 0);            }}
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
  );
}
