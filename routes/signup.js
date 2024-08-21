const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { jsonResponse } = require("../Lib/jsonResponse");
const pool = require("../db");

router.post("/", async (req, res) => {
  const { nombre, ap1, ap2, email, password } = req.body;

  if (!nombre || !ap1 || !ap2 || !email || !password) {
    return res
      .status(400)
      .json(jsonResponse(400, { error: "Se requieren los campos" }));
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(password);
    console.log(hashedPassword);

    pool.getConnection((err, connection) => {
      if (err) {
        console.error(
          "Error al obtener la conexión de la piscina: " + err.message
        );
        return res
          .status(500)
          .json(jsonResponse(500, { error: "Error interno del servidor" }));
      }

      connection.query(
        "CALL insertar_dueños(?, ?, ?, ?, ?)",
        [
          nombre.toUpperCase(),
          ap1.toUpperCase(),
          ap2.toUpperCase(),
          email,
          hashedPassword,
        ],
        (err, results) => {
          connection.release();

          if (err) {
            console.error(
              "Error al ejecutar el procedimiento almacenado: " + err.message
            );
            return res
              .status(500)
              .json(jsonResponse(500, { error: "Error interno del servidor" }));
          }

          const result = results[0][0];

          if (result.result === "409") {
            return res
              .status(409)
              .json(jsonResponse(409, { error: "El usuario ya existe" }));
          } else if (result.result === "201") {
            return res
              .status(200)
              .json(jsonResponse(200, { message: "Registro completo" }));
          } else {
            return res
              .status(500)
              .json(jsonResponse(500, { error: "Error interno del servidor" }));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error al encriptar la contraseña: " + error.message);
    return res
      .status(500)
      .json(jsonResponse(500, { error: "Error interno del servidor" }));
  }
});

module.exports = router;
