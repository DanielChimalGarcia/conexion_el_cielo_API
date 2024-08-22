const mysql = require("mysql");

const dbConfig = {
  host: "buhymhakbwai119kskrw-mysql.services.clever-cloud.com",
  user: "ux2q0dywdexzvkun",
  password: "ZYqt2Ils1oUdDUdIbCDw",
  database: "buhymhakbwai119kskrw",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
