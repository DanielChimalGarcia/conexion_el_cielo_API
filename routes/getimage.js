const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../db");
const { jsonResponse } = require("../Lib/jsonResponse");

router.get("/:id", (req, res) => {
  //const id = req.body.id;
  const id = req.params.id;
  //const id = 231
  //console.log(req.params)
  const folderPath = path.join(__dirname, `../dbimages/imagescabana/${id}`);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(
        "Error al obtener la conexión de la piscina: " + err.message
      );
      return res
        .status(500)
        .json(jsonResponse(500, { error: "Error interno del servidor" }));
    }

    connection.query("CALL getImages(?)", [id], (err, results) => {
      connection.release();

      if (err) {
        console.error(
          "Error al ejecutar el procedimiento almacenado: " + err.message
        );
        return res
          .status(500)
          .json(jsonResponse(500, { error: "Error interno del servidor" }));
      }else{
        results[0].map(item => {
            const filePath = path.join(__dirname, `../dbimages/imagescabana/${id}/${item.Numero_Foto}_${id}.webp`);
            
            fs.writeFile(filePath, item.url_foto, (err) => {
              if (err) {
                //console.error(`Error al escribir el archivo ${filePath}: ${err.message}`);
              } else {
                //console.log(`Archivo ${filePath} guardado correctamente`);
              }
            });
        });
          

        const imgdir = fs.readdirSync(path.join(__dirname, `../dbimages/imagescabana/${id}/`))
        res.json(imgdir)
      }
    });
  });
});

module.exports = router;
