import { selectQuery } from "@utils/database"

const selectCategory = async () => {
  const result = await selectQuery(
    `SELECT 
      c.id,
      c.name,
      s.id as sub_category_id,
      s.name,
      COALESCE(s.tax_percentage, c.tax_percentage) AS tax_percentage
      FROM 
          category c
      LEFT JOIN 
          sub_category s ON c.id = s.category_id
      ORDER BY 
          c.id, s.id;
    `
  )

  return result
}

export default {
  selectCategory,
}