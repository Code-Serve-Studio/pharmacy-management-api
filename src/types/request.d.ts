export type UserPayload = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  roleId: number;
  image: string;
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
  sellingPrice: number;
  linkPrice: number;
  retailPrice: number;
  paramedicPrice: number;
  branchPrice: number;
  unit: string;
  groupId: number;
  stock: number;
  size: string;
  discount: number;
}

export type ProductTransaction = {
  productId: string | number;
  quantity: number;
  price: number;
}

export type TransactionPayload = {
  transactionType: 'in' | 'out';
  userId: string | number;
  totalPrice: number;
  transactionDate: string | number;
  products: ProductTransaction[]
}