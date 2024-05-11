import { TransactionPayload } from "@src/types/request";
import { executeQuery, pool, queryGenerator, selectQuery } from "@utils/database";

const addTransaction = async (transaction: TransactionPayload) => {
  const {
    transactionType,
    userId,
    totalPrice,
    transactionDate,
    products
  } = transaction;

  let connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const transactionId = await executeQuery(
      `INSERT INTO transactions
      (transaction_type, user_id, total_price, transaction_date)
      VALUES
      (?, ?, ?, ?)`,
      [transactionType, userId, totalPrice, transactionDate]
    )
    
    // const values = products.map(({productId, quantity, price}) => {
    //   return `${transactionId.insertId}, ${productId}, ${quantity}, ${price}`
    // }).join(',')

    const values = products.map(({productId, quantity, price}) => {
      return [transactionId.insertId, productId, quantity, price]
    })

    const query = queryGenerator(`INSERT INTO transaction_details
    (transaction_id, product_id, quantity, price)
    VALUES ?`, [values]);
    

    await executeQuery(query)

    await connection.commit();
    return transactionId.insertId;
  } catch (error) {
    
    await connection.rollback();

    throw error
  }finally{
    if (connection) {
      connection.release();
    }
  }
}

const selectTransactions = async () => {
  const query = queryGenerator(`SELECT * FROM transactions`);
  const result = await selectQuery(query);  

  return result;
}

export default {
  addTransaction,
  selectTransactions,
}