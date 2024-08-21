const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../db");
const { jsonResponse } = require("../Lib/jsonResponse");

const diskstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images/imagescabana"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const flieupload = multer({
  storage: diskstorage,
}).single("image");

router.post("/", flieupload, (req, res) => {
  const id = req.body.id;
  console.log(req.body)
    const claveimage = Date.now()
  // Crear la carpeta con el nombre del 'id' si no existe
  const folderPath = path.join(__dirname, `../images/imagescabana/${id}`);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Mover y renombrar el archivo a la carpeta
  const newFileName = `${claveimage}_${id}.webp`;
  const newFilePath = path.join(folderPath, newFileName);
  fs.renameSync(req.file.path, newFilePath);

  req.file.filename = newFileName;
  req.file.path = newFilePath;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(
        "Error al obtener la conexión de la piscina: " + err.message
      );
      return res
        .status(500)
        .json(jsonResponse(500, { error: "Error interno del servidor" }));
    }

    const data = fs.readFileSync(path.join(__dirname, `../images/imagescabana/${id}/${req.file.filename}`))
    
    connection.query(
      "CALL insertar_foto(?, ?, ?)",
      [
        claveimage,
        id,
        data,
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
            .json(jsonResponse(409, { error: "Es Probable que la imagen ya exista" }));
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
});

module.exports = router;
