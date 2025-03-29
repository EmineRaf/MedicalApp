const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const usersRoutes = require("./routes/users");
const session = require("express-session");
const bcrypt = require("bcrypt");


const app = express();
const port = 3000;

// Configuration EJS pour afficher les fichiers HTML
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));



// Configuration de la session avant les routes utilisateurs
app.use(session({
  secret: "secret_key", // Clé secrète pour signer la session
  resave: false,
  saveUninitialized: false
}));


// Routes pour gérer les utilisateurs
app.use("/", usersRoutes);


app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
