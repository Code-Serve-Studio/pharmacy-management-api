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
    (name, image, description, purchase_price, discount, selling_price, link_price, paramedic_price, retail_price, branch_price, unit_id, group_id, stock, size)
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

const insertProduct = async (product: ProductPayload) => {
  const {
    name,
    image,
    description,
    purchasePrice,
    discount,
    sellingPrice,
    linkPrice,
    paramedicPrice,
    retailPrice,
    branchPrice,
    unit,
    groupId,
    stock,
    size,
    categories,
    subCategories,
  } = product;

  const createdAt = new Date();
  const insertProductQuery = `INSERT INTO products
    (name, image, description, purchase_price, discount, selling_price, link_price, paramedic_price, retail_price, branch_price, unit_id, group_id, stock, size, created_at)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const result = await executeQuery(
    insertProductQuery,
    [name, image, description, purchasePrice, discount, sellingPrice, linkPrice, paramedicPrice, retailPrice, branchPrice, unit, groupId, stock, size, createdAt]
  );

  const productId = result.insertId;
  if (!productId) {
    throw new InvariantError('Produk gagal ditambahkan');
  }

  // Insert into product categories
  const insertProductCategoryQuery = 'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)';
  await Promise.all(categories.map(async (categoryId) => {
    const resultProductCategories = await executeQuery(insertProductCategoryQuery, [productId, categoryId]);
    if (!resultProductCategories.insertId) {
      throw new InvariantError('Gagal menambahkan kategori');
    }
  }));

  // Insert into product sub-categories
  const insertProductSubCategoryQuery = 'INSERT INTO product_sub_categories (product_id, sub_category_id) VALUES (?, ?)';
  await Promise.all(subCategories.map(async (subCategoryId) => {
    const resultProductSubCategories = await executeQuery(insertProductSubCategoryQuery, [productId, subCategoryId]);
    if (!resultProductSubCategories.insertId) {
      throw new InvariantError('Gagal menambahkan sub kategori');
    }
  }));

  return productId;
}

const selectProducts = async ({search, limit, page} : any) => {
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);

  const offset = (pageInt - 1) * limitInt;
  const query = `
    SELECT
        p.product_id,
        p.name,
        p.image,
        p.description,
        p.purchase_price,
        p.selling_price,
        p.link_price,
        p.retail_price,
        p.paramedic_price,
        p.branch_price,
        p.stock,
        p.size,
        p.discount,
        p.created_at,
        p.updated_at,
        p.deleted_at,
        u.name as unit_name,
        GROUP_CONCAT(DISTINCT c.category_name SEPARATOR '|||') as categories,
        GROUP_CONCAT(DISTINCT sc.sub_category_name SEPARATOR '|||') as sub_categories
    FROM
        products p
    LEFT JOIN units u ON p.unit_id = u.id
    LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    LEFT JOIN category c ON pc.category_id = c.category_id
    LEFT JOIN product_sub_categories psc ON p.product_id = psc.product_id
    LEFT JOIN sub_categories sc ON psc.sub_category_id = sc.sub_category_id
    WHERE
        p.name LIKE CONCAT('%', ?, '%')
        AND p.deleted_at IS NULL
    GROUP BY
        p.product_id
    ORDER BY
        p.created_at DESC
    LIMIT ? OFFSET ?;
  `;

  const countQuery = `
    SELECT COUNT(*) as count
    FROM products
    WHERE deleted_at IS NULL;
  `;

  await executeQuery('SET SESSION group_concat_max_len = 10000');

  const result = await selectQuery(query, [search, limitInt, offset]);
  const countResult = await selectQuery(countQuery);
  const totalProducts = countResult[0].count;

  const products = result.map((item) => ({
    ...item,
    categories: item.categories ? item.categories.split('|||') : [],
    sub_categories: item.sub_categories ? item.sub_categories.split('|||') : []
  }))  

  return {
    page: pageInt,
    limit: limitInt,
    totalProducts,
    data: products,
    totalPages: Math.ceil(totalProducts / limitInt),
  };

  // return result;/
}

const selectProductByCategory = async (type: string | undefined) => {
  let query;
  switch(type){
    case 'link':
      query = `SELECT product_id as id, name, image, link_price as price, stock FROM products WHERE link_price != 0 AND stock != 0 AND deleted_at IS NULL`;
    break;
    case 'paramedic':
      query = `SELECT product_id as id, name, image, paramedic_price as price, stock FROM products WHERE paramedic_price != 0 AND stock != 0 AND deleted_at IS NULL`;
    break;
    case 'retail':
      query = `SELECT product_id as id, name, image, retail_price as price, stock FROM products WHERE retail_price != 0 AND stock != 0 AND deleted_at IS NULL`;
    break;
    case 'branch':
      query = `SELECT product_id as id, name, image, branch_price as price, stock FROM products WHERE branch_price != 0 AND stock != 0 AND deleted_at IS NULL`;
    break;
    case 'purchase':
      query = `SELECT product_id as id, name, image, purchase_price as price, stock FROM products WHERE deleted_at IS NULL`;
    break;
    default :
      query = `SELECT product_id as id, name, image, selling_price as price, stock FROM products WHERE selling_price != 0 AND stock != 0 AND deleted_at IS NULL`;
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
      p.unit_id,
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
    throw new NotFoundError('Product tidak ditemukan')
  }
  

  const product = result[0];
  
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

const softDeleteProduct = async (id: string | number) => {
  const currentTimeStamp = new Date().toISOString(); // Menggunakan format ISO string untuk datetime
  const result = await executeQuery(
    'UPDATE products SET deleted_at = ? WHERE product_id = ?',
    [currentTimeStamp, id]
  );

  if (result.affectedRows === 0) {
    throw new Error('Produk gagal dihapus');
  }  

  return id; // Mengembalikan jumlah baris yang terpengaruh
}

const updateProduct = async (product: ProductPayload, id: string | number) => {
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

  const updateProductQuery = `UPDATE products SET
    name = ?, image = ?, description = ?, purchase_price = ?, discount = ?,
    selling_price = ?, link_price = ?, paramedic_price = ?, retail_price = ?,
    branch_price = ?, unit_id = ?, group_id = ?, stock = ?, size = ?
    WHERE product_id = ?`;

  const result = await executeQuery(
    updateProductQuery,
    [name, image, description, purchasePrice, discount, sellingPrice, linkPrice, paramedicPrice, retailPrice, branchPrice, unit, groupId, stock, size, id]
  );

  if (result.affectedRows === 0) {
    throw new InvariantError('Produk gagal diperbarui');
  }

  // Update product categories
  const updateProductCategoryQuery = 'UPDATE product_categories SET category_id = ? WHERE product_id = ?';
  await Promise.all(categories.map(async (categoryId) => {
    const resultProductCategories = await executeQuery(updateProductCategoryQuery, [categoryId, id]);
    if (resultProductCategories.affectedRows === 0) {
      throw new InvariantError('Gagal memperbarui kategori');
    }
  }));

  // Update product sub-categories
  const updateProductSubCategoryQuery = 'UPDATE product_sub_categories SET sub_category_id = ? WHERE product_id = ?';
  await Promise.all(subCategories.map(async (subCategoryId) => {
    const resultProductSubCategories = await executeQuery(updateProductSubCategoryQuery, [subCategoryId, id]);
    if (resultProductSubCategories.affectedRows === 0) {
      throw new InvariantError('Gagal memperbarui sub kategori');
    }
  }));

  return id;
}

const selectAllProducts = async () => {  
  const query = `
    SELECT
        p.product_id,
        p.name,
        p.image,
        p.description,
        p.purchase_price,
        p.selling_price,
        p.link_price,
        p.retail_price,
        p.paramedic_price,
        p.branch_price,
        p.stock,
        p.size,
        p.discount,
        p.created_at,
        p.updated_at,
        p.deleted_at,
        u.name as unit_name,
        GROUP_CONCAT(DISTINCT c.category_name SEPARATOR '|||') as categories,
        GROUP_CONCAT(DISTINCT sc.sub_category_name SEPARATOR '|||') as sub_categories
    FROM
        products p
    LEFT JOIN units u ON p.unit_id = u.id
    LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    LEFT JOIN category c ON pc.category_id = c.category_id
    LEFT JOIN product_sub_categories psc ON p.product_id = psc.product_id
    LEFT JOIN sub_categories sc ON psc.sub_category_id = sc.sub_category_id
    WHERE
        p.deleted_at IS NULL
    GROUP BY
        p.product_id
    ORDER BY
        p.created_at DESC
  `;

  await executeQuery('SET SESSION group_concat_max_len = 10000');

  const result = await selectQuery(query);

  const products = result.map((item) => ({
    ...item,
    categories: item.categories ? item.categories.split('|||').toString(',') : [],
    sub_categories: item.sub_categories ? item.sub_categories.split('|||').toString(',') : []
  }))
  
  console.log(products);
  
  return products;
}

export default {
  addProduct,
  selectProducts,
  selectProductById,
  selectProductByCategory,
  selectCriticalProduct,
  softDeleteProduct,
  insertProduct,
  updateProduct,
  selectAllProducts,
}