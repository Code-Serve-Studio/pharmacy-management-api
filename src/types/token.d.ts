export type TokenPayload = {
  id: string;
  fullName: string;
  image: string;
  role: string;
  roleId: number;
}

export type DecodePayload = TokenPayload & {
  iat: number,
}