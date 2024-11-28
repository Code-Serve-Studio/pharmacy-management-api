import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@utils/databseV2';

// Definisikan antarmuka untuk atribut Permission
interface PermissionAttributes {
    id: number;
    role_id: number;
    module: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
}

// Definisikan antarmuka untuk atribut Permission yang opsional saat membuat Permission
interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id'> {}

// Definisikan model Permission
class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
    public id!: number;
    public role_id!: number;
    public module!: string;
    public can_create!: boolean;
    public can_read!: boolean;
    public can_update!: boolean;
    public can_delete!: boolean;
}

// Inisialisasi model Permission
Permission.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        role_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        module: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        can_create: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        can_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        can_update: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        can_delete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'permissions',
        sequelize, // passing the `sequelize` instance is required
    }
);

export default Permission;