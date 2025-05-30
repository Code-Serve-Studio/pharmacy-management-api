import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DBNAME || 'db_name',
  process.env.DBUSER || 'db_user',
  process.env.DBPASSWORD,
  {
    host: process.env.DBHOST || 'localhost',
    dialect: 'mysql',
  }
)

export default sequelize;