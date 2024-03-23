import { Sequelize } from "sequelize";

const sequelize = new Sequelize ('myNotes', 'root', 'klkmanin2000', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;