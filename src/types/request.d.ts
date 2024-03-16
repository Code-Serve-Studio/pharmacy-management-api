export type UserPayload = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  email: string;
  roleId: number;
}

export type LoginPayload = {
  username: string;
  password: string;
}