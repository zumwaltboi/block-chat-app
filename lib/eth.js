import axios from 'axios';
import Web3 from 'web3';

export async function getTransactions(address) {
  const transactions = [];

  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=1Q1GHXZ7DDM9BDHD7GHEYTJK7BPRJBXC3J&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`
    );

    const data = response.data.result;

    for (const transaction of data) {
      const inputData = transaction.input;
      const inputDataString = Buffer.from(inputData.slice(2), 'hex').toString();

      const timestamp = new Date(transaction.timeStamp * 1000).toUTCString();
      const blockNumber = transaction.blockNumber;
      const value = Web3.utils.fromWei(transaction.value, 'ether');


      transactions.push({
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        inputData: inputDataString,
        timestamp: timestamp,
        blockNumber: blockNumber,
        value: value,
      });
    }
  } catch (error) {
    console.error(error);
    return [];
  }

  return transactions;
}