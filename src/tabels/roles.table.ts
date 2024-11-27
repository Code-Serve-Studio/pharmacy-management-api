import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@utils/databseV2';

// Definisikan antarmuka untuk atribut Role
interface RoleAttributes {
    role_id: number;
    role_name: string;
}

// Definisikan antarmuka untuk atribut Role yang opsional saat membuat Role
interface RoleCreationAttributes extends Optional<RoleAttributes, 'role_id'> {}

// Definisikan model Role
class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public role_id!: number;
    public role_name!: string;
}

// Inisialisasi model Role
Role.init(
    {
        role_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        role_name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: 'roles',
        sequelize, // passing the `sequelize` instance is required
    }
);

export default Role;