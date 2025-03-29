const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const bcrypt = require("bcrypt");

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
  
  db.query("SELECT * FROM medecin", (err, medecins) => {
    if (err) {
      console.error("Erreur lors de la récupération des médecins:", err);
      return res.status(500).send("Erreur serveur");
    }

        db.query("SELECT * FROM patient", (err, patients) => {
      if (err) {
        console.error("Erreur lors de la récupération des patients:", err);
        return res.status(500).send("Erreur serveur");
      }
      
      res.render("dashboardAdmin", {
        admin: req.session.admin,
        listeMed: medecins,
        listePatients: patients
      });
    });
  });
});

// 🔹 Afficher le formulaire d'ajout
router.get("/signup", (req, res) => {
  res.render("signup");
});

//Ajouter Patient
router.post("/signup", async (req, res) => {
  try {
    const { nom, prenom, email, tel, dateNaissance, genre, taille, poids, password } = req.body;
    const check = "SELECT * FROM patient WHERE email = ? OR num_tel = ?";
    db.query(check, [email, tel], async (err, results) => {
      if (err) {
        console.error("Erreur SQL (Vérification) :", err);
        return res.status(500).send("Erreur serveur");
      }

      if (results.length > 0) {
        return res.render("signup", { error: "L'email ou le numéro de téléphone existe déjà." ,formData: req.body});
      }
      const hashedPassword = await bcrypt.hash(password, 10);

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

          if (result.affectedRows === 0) {
            return res.status(500).send("Erreur lors de l'ajout du patient.");
          }

          const sqlGetUser = "SELECT * FROM patient WHERE id_patient = ?";
          db.query(sqlGetUser, [result.insertId], (err, users) => {
            if (err || users.length === 0) {
              console.error("Erreur lors de la récupération de l'utilisateur :", err);
              return res.status(500).send("Erreur serveur");
            }

            const user = users[0];

            req.session.user = {
              id: user.id_patient,
              name: user.nom,
              email: user.email,
            };

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
    res.redirect("/signin"); 
  });
});

router.get("/logoutAdmin", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/adminLogin"); 
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


router.get("/edit/:id",isAuthenticated,(req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM patient WHERE id_patient = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      res.send("Erreur lors de la récupération des données : " + err.message);
    } else {
      res.render("edit", { user: results[0]});
    }
  });
});

router.post("/update/:id",isAuthenticated,async (req, res) => {
  const { id } = req.params;  
  const { nom, prenom, email, tel, dateNaissance, taille, poids } = req.body; 
  const sql = "UPDATE patient SET nom = ?, prenom = ?, email = ?, num_tel = ?, date_naissance = ?, taille = ?, poids = ? WHERE id_patient = ?";
  
  db.query(sql, [nom, prenom, email, tel, dateNaissance, taille, poids, id], (err, result) => {
    if (err) {
      res.send("Erreur lors de la mise à jour : " + err.message);
    } else {
      res.redirect("/dashboard"); 
    }
  });
});


router.get("/dashboard", isAuthenticated, (req, res) => {
  const userId = req.session.user.id
    res.render("dashboard", {
      user: req.session.user 
    });
  });


router.get("/appointments",isAuthenticated,(req, res) => {
  const userId = req.session.user.id;
  db.query("SELECT DATE_FORMAT(date_RDV, '%d %M %Y') AS date_RDV,nom as doctor_name,heure_debut ,id_RDV FROM rdv,medecin as m WHERE id_patient = ? and m.id_medecin=rdv.id_medecin", [userId], (err, results) => {
    if (err) {
      res.send("Erreur: " + err.message);
      res.redirect("/appointments");
    }
      res.render('appointments', { appointments: results,user: req.session.user}); 
      
  });
});
router.get("/appointments/cancel/:id", isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const appointmentId = req.params.id;

  db.query(
    "DELETE FROM rdv WHERE id_patient = ? AND id_RDV = ?",
    [userId, appointmentId],
    (err, results) => {
      if (err) {
        res.send("Erreur : " + err.message);
        return res.redirect("/appointments");
      }
      
      if (results.affectedRows === 0) {
        res.send("Erreur  : " + err.message);
        return res.redirect("/appointments");
      }

      res.redirect("/appointments");
    }
  );
});


/*router.get("/appointments/cancel/:id",isAuthenticated,(req, res) => {
  const userId = req.session.user.id;
  const appointmentId = req.params.id;
  db.query("delete from rdv where id_patient=? and id_RDV=?", [userId,appointmentId], (err, results) => {
    req.flash('success', 'Appointment canceled successfully!');
    res.redirect("/appointments");
  });
});*/

router.get("/allMedecins",isAuthenticated,(req, res) => {
  //const userId = req.session.user.id;
  db.query("SELECT * FROM medecin ", (err, results) => {
      if (err) throw err;
      res.render('listemed', { listeMed: results,user: req.session.user });
      
  });
});

router.get("/prendreRdv/:id",isAuthenticated,(req, res) => {
  const medecinId = req.params.id;
  db.query("SELECT * FROM medecin WHERE id_medecin = ?", [medecinId], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
          const med = results[0];
          res.render("PageRDV", { med: med });
      } else {
          res.redirect("/allMedecins");
      }
  });
});

router.post("/prendreRdv/:id",isAuthenticated,(req, res) => {
  const medecinId = req.params.id; 
  const { date, heure } = req.body;

  const userId = req.session.user.id;

 const query = "INSERT INTO RDV (id_medecin, id_patient, date_RDV, heure_debut) VALUES (?, ?, ?, ?)";
  const values = [medecinId, userId, date, heure];

  db.query(query, values, (err, results) => {
      if (err) {
          console.error("Error inserting appointment:", err);
          return res.status(500).send("Error booking appointment.");
      }
      res.redirect("/dashboard");
  });
});
router.get("/AjoutMed",isAuthenticatedAdmin,(req, res) => {
  res.render("AjoutMed");
});
router.post("/AjoutMedecin", isAuthenticatedAdmin, async (req, res) => {
  const { prenom, nom, email, specialite, tel, localisation, prix, password, description } = req.body;
  
  try {
    const check = "SELECT * FROM medecin WHERE email = ? OR tel = ?";
    const checkResults = await new Promise((resolve, reject) => {
      db.query(check, [email, tel], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (checkResults.length > 0) {
      return res.render("AjoutMed", { error: "L'email ou le numéro de téléphone existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO medecin(nom, prenom, email, tel, specialite, description, password, prix_visite, localisation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const insertResults = await new Promise((resolve, reject) => {
      db.query(sql, [nom, prenom, email, tel, specialite, description, hashedPassword, prix, localisation], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (insertResults.affectedRows === 0) {
      return res.status(500).render("AjoutMed", { error: "Erreur lors de l'ajout du médecin." });
    }
    return res.render("AjoutMed", { success: "Médecin créé avec succès!" });
  } catch (err) {
    console.error("Erreur:", err);
    return res.status(500).render("AjoutMed", { error: "Erreur serveur" });
  }
});
module.exports = router;
