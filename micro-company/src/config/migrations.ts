import Sequelize from "sequelize";
import { db } from "@config/db";

const companiesTable = db.define('companies',
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
        }
    }
)

export {
    companiesTable
};