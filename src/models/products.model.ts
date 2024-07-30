import InvariantError from "@src/exceptions/InvariantError";
import NotFoundError from "@src/exceptions/NotFoundError";
import { ProductPayload } from "@src/types/request";
import { executeQuery, selectQuery } from "@src/utils/database";

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
    sellingPrice,
    discount,
  } = product;

  
  const result = await executeQuery(
    `INSERT INTO products
    (name, image, description, purchase_price, discount, selling_price, link_price, paramedic_price, retail_price, branch_price, unit, group_id, stock, size)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, image, description, purchasePrice, discount, sellingPrice, linkPrice, paramedicPrice, retailPrice, branchPrice, unit, groupId, stock, size]
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

const selectProductById = async ({id}: {id:string | number}) => {
  const result = await selectQuery(
    `SELECT * FROM products WHERE product_id = ?`,
    [id]
  )
  

  if(!result[0]){
    throw new NotFoundError('User tidak ditemukan')
  }

  return result[0];
}

export default {
  addProduct,
  selectProducts,
  selectProductById,
}