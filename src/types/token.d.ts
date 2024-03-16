export type TokenPayload = {
  userId: string;
}

export type DecodePayload = TokenPayload & {
  iat: number,
}