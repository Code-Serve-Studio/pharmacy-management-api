import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@utils/databseV2';

// Definisikan antarmuka untuk atribut Role
interface RoleAttributes {
    id: number;
    name: string;
}

// Definisikan antarmuka untuk atribut Role yang opsional saat membuat Role
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

// Definisikan model Role
class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public name!: string;
}

// Inisialisasi model Role
Role.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
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