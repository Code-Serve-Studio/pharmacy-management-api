import NotFoundError from "@src/exceptions/NotFoundError";
import { executeQuery, selectQuery } from "@utils/database"

const selectGroup = async () => {
  const result = await selectQuery(
    `SELECT * FROM groups`
  );
  
  return result;
}

export default {
  selectGroup,
}