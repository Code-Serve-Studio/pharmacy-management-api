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

    const updateStockQuery = `UPDATE products SET stock = stock - ? WHERE products.product_id = ?`;

    products.forEach(async (item) => {
      const resultUpdateStock = await executeQuery(updateStockQuery, [item.quantity, item.productId]);
      console.log(resultUpdateStock);
      
      if(resultUpdateStock.affectedRows === 0){
        throw new InvariantError('gagal mengupdate stock');
      }
    })

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

  const query = `SELECT
    transactions.transaction_id as id,
    transactions.transaction_type as transactionType,
    transactions.revenue_type as revenueType,
    transactions.transaction_date as transactionDate,
    transactions.total_price as totalPrice,
    users.username as pic
    FROM transactions
    JOIN  users ON transactions.user_id = users.user_id
  `;
  const result = await selectQuery(query);  

  return result;
}

export default {
  addTransaction,
  selectTransactions,
}