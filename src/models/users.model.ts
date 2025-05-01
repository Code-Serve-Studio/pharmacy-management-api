import InvariantError from "@src/exceptions/InvariantError";
import NotFoundError from "@src/exceptions/NotFoundError";
import { UserPayload, UserPayloadUpdate } from "@src/types/request";
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

  const query = `SELECT
    users.user_id as id,
    users.full_name as fullName,
    users.username,
    users.email,
    users.status,
    roles.role_name as role
    FROM users
    JOIN roles ON users.role_id = roles.role_id
  `
  const result = await selectQuery(query);

  return result;
}

const selectUserById = async (id: number | string) => {
  const query = `SELECT
    users.user_id as id,
    users.full_name as fullName,
    users.photo_profile as image,
    users.username,
    users.email,
    users.status,
    roles.role_name as role,
    users.role_id as roleId
    FROM users
    JOIN roles ON users.role_id = roles.role_id
    WHERE users.user_id = ?
  `
  const result = await selectQuery(query, [id]);

  if(!result[0]){
    throw new NotFoundError('User tidak ditemukan')
  }

  return result[0];
}

const updateUser = async ({email, username, fullName, roleId, image, id}: UserPayloadUpdate) => {
  const createdAt = getTimeStamp();

  const result = await executeQuery(
    'UPDATE users SET email = ?, username = ?, full_name = ?, role_id = ?, photo_profile = ? WHERE user_id = ?',
    [email, username, fullName, roleId, image, id]
  )

  if(result.affectedRows === 0){
    throw new InvariantError('User gagal diperbarui');
  }

  return id;
}

const updatePassword = async (id: number | string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await executeQuery(
    'UPDATE users SET password = ? WHERE user_id = ?',
    [hashedPassword, id]
  )

  if(result.affectedRows === 0){
    throw new InvariantError('Password gagal diperbarui');
  }

  return id;
}

const updateStatus = async (id: number | string, status: string) => {
  const result = await executeQuery(
    'UPDATE users SET status = ? WHERE user_id = ?',
    [status, id]
  )
  if(result.affectedRows === 0){
    throw new InvariantError('Status gagal diperbarui');
  }
  return id;
}

const deleteUser = async (id: number | string) => {
  const result = await executeQuery(
    'DELETE FROM users WHERE user_id = ?',
    [id]
  )

  if(result.affectedRows === 0){
    throw new InvariantError('User gagal dihapus');
  }

  return id;
}

export default {
  addUser,
  selectQuery,
  selectUsers,
  selectUserById,
  updateUser,
  updatePassword,
  updateStatus,
  deleteUser,
}