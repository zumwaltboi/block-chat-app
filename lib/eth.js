import axios from 'axios';

export async function getTransactions(address) {
  const transactions = [];

  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=1Q1GHXZ7DDM9BDHD7GHEYTJK7BPRJBXC3J`
    );

    const data = response.data.result;

    for (const transaction of data) {
      const inputData = transaction.input;
      const inputDataString = Buffer.from(inputData.slice(2), 'hex').toString();

      transactions.push({
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        inputData: inputDataString,
      });
    }
  } catch (error) {
    console.error(error);
  }

  return transactions;
}