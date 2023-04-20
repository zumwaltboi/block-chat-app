import React, { useState } from "react";
import Web3 from "web3";
import styles from "./styles.module.css";

function SendMessage() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const sender = accounts[0];
    const tx = {
      from: sender,
      to: recipient,
      value: web3.utils.toWei("0", "ether"), // Set the value to 0
      data: web3.utils.asciiToHex(message),
    };
    try {
      const result = await web3.eth.sendTransaction(tx);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10px",
      }}
    >
      {/* <h1 style={{ textAlign: "center" }}>Send a message</h1> */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.1em",
            fontFamily: "monospace",
            flexDirection: "column",
            alignContent: "center",
            // marginTop: "30px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <p htmlFor="recipient">To:</p>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={styles.inputText}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.1em",
            fontFamily: "monospace",
            flexDirection: "column",
            alignContent: "center",
            // marginTop: "30px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <p htmlFor="message">Message:</p>
          <input
            id="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={styles.inputText}
            style={{
              minHeight: "120px",
            }}
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          style={{
            color: "#00ffff",
            fontFamily: "monospace",
            fontSize: "1.4em",
            fontWeight: "bold",
          }}
        >
          SEND
        </button>
      </form>
    </div>
  );
}

export default SendMessage;
