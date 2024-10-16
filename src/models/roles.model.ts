import InvariantError from "@src/exceptions/InvariantError";
import Permission from "@src/tabels/permissions.tabel";
import Role from "@src/tabels/roles.table";
import { selectQuery } from "@utils/database";

const selectRoles = async () => {
  const query = 'SELECT role_id as id, role_name as name FROM roles';

  const result = await selectQuery(query);

  return result;
}

const postRole = async ({role, permission}: any) => {
  const resultRole = await Role.create({
    name: role
  });

  const permissionPromises = permission.map(async (permission: any) => {
    return Permission.create({
      module: permission.module,
      can_create: permission.can_create,
      can_read: permission.can_read,
      can_update: permission.can_update,
      can_delete: permission.can_delete,
      role_id: resultRole.id,
    });
  });

  await Promise.all(permissionPromises);

  if(resultRole.id) {
    throw new InvariantError('Role gagal ditambahkan');
  }

  return resultRole.id;
}


export default {
  selectRoles,
  postRole,
}