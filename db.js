const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "el_cielo3",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
