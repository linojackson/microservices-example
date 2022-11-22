import Sequelize from "sequelize";
import { db } from "@config/db";

const employeesTable = db.define('employees',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        company: {
            type: Sequelize.STRING,
        }
    }
)

export {
    employeesTable
};