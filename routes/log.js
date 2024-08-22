const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jsonResponse } = require("../Lib/jsonResponse");
const pool = require("../db");




router.post("/", (req, res) => {
    const {correo, contrasenia,rol, Nombre, Ape1, Ape2, Telefono, CURP} =req.body
    const sql = `CALL INSERTAR_PERSONA(?, ? ,?, ?,?,?, ?, ?);`;
    //console.log(`esto esta aqui ${sql}`);
    pool.query(sql, [correo, contrasenia,rol, Nombre, Ape1, Ape2, Telefono, CURP],
        (err, result) => {
      if (err) {
        console.error("Error al ejecutar la consulta: " + err.message);
        res.status(500).send("Error del servidor");
      } else {
        //res.json(result); // Devolvemos solo el primer resultado
        res.send('Registro Insertado')
        //console.log(result);
      }
    });
  });


  router.post("/validar", (req, res) => {
    const {correo, contrasenia} =req.body
    const sql = `CALL VALIDAR_USUARIO(?,?)`;
    //console.log(`esto esta aqui ${sql}`);
    pool.query(sql, [correo, contrasenia],
        (err, result) => {
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