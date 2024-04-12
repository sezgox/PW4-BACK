"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize((_a = process.env.SQL_SCHEMA) !== null && _a !== void 0 ? _a : 'your_schema_name', 'root', process.env.SQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});
exports.default = sequelize;
