import InvariantError from "@src/exceptions/InvariantError";
import { UserPayload } from "@src/types/request";
import { executeQuery, selectQuery } from "@src/utils/database";
import { getTimeStamp } from "@utils/date";

import bcrypt from 'bcryptjs';

const addUser = async ({email, username, password, fullName, roleId, image}: UserPayload) => {
  const createdAt = getTimeStamp();
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await executeQuery(
    'INSERT INTO users (photo_profile, username, email, password, full_name, role_id, created_at) VALUES (?, ?, ? ,?, ?, ?, ?)',
    [image, username, email, hashedPassword, fullName, roleId, createdAt]
  )  

  if(!result.insertId){
    throw new InvariantError('User gagal ditambahkan')
  }

  return result.insertId;
}

const selectUsers = async() => {
  const result = await selectQuery(
    'SELECT * FROM users'
  );

  return result;
}

export default {
  addUser,
  selectQuery,
  selectUsers,
}