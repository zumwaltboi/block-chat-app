import { useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { getTransactions } from "../lib/eth";
import styles from "./styles.module.css";

export default function Home() {
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [colors, setColors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(`/api?address=${address}`);
      const data = await response.json();
  
      setTransactions(data.transactions);
      setColors({});
      window.scrollTo(0, 0); // scroll to top of page
    } catch (error) {
      console.error(error);
    }
  };

  const getColor = (sender) => {
    if (!colors[sender]) {
      const colorsArray = [
        "#282c33ff", // dark grey
        "#0d1c15", // dark green
        "#11202D", // dark blue
      ];
      const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
      setColors((prevColors) => ({ ...prevColors, [sender]: color }));
    }
  
    return sender === address ? colors[sender] : (
      <a
        href={`/?address=${sender}`}
        onClick={(event) => {
          event.preventDefault();
          setAddress(sender);
          handleSubmit(event);
        }}
        style={{ color: colors[sender], textDecoration: "underline" }}
      >
        {sender}
      </a>
    );
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
          <p>Enter an Ethereum address:{" "}</p>
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={styles.inputText}
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          Get chat history
        </button>
      </form>
      {transactions.length > 0 && (
        <div className={styles.conversation}>
          <h2>Conversation:</h2>
          <ListGroup>
            {transactions.map((transaction, index) => {
              if (!transaction.inputData) {
                return null;
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
    <p>
      <strong>From:</strong> {transaction.from} to{" "}
      <a
        href={`/?address=${transaction.to}`}
        onClick={(event) => {
          event.preventDefault();
          setAddress(transaction.to);
          handleSubmit(event);
        }}
      >
        <strong>{transaction.to}</strong>
      </a>
    </p>
    {transaction.inputData && (
      <>
        <div className="spacer" />
        <p>
          <strong>Message:</strong> {transaction.inputData}
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
      </>
    )}
  </div>
) : (
  <div>
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
        <strong>{transaction.from}</strong>
      </a>{" "}
      to <strong>Receiver:</strong> {transaction.to}
    </p>
    {transaction.inputData && (
      <>
        <div className="spacer" />
        <p>
          <strong>Message:</strong> {transaction.inputData}
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
        <h3 style={{ flex: 1, textAlign: "center" }}>
          2023, BlockChat by Audit Utils
        </h3>
        <a href="https://auditutils.com/">
          <img
            style={{
              maxWidth: "96px",
              borderRadius: "15px",
              border: "6px solid rgba(10, 202, 166, 0.9)",
              margin: "30px",
              padding: "15px",
            }}
            src="https://auditutils.com/content/images/2023/02/au-pixelize.jpg"
            alt="auditutils logo pixel"
          />
        </a>
        <a href="https://user137-portfolio.auditutils.com">
          <img
            style={{
              maxWidth: "96px",
              borderRadius: "15px",
              border: "6px solid rgba(10, 202, 166, 0.9)",
              margin: "30px",
              padding: "15px",
              maxHeight: "96px",
            }}
            src="https://user137-portfolio.auditutils.com/user137.PNG"
            alt="user137 Profile Picture"
          />
        </a>
      </div>
    </div>
  );
}
