const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jsonResponse } = require("../Lib/jsonResponse");
const pool = require("../db");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(jsonResponse(400, { error: "Se requieren Los campos" }));
  }

  //Autenticar usuario
  // Autenticar usuario con el procedimiento almacenado
  try{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //console.log(password)
    //console.log(hashedPassword)

    pool.getConnection((err, connection) => {
      if (err) {
        console.error(
          "Error al obtener la conexión de la piscina: " + err.message
        );
        return res
          .status(500)
          .json(jsonResponse(500, { error: "Error interno del servidor" }));
      }
  
      connection.query("CALL AuthDueno(?)", [email], (err, results) => {
        connection.release()
  
        if (err) {
          console.error("Error al ejecutar el procedimiento almacenado: " + err.message);
          return res.status(500).json(jsonResponse(500, { error: "Error interno del servidor" }));
        }
  
        const authResult = results;
        //console.log(authResult[0][0].pasword_dueno)

        if(results.length >0 && results[0][0] && results[0][0].pasword_dueno){
          const hashedPasswordInDB = results[0][0].pasword_dueno;

          bcrypt.compare(password, hashedPasswordInDB, (compareErr, passwordMatch) => {
            if (compareErr) {
              console.error(compareErr);
              return res
                .status(500)
                .json(jsonResponse(500, { error: "Error interno del servidor al comparar contraseñas" }));
            }
    
            if (passwordMatch) {
              // Contraseñas coinciden, generamos tokens
              const accessToken = jwt.sign({ email }, process.env.ACCES_TOKEN_SECRET, { expiresIn: "15m", algorithm: "HS256" });
              const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d", algorithm: "HS256" });
    
              const user = {
                id: results[0][0].Numero_Socio,
                email: email,
              };
    
              res.status(200).json(jsonResponse(200, { user, accessToken, refreshToken }));
            } else {
              // Contraseñas no coinciden
              res.status(401).json(jsonResponse(401, { error: "Alguno de los Datos no es correcto" }));
            }
          });
        }else {
          // Usuario no encontrado
          res.status(401).json(jsonResponse(401, { error: "Alguno de los Datos no es correcto" }));
        } 
        
      });
    });
  } catch(error) {
    console.error("Error al encriptar la contraseña: " + error.message);
    return res.status(500).json(jsonResponse(500, { error: "Error interno del servidor" }));
  }

  

  
});

module.exports = router;
