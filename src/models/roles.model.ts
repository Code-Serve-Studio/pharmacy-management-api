import { selectQuery } from "@utils/database";

const selectRoles = async () => {
  const query = 'SELECT role_id as id, role_name as name FROM roles';

  const result = await selectQuery(query);

  return result;
}


export default {
  selectRoles,
}