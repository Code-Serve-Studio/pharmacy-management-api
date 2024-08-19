import AuthenticationError from "@src/exceptions/AuthenticationError";
import InvariantError from "@src/exceptions/InvariantError";
import { LoginPayload } from "@src/types/request";
import { executeQuery, selectQuery } from "@src/utils/database";
import bcrypt from 'bcryptjs';

const verifyUserCredential = async ({username, password}: LoginPayload) => {
  const query = `SELECT
    users.user_id as id,
    users.full_name as fullName,
    users.photo_profile as image,
    users.password as hashedPassword,
    roles.role_name as role
    FROM users
    JOIN roles ON users.role_id = roles.role_id
    WHERE username = ?
  `
  const result = await selectQuery(query, [username]);
  if(!result.length) {
    throw new InvariantError('username tidak ditemukan');
  }  

  const {hashedPassword, ...restData} = result[0];

  const match = await bcrypt.compare(password, hashedPassword);

  if(!match){
    throw new AuthenticationError('Kredensial yang anda berikan salah');
  }

  return {...restData}
}

const addRefreshToken = async (token: string) => {
  await executeQuery(
    'INSERT INTO authentications VALUES(?)',
    [token]
  )
}

export {
  verifyUserCredential,
  addRefreshToken,
}