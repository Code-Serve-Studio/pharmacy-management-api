export type TokenPayload = {
  id: string;
  fullName: string;
  image: string;
  role: string;
}

export type DecodePayload = TokenPayload & {
  iat: number,
}