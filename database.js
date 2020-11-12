const mysql = require("mysql");
const { promisify } = require("util");

const pool  = mysql.createPool({
    host: "localhost",
    user: "root", 
    password: "",
    database: "coBIM"
});

{pool.getConnection((err, connection) => {

if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
    console.log("DATABASE HAS TO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
    console.log("DATABASE CONNECTION WAS REFUSED");
    }
}
if (connection) {
    connection.release();
    console.log("DB is connected");
}

});

//promisify pool query
pool.query = promisify(pool.query);
pool.getConnection = promisify(pool.getConnection).bind(pool);

// Para las transacciones
const getConnection = async () => {
const connection = await pool.getConnection();
const query = promisify(connection.query).bind(connection);
const beginTransaction = promisify(connection.beginTransaction).bind(connection);
const commit = promisify(connection.commit).bind(connection);
const rollback = promisify(connection.rollback).bind(connection);
const release = promisify(connection.release).bind(connection);

return Promise.resolve({ query, beginTransaction, commit, rollback, release });
}

module.exports = { pool, getConnection };}