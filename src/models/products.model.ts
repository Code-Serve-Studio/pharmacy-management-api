import InvariantError from "@src/exceptions/InvariantError";
import { ProductPayload } from "@src/types/request";
import { executeQuery, selectQuery } from "@utils/database";

const addProduct = async (product: ProductPayload) => {
  const {
    name,
    image,
    description,
    purchasePrice,
    linkPrice,
    paramedicPrice,
    retailPrice,
    branchPrice,
    unit,
    groupId,
    stock,
    size,
  } = product;

  const result = await executeQuery(
    `INSERT INTO products
    (name, image, description, purchase_price, link_price, paramedic_price, retail_price, branch_price, unit, group_id, stock, size)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, image, description, purchasePrice, linkPrice, paramedicPrice, retailPrice, branchPrice, unit, groupId, stock, size]
  );

  if(!result.insertId){
    throw new InvariantError('User gagal ditambahkan')
  }

  return result.insertId;
}

const selectProducts = async () => {
  const result = await selectQuery(
    'SELECT * FROM products'
  );

  return result;
}

export default {
  addProduct,
  selectProducts,
}