import { selectQuery } from "@utils/database"

const selectUnits = async () => {
  const result = await selectQuery(
    `SELECT * FROM units`
  );

  return result;
}

export default {
  selectUnits,
}