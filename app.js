const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors"); // Agrega esta línea
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const app = express();
const port = 3001;

app.use(cors()); // Habilita CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dbimages")))

const jwt = require("jsonwebtoken");

app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/user", require("./routes/user"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/refresh-token", require("./routes/refreshTokens"));
app.use("/api/signout", require("./routes/signout"));
app.use("/api/check-auth", require("./routes/checkAuth"));
app.use("/api/imagescabana/post", require("./routes/uploadImage"));
app.use("/api/imagescabana/get", require("./routes/getimage"));
// Configura la conexión a MySQL
const db = mysql.createConnection({
  host: "buhymhakbwai119kskrw-mysql.services.clever-cloud.com",
  user: "ux2q0dywdexzvkun",
  password: "ZYqt2Ils1oUdDUdIbCDw",
  database: "buhymhakbwai119kskrw",
});

// Conéctate a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a MySQL: " + err.message);
  } else {
    console.log("Conectado a MySQL");
  }
});

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Endpoint para obtener datos de la base de datos
app.get("/api/:consulta", (req, res) => {
  const consulta = req.params.consulta;
  const sql = `${consulta}`;
  //console.log(`esto esta aqui ${sql}`);
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta: " + err.message);
      res.status(500).send("Error del servidor");
    } else {
      res.json(result); // Devolvemos solo el primer resultado
      //console.log(result[0]);
    }
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
