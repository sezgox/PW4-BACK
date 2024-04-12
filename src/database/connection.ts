import { Sequelize } from "sequelize";

const sequelize = new Sequelize (process.env.SQL_SCHEMA ?? 'your_schema_name', 'root', process.env.SQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;