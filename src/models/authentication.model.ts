import AuthenticationError from "@src/exceptions/AuthenticationError";
import InvariantError from "@src/exceptions/InvariantError";
import { LoginPayload } from "@src/types/request";
import { executeQuery, selectQuery } from "@src/utils/database";
import bcrypt from 'bcryptjs';

const verifyUserCredential = async ({username, password}: LoginPayload) => {
  const result = await selectQuery(
    'SELECT user_id, password FROM users WHERE username = ?',
    [username]
  )
  if(!result.length) {
    throw new InvariantError('username tidak ditemukan');
  }

  const {id, password: hashedPassword} = result[0];

  const match = await bcrypt.compare(password, hashedPassword);

  if(!match){
    throw new AuthenticationError('Kredensial yang anda berikan salah');
  }

  return {userId: id}
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