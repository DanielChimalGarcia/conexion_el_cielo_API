const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jsonResponse } = require("../Lib/jsonResponse");
const pool = require("../db");


router.get("/", (req, res) => {
    //const {correo, contrasenia,rol, Nombre, Ape1, Ape2, Telefono, CURP} =req.body
    const sql = `CALL OBTENER_ROL()`;
    //console.log(`esto esta aqui ${sql}`);
    pool.query(sql, (err, result) => {
      if (err) {
        console.error("Error al ejecutar la consulta: " + err.message);
        res.status(500).send("Error del servidor");
      } else {
        res.json(result); // Devolvemos solo el primer resultado
        //res.send('Registro Insertado')
        //console.log(result);
      }
    });
  });


  module.exports = router;