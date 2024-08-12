import InvariantError from "@src/exceptions/InvariantError";
import { TransactionPayload } from "@src/types/request";
import { executeQuery, pool, queryGenerator, selectQuery } from "@utils/database";

const addTransaction = async (transaction: TransactionPayload) => {
  const {
    transactionType,
    userId,
    totalPrice,
    products,
    revenueType,
  } = transaction;

  let connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const transactionId = await executeQuery(
      `INSERT INTO transactions
      (transaction_type, revenue_type, user_id, total_price)
      VALUES
      (?, ?, ?, ?)`,
      [transactionType, revenueType, userId, totalPrice]
    )
    
    // const values = products.map(({productId, quantity, price}) => {
    //   return `${transactionId.insertId}, ${productId}, ${quantity}, ${price}`
    // }).join(',')

    const values = products.map(({productId, quantity, price}) => {
      return [transactionId.insertId, productId, quantity, price]
    })

    const detailTransactionQuery = `INSERT INTO transaction_details
    (transaction_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)`;
    
    values.forEach(async (item) => {
      const resultDetailTransaction = await executeQuery(detailTransactionQuery, item);

      if(!resultDetailTransaction.insertId){
        throw new InvariantError('gagal menambahkan detail transaction');
      }
    })
    

    // await executeQuery(query)/

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