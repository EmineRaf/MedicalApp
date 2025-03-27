const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const bcrypt = require("bcrypt");

// Connexion à la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_patient",
});

db.connect((err) => {
  if (err) console.error("Erreur MySQL : " + err.message);
  else console.log("Connecté à MySQL !");
});


router.get("/", (req, res) => {
    
    res.render("homepage");
  });

  function isAuthenticated(req, res, next) {
    if (req.session.user) {
      next(); // Si l'utilisateur est connecté, on continue
    } else {
      res.redirect("/signin"); // Sinon, on le renvoie vers la connexion
    }
  }
  function isAuthenticatedAdmin(req, res, next) {
    if (req.session.admin) {
      next(); 
    } else {
      res.redirect("/adminLogin");
    }
  }
  
  router.get("/adminLogin", (req, res) => {
    res.render("loginAdmin");
  });
  router.post("/adminLogin",(req,res)=>{
    const { username, password } = req.body;
  const sql = "SELECT * FROM admins WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.render("loginAdmin", { error: "Erreur de la base de données.", username });
    }

    if (results.length === 0) {
      return res.render("loginAdmin", { error: "❌ admin non trouvé !", username });
    }

    const admin = results[0];
    const isMatch = password==admin.password;

    if (isMatch) {
      //Stocker les informations utilisateur en session
      req.session.admin = {
        id: admin.idadmin,
        name: admin.nom,
        username: admin.username,
      };
      

      //Sauvegarde la session avant de rediriger
      req.session.save(() => {
        res.redirect("/dashboardAdmin");
      });

    } else {
      res.render("loginAdmin", { error: "Mot de passe incorrect", username });
    }
  });
});
    
router.get("/dashboardAdmin", isAuthenticatedAdmin, (req, res) => {
  const adminId = req.session.admin.id;

    // Passer les données de l'utilisateur et les rendez-vous à la vue
    res.render("dashboardAdmin", {user: req.session.admin});
  });
// 🔹 Afficher le formulaire d'ajout
router.get("/signup", (req, res) => {
  res.render("signup");
});

//Ajouter Patient
router.post("/signup", async (req, res) => {
  try {
    const { nom, prenom, email, tel, dateNaissance, genre, taille, poids, password } = req.body;

    // Vérifier si l'email ou le numéro de téléphone existe déjà
    const check = "SELECT * FROM patient WHERE email = ? OR num_tel = ?";
    db.query(check, [email, tel], async (err, results) => {
      if (err) {
        console.error("Erreur SQL (Vérification) :", err);
        return res.status(500).send("Erreur serveur");
      }

      if (results.length > 0) {
        return res.render("signup", { error: "L'email ou le numéro de téléphone existe déjà." ,formData: req.body});
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer le patient
      const insert =
        "INSERT INTO patient (num_tel, nom, prenom, email, date_naissance, genre, taille, poids, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        insert,
        [tel, nom, prenom, email, dateNaissance, genre, taille, poids, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Erreur SQL (Insertion) :", err);
            return res.status(500).send("Erreur serveur lors de l'inscription");
          }

          // Vérifier si l'insertion a réussi
          if (result.affectedRows === 0) {
            return res.status(500).send("Erreur lors de l'ajout du patient.");
          }

          // Récupérer l'utilisateur inséré avec son ID
          const sqlGetUser = "SELECT * FROM patient WHERE id_patient = ?";
          db.query(sqlGetUser, [result.insertId], (err, users) => {
            if (err || users.length === 0) {
              console.error("Erreur lors de la récupération de l'utilisateur :", err);
              return res.status(500).send("Erreur serveur");
            }

            const user = users[0];

            // Stocker l'utilisateur en session
            req.session.user = {
              id: user.id_patient,
              name: user.nom,
              email: user.email,
            };

            // Sauvegarde de la session avant redirection
            req.session.save(() => {
              res.redirect("/dashboard");
            });
          });
        }
      );
    });
  } catch (error) {
    console.error("Erreur (catch) :", error);
    res.status(500).send("Erreur serveur");
  }
});



// Page de connexion (GET)
router.get("/signin", (req, res) => {
  res.render("signin");
});

// Page connexion (POST)
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM patient WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.render("signin", { error: "Erreur de la base de données.", email });
    }

    if (results.length === 0) {
      return res.render("signin", { error: "❌ Utilisateur non trouvé !", email });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      //Stocker les informations utilisateur en session
      req.session.user = {
        id: user.id_patient,
        name: user.nom,
        email: user.email,
      };
      

      //Sauvegarde la session avant de rediriger
      req.session.save(() => {
        res.redirect("/dashboard");
      });

    } else {
      res.render("signin", { error: "Mot de passe incorrect", email });
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/signin"); // Retourne à la page de connexion
  });
});




/*Supprimer un utilisateur
router.get("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM patient WHERE id_patient = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.send("Erreur lors de la suppression : " + err.message);
    else res.redirect("/");
  });
});
*/

//afficher le formulaire de modification
router.get("/edit/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM patient WHERE id_patient = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      res.send("Erreur lors de la récupération des données : " + err.message);
    } else {
      res.render("edit", { user: results[0] });
    }
  });
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;  
  const { nom, prenom, email, tel, dateNaissance, taille, poids } = req.body;  // Récupération des données du formulaire
  const sql = "UPDATE patient SET nom = ?, prenom = ?, email = ?, num_tel = ?, date_naissance = ?, taille = ?, poids = ? WHERE id_patient = ?";
  
  db.query(sql, [nom, prenom, email, tel, dateNaissance, taille, poids, id], (err, result) => {
    if (err) {
      res.send("Erreur lors de la mise à jour : " + err.message);
    } else {
      res.redirect("/dashboard");  // Redirection vers le tableau de bord après mise à jour
    }
  });
});


router.get("/dashboard", isAuthenticated, (req, res) => {
  const userId = req.session.user.id;

  // Récupérer les rendez-vous (RDV) de l'utilisateur depuis la table rdv
  const sql = "SELECT DATE_FORMAT(date_RDV, '%d %M %Y %H:%i:%s') AS date_RDV,nom as doctor_name,rdv.description FROM rdv,medecin as m WHERE id_patient = ? and m.id_medecin=rdv.id_medecin";
  db.query(sql, [userId], (err, rdv) => {
    if (err) {
      console.error(err);
      return res.render("dashboard", { error: "Erreur lors du chargement des rendez-vous." });
    }

    // Passer les données de l'utilisateur et les rendez-vous à la vue
    res.render("dashboard", {
      user: req.session.user,  // Assure-toi que user est passé ici
      appointments: rdv || [] // Si rdv est null ou undefined, envoie un tableau vide
    });
  });
});

router.get("/appointments", (req, res) => {
  const userId = req.session.user.id;
  db.query("SELECT DATE_FORMAT(date_RDV, '%d %M %Y %H:%i:%s') AS date_RDV,nom as doctor_name FROM rdv,medecin as m WHERE id_patient = ? and m.id_medecin=rdv.id_medecin", [userId], (err, results) => {
      if (err) throw err;
      res.render('appointments', { appointments: results,user: req.session.user });
      
  });
});

router.get("/appointments/cancel/:id",(req, res) => {
  const userId = req.session.user.id;
  db.query("delete from rdv where id_patient=? and id_RDV=?", [userId,appointments.id_RDV], (err, results) => {
    res.redirect("/appointments")
  });
});

router.get("/allMedecins", (req, res) => {
  const userId = req.session.user.id;
  db.query("SELECT * FROM medecin ", (err, results) => {
      if (err) throw err;
      res.render('listemed', { listeMed: results,user: req.session.user });
      
  });
});

router.get("/prendreRdv/:id",(req,res)=>{
  res.render("PageRDV");
});

module.exports = router;
