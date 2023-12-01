const sql = require('mssql');

require("dotenv").config();

const connectDatabase = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PWD,
    server: process.env.DATABASE_SERVER,
    database: process.env.DATABASE_DATA,
    trustServerCertificate: true,
    port: 1433
};

sql.connect(connectDatabase, function (err) {
    if (err) console.log(err);
    else console.log("Database is connected.");
});

module.exports = connectDatabase;