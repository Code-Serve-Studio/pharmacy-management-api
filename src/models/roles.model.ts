import InvariantError from "@src/exceptions/InvariantError";
import Permission from "@src/tabels/permissions.tabel";
import Role from "@src/tabels/roles.table";
import { selectQuery } from "@utils/database";

const selectRoles = async () => {
  const query = 'SELECT role_id as id, role_name as name, createdAt FROM roles';

  const result = await selectQuery(query);

  return result;
}

const selectDetailRole = async (roleId: number) => {
  const rows = await selectQuery(`
    SELECT r.role_name, p.module, p.can_create, p.can_read, p.can_update, p.can_delete
    FROM roles r
    LEFT JOIN permissions p ON r.role_id = p.role_id
    WHERE r.role_id = ?
  `, [roleId]);

  if (rows.length === 0) {
    return new InvariantError('Role tidak ditemukan');
  }  

  const permissions = rows.reduce((acc: any, row: any) => {
    acc[row.module] = {
      create: row.can_create,
      read: row.can_read,
      update: row.can_update,
      delete: row.can_delete,
    };
    return acc;
  }, {});

  const result = {
    roleName: rows[0].role_name,
    permissions,
  };

  return result;
}

const postRole = async ({roleName, permissions}: any) => {
  const role = await Role.create({
    role_name: roleName
  });

  if (!role || !role.role_id) {
    throw new InvariantError('Role gagal ditambahkan');
  }

  const permissionArray  = Object.entries(permissions).map(([module, perm]: any) => ({
    module,
    can_create: perm.create,
    can_read: perm.read,
    can_update: perm.update,
    can_delete: perm.delete,
    role_id: role.role_id, // mengacu ke role yang baru saja dibuat
  }));

  await Permission.bulkCreate(permissionArray);

  return role.role_id;
}

const putRole = async ({permissions, roleId}: any) => {
  
  if (!permissions || typeof permissions !== 'object') {
    return new InvariantError('Data permissions tidak valid.');
  }

  const permissionPromises = Object.entries(permissions).map(async ([module, perms]: any) => {
    const [updated] = await Permission.update(
      {
        can_create: perms.create,
        can_read: perms.read,
        can_update: perms.update,
        can_delete: perms.delete,
      },
      {
        where: {
          role_id: roleId,
          module: module,
        },
      }
    );

    if (updated === 0) {
      throw new Error(`No permissions updated for module: ${module}`);
    }
  });

  await Promise.all(permissionPromises);

  return roleId;
}


export default {
  selectRoles,
  postRole,
  selectDetailRole,
  putRole,
}