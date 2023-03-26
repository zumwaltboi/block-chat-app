import { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { getTransactions } from "../lib/eth";
import styles from "./styles.module.css";

export default function Home() {
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [colors, setColors] = useState({});

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `/api?address=${address}&limit=200&timestamp=true`
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
              maxWidth: "300px",
              margin: "0px",
              padding: "3px",
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
          />
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
                          time-UTC: {transaction.timestamp} 
                          <a
                            href={`https://etherscan.io/tx/${transaction.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginLeft: "10px" }}
                          >
                            <img
                              src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                              alt="Etherscan logo"
                              style={{ height: "20px" }}
                            />
                          </a>
                        </p>
                        <hr />

                        <p>
                          <strong>From:</strong> {transaction.from} 
                          
                        </p>
                        <p><strong>Receiver:</strong> <a
                            href={`/?address=${transaction.to}`}
                            onClick={(event) => {
                              event.preventDefault();
                              setAddress(transaction.to);
                              handleSubmit(event);
                            }}
                          >
                            {transaction.to}
                          </a></p>

                        {transaction.inputData && (
                          <>
                            <div className="spacer" />
                            
                            <p>
                            <hr />
                              <strong>Message:</strong> {transaction.inputData}
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className={styles.timestamp}>
                          time-UTC: {transaction.timestamp} 
                          <a
                            href={`https://etherscan.io/tx/${transaction.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginLeft: "10px" }}
                          >
                            <img
                              src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
                              alt="Etherscan logo"
                              style={{ height: "20px" }}
                            />
                          </a>
                        </p>
                        <hr />

                        <p>
                          <strong>From:</strong>{" "}
                          <a
                            href={`/?address=${transaction.from}`}
                            onClick={(event) => {
                              event.preventDefault();
                              setAddress(transaction.from);
                              handleSubmit(event);
                            }}
                          >
                            {transaction.from}
                          </a>{" "}
                           
                        </p>
                        <p><strong>Receiver:</strong> {transaction.to}</p>
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
