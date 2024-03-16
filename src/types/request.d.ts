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

export type ProductPayload = {
  name: string;
  image: string;
  description: string;
  purchasePrice: number;
  linkPrice: number;
  retailPrice: number;
  paramedicPrice: number;
  branchPrice: number;
  unit: string;
  groupId: number;
  stock: number;
  size: string;
}