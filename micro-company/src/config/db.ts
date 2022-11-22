import mysql from 'mysql2';
import { Sequelize } from 'sequelize';

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: (process.env.DB_ENV) ? 'mysql-micro-company-test' : 'mysql-micro-company'
};

const connection = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
});

connection.query(
  `CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`
);

connection.end();

const db = new Sequelize(
    config.database,
    config.user,
    config.password,
    { 
        dialect: 'mysql',
        host: config.host,
        port: config.port
    }
);

export {
    db
};