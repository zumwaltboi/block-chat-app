import { useState } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { getTransactions } from '../lib/eth';
import styles from './styles.module.css';

export default function Home() {
  const [address, setAddress] = useState('');
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
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      setColors((prevColors) => ({ ...prevColors, [sender]: color }));
    }

    return colors[sender];
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Enter Ethereum Address:
          <input type="text" value={address} onChange={(event) => setAddress(event.target.value)} />
        </label>
        <button type="submit">Fetch Transactions</button>
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
                  <div className={styles.message} style={{ backgroundColor: color }}>
                    {transaction.from === address ? (
                      <div>
                        <p>
                          <strong>You:</strong> sent a transaction to {transaction.to}
                        </p>
                        <p>
                          <strong>Input Data:</strong> {transaction.inputData}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p>
                          <strong>{transaction.from}:</strong> sent a transaction to you
                        </p>
                        <p>
                          <strong>Input Data:</strong> {transaction.inputData}
                        </p>
                      </div>
                    )}
                  </div>
                  {index !== transactions.length - 1 && <hr className={styles.hr} />}
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </div>
      )}
    </div>
  );
}