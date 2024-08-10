// config inicial
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


app.use(cors()); // Habilita o CORS para todas as rotas

// forma de ler json / middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());



// rotas da api
const personRoutes = require('./routes/personRoutes')

app.use("/person", personRoutes)

// rota inicial / endpoint
app.get("/", (req, res) => {
  //mostrar req
  res.json({ message: "Oi express" });
});

// entregar uma porta
const DB_USER = "admin";
const DB_PASSWORD = "admin";

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.my1xm.mongodb.net/bancodaapi?retryWrites=true&w=majority&appName=APICluster`
  )
  .then(() => {
    console.log("Conectamos ao mongoDB");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
