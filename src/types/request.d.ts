export type UserPayload = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  roleId: number;
  image: string;
}

export type UserPayloadUpdate = {
  username: string;
  email: string;
  fullName: string;
  roleId: number;
  image: string;
  id: string | number;
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
  categories: number[],
  subCategories: number[],
}

export type ProductTransaction = {
  productId: string | number;
  quantity: number;
  price: number;
}

export type TransactionPayload = {
  revenueType: 'in' | 'out';
  transactionType: string;
  userId: string | number;
  totalPrice: number;
  transactionDate: string | number;
  products: ProductTransaction[]
}