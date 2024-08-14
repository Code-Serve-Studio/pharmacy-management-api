import InvariantError from "@src/exceptions/InvariantError";
import NotFoundError from "@src/exceptions/NotFoundError";
import { productQueryParams } from "@src/types/queryParams";
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
    categories,
    subCategories,
  } = product;

  const insertProductQuery = `INSERT INTO products
    (name, image, description, purchase_price, discount, selling_price, link_price, paramedic_price, retail_price, branch_price, unit, group_id, stock, size)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

  
  const result = await executeQuery(
    insertProductQuery,
    [name, image, description, purchasePrice, discount, sellingPrice, linkPrice, paramedicPrice, retailPrice, branchPrice, unit, groupId, stock, size]
  );

  const productId = result.insertId;
  if(!result.insertId){
    throw new InvariantError('User gagal ditambahkan')
  }
  // insert into product categories
  const insertProductCategoryQuery = 'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)';
  const productCategories = categories.map(categoryId => [productId, categoryId]);
  
  productCategories.forEach(async (item) => {
    const resultProductCategories = await executeQuery(insertProductCategoryQuery, item);
  
    if(!resultProductCategories.insertId){
      throw new InvariantError('gagal menambahkan category')
    }
  })

  const insertProductSubCategoryQuery = 'INSERT INTO product_sub_categories (product_id, sub_category_id) VALUES (?, ?)';
  const productSubCategories = subCategories.map(subCategoryId => [productId, subCategoryId]);

  productSubCategories.forEach(async (item) =>{
    const resultProductSubCategories = await executeQuery(insertProductSubCategoryQuery, item);
    
    if(!resultProductSubCategories.insertId){
      throw new InvariantError('gagal menambahkan sub category')
    }
  })


  return result.insertId;
}

const selectProducts = async () => {
  const result = await selectQuery(
    'SELECT * FROM products'
  );

  return result;
}

const selectProductByCategory = async (type: string | undefined) => {
  let query;
  switch(type){
    case 'link':
      query = `SELECT product_id as id, name, image, link_price as price, stock FROM products WHERE link_price != 0 AND stock != 0`;
    break;
    case 'paramedic':
      query = `SELECT product_id as id, name, image, paramedic_price as price, stock FROM products WHERE paramedic_price != 0 AND stock != 0`;
    break;
    case 'retail':
      query = `SELECT product_id as id, name, image, retail_price as price, stock FROM products WHERE retail_price != 0 AND stock != 0`;
    break;
    case 'branch':
      query = `SELECT product_id as id, name, image, branch_price as price, stock FROM products WHERE branch_price != 0 AND stock != 0`;
    break;
    case 'purchase':
      query = `SELECT product_id as id, name, image, purchase_price as price, stock FROM products`;
    break;
    default :
      query = `SELECT product_id as id, name, image, selling_price as price, stock FROM products WHERE selling_price != 0 AND stock != 0`;
    break;
  }

  const result = await selectQuery(query);
  

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
  selectProductByCategory,
}