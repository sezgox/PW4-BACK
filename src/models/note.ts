import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Note = sequelize.define('notes', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    showAll:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    user:{
        type: DataTypes.STRING,
        references: {model: 'users',key:'username'}
    }
})