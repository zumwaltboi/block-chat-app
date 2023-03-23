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
    } catch (error) {
      console.error(error);
    }
  };

  const getColor = (sender) => {
    if (!colors[sender]) {
      const color = `rgb(${Math.floor(Math.random() * 51)}, ${Math.floor(Math.random() * 51)}, ${Math.floor(Math.random() * 51)})`;
      setColors((prevColors) => ({ ...prevColors, [sender]: color }));
    }
  
    return colors[sender];
  };

  return (
    <div className={styles.container}>
     <div className={styles.header} style={{ display: 'flex', alignItems: 'center' }}>
  <a href="https://auditutils.com/">
    <img
      style={{
        maxWidth: '96px',
        borderRadius: '15px',
        border: '6px solid rgba(10, 202, 166, 0.9)',
        margin: '30px',
        padding: '15px',
      }}
      src="https://auditutils.com/content/images/2023/02/au-pixelize.jpg"
      alt="auditutils logo pixel"
    />
  </a>
  <h1 style={{ flex: 1, textAlign: 'center' }}>BlockChat by Audit Utils</h1>
  <a href="https://user137-portfolio.auditutils.com">
    <img
      style={{
        maxWidth: '96px',
        borderRadius: '15px',
        border: '6px solid rgba(10, 202, 166, 0.9)',
        margin: '30px',
        padding: '15px',
      }}
      src="https://user137-portfolio.auditutils.com/user137.PNG"
      alt="user137 Profile Picture"
    />
  </a>
</div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Enter Ethereum Address:
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </label>
        <button type="submit">Get chat history</button>
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
                  <div className={styles.message} style={{ backgroundColor: color, borderRadius: '15px', border: '6px solid rgba(10, 202, 166, 0.9)', margin: '10px', padding: '10px' }}>
                    {transaction.from === address ? (
                      <div>
                        <p>
                          <strong>target address</strong> to{" "}
                          {transaction.to}
                        </p>
                        <div className="spacer" />
                        <p>
                          <strong>Message:</strong> {transaction.inputData}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p>
                          <strong>{transaction.from}</strong> to target address
                        </p>
                        <div className="spacer" />
                        <p>
                          <strong>message:</strong> {transaction.inputData}
                        </p>
                      </div>
                    )}
                  </div>
                  
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </div>
      )}
    </div>
  );
}
