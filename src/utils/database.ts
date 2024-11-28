import mysql, {ResultSetHeader, RowDataPacket, Pool } from 'mysql2/promise'

const pool: Pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectTimeout: 60000
})

const executeQuery = async (
  query: string,
  params: Array<string | number | Date | any> = []
): Promise<ResultSetHeader> => {
  const [result] = await pool.execute<ResultSetHeader>(query, params);
  return result;
}

const selectQuery = async (
  query: string,
  params: Array<string | number | Date> = []
): Promise<RowDataPacket[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows;
}

const queryGenerator = (
  query: string,
  params: Array<string | number | Date | any> = []
) => {
  return mysql.format(query, params)
}

export {
  pool,
  executeQuery,
  selectQuery,
  queryGenerator,
};