import { Sequelize } from "sequelize";
import dotenv from "dotenv";

//modificaciones en .ENV requieren reinicio de server
dotenv.config({ path: ".env" });

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS ?? "",
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        define: {
            timestamps: true,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        operatorsAliases: false,
    }
);

export default db;
