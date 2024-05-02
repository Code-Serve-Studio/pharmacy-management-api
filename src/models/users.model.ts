import InvariantError from "../exceptions/InvariantError";
import { UserPayload } from "../types/request";
import { executeQuery } from "../utils/database";
import { getTimeStamp } from "../utils/date";

import bcrypt from 'bcryptjs';

const addUser = async ({email, username, password, fullName, roleId}: UserPayload) => {
  const createdAt = getTimeStamp();
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await executeQuery(
    'INSERT INTO USERS (username, email, password, full_name, role_id, created_at) VALUES (?, ? ,?, ?, ?, ?)',
    [username, email, hashedPassword, fullName, roleId, createdAt]
  )  

  if(!result.insertId){
    throw new InvariantError('User gagal ditambahkan')
  }

  return result.insertId;
}

export default {
  addUser,
}