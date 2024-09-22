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
    `SELECT
      p.product_id as id,
      p.name,
      p.description,
      p.image,
      p.purchase_price as purchasePrice,
      p.selling_price as sellingPrice,
      p.link_price as linkPrice,
      p.paramedic_price as paramedicPrice,
      p.retail_price as retailPrice,
      p.branch_price as branchPrice,
      p.unit,
      p.group_id as groupId,
      p.stock,
      p.size,
      p.discount,
      GROUP_CONCAT(DISTINCT c.category_id) as categoryIds,
      GROUP_CONCAT(DISTINCT c.category_name) as categoryNames,
      GROUP_CONCAT(DISTINCT sc.sub_category_id) as subCategoryIds,
      GROUP_CONCAT(DISTINCT sc.sub_category_name) as subCategoryNames
    FROM products p
    LEFT JOIN 
      product_categories pc ON p.product_id = pc.product_id
    LEFT JOIN 
      category c ON pc.category_id = c.category_id
    LEFT JOIN 
      product_sub_categories psc ON p.product_id = psc.product_id
    LEFT JOIN 
      sub_categories sc ON psc.sub_category_id = sc.sub_category_id
    WHERE p.product_id = ?
    GROUP BY p.product_id`,
    [id]
  )
  

  if(!result[0]){
    throw new NotFoundError('User tidak ditemukan')
  }
  

  const product = result[0];
  console.log(product);
  
  product.categoryIds = product.categoryIds ? product.categoryIds.split(',').map(Number) : [];
  product.categoryNames = product.categoryNames ? product.categoryNames.split(',') : [];
  product.subCategoryIds = product.subCategoryIds ? product.subCategoryIds.split(',').map(Number) : [];
  product.subCategoryNames = product.subCategoryNames ? product.subCategoryNames.split(',') : [];

  return product;
}

const selectCriticalProduct = async () => {
  const result = await selectQuery(
    `SELECT * FROM products WHERE stock <= 10`
  )
  return result;
}

export default {
  addProduct,
  selectProducts,
  selectProductById,
  selectProductByCategory,
  selectCriticalProduct
}