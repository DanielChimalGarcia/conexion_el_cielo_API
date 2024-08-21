const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { jsonResponse } = require("../Lib/jsonResponse");

router.post("/", async (req, res) => {
  const token = req.header("Authorization");

  //console.log(token)
  const serverCurrentTime = new Date();
  console.log("Fecha actual del servidor:", serverCurrentTime);

  if (!token) {
    return res
      .status(401)
      .json(jsonResponse(401, { error: "Token de acceso no proporcionado" }));
  }

  try {
    // Verifica el token de acceso
    const decoded = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
    console.log(`verificado: ${decoded}`);

    // Si la verificación es exitosa, el token es válido
    res
      .status(200)
      .json(jsonResponse(200, { message: "Token de acceso válido" }));
  } catch (error) {
    console.error("Error al verificar el token de acceso:", error.message);
    res
      .status(401)
      .json(jsonResponse(401, { error: "Token de acceso inválido" }));
  }
});

module.exports = router;
