import { ResultSetHeader } from "mysql2";
import { UserPayload } from "../types/request";
import { executeQuery } from '../util/database'
import { getTimeStamp, getUnixTimeStamp } from "../util/date";
import bcrypt from 'bcrypt';

const addUser = async ({email, username, password, fullName, roleId}: UserPayload) => {
  const createdAt = getTimeStamp();
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await executeQuery(
    'INSERT INTO USERS (username, email, password, full_name, role_id, created_at) VALUES (?, ? ,?, ?, ?, ?)',
    [username, email, hashedPassword, fullName, roleId, createdAt]
  )
  
  return result.insertId;
}

export default {
  addUser,
}