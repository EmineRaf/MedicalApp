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
    next();
  } else {
    res.redirect("/signin");
  }
}

function isAuthenticatedAdmin(req, res, next) {
  if (req.session.admin) {
    next(); 
  } else {
    res.redirect("/adminLogin");
  }
}
function isAuthenticatedMed(req, res, next) {
  if (req.session.med) {
    next();
  } else {
    res.redirect("/signinMed");
  }
}

// Admin Login
router.get("/adminLogin", (req, res) => {
  res.render("loginAdmin", { error: null, username: "" });
});

router.post("/adminLogin", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM admins WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.render("loginAdmin", { 
        error: "Erreur de la base de données.", 
        username 
      });
    }

    if (results.length === 0) {
      return res.render("loginAdmin", { 
        error: "❌ admin non trouvé !", 
        username 
      });
    }

    const admin = results[0];
    const isMatch = password === admin.password;

    if (isMatch) {
      req.session.admin = {
        id: admin.idadmin,
        name: admin.nom,
        username: admin.username,
      };
      
      req.session.save(() => {
        res.redirect("/dashboardAdmin");
      });
    } else {
      res.render("loginAdmin", { 
        error: "Mot de passe incorrect", 
        username 
      });
    }
  });
});

// Admin Dashboard
router.get("/dashboardAdmin", isAuthenticatedAdmin, (req, res) => {
  db.query("SELECT * FROM medecin", (err, medecins) => {
    if (err) {
      console.error("Erreur lors de la récupération des médecins:", err);
      return res.render("dashboardAdmin", { 
        admin: req.session.admin,
        error: "Erreur lors de la récupération des médecins"
      });
    }

    db.query("SELECT * FROM patient", (err, patients) => {
      if (err) {
        console.error("Erreur lors de la récupération des patients:", err);
        return res.render("dashboardAdmin", { 
          admin: req.session.admin,
          error: "Erreur lors de la récupération des patients"
        });
      }
      db.query("SELECT count(id_patient) as countPat FROM patient", (err, ress) => {
        if (err) {
          console.error("Erreur lors de la récupération des patients:", err);
          return res.render("dashboardAdmin", { 
            admin: req.session.admin,
          });
        }
      
      res.render("dashboardAdmin", {
        admin: req.session.admin,
        listeMed: medecins,
        listePatients: patients,
        counting:ress,
        error: null
      });
    });
  });
});
});

// Patient Signup
router.get("/signup", (req, res) => {
  res.render("signup", { error: null, formData: {} });
});

router.post("/signup", async (req, res) => {
  try {
    const { nom, prenom, email, tel, dateNaissance, genre, taille, poids, password } = req.body;
    const check = "SELECT * FROM patient WHERE email = ? OR num_tel = ?";
    
    db.query(check, [email, tel], async (err, results) => {
      if (err) {
        console.error("Erreur SQL (Vérification) :", err);
        return res.render("signup", { 
          error: "Erreur serveur", 
          formData: req.body 
        });
      }

      if (results.length > 0) {
        return res.render("signup", { 
          error: "L'email ou le numéro de téléphone existe déjà.",
          formData: req.body
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insert = "INSERT INTO patient (num_tel, nom, prenom, email, date_naissance, genre, taille, poids, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      
      db.query(insert, [tel, nom, prenom, email, dateNaissance, genre, taille, poids, hashedPassword], (err, result) => {
        if (err) {
          console.error("Erreur SQL (Insertion) :", err);
          return res.render("signup", { 
            error: "Erreur serveur lors de l'inscription",
            formData: req.body
          });
        }

        if (result.affectedRows === 0) {
          return res.render("signup", { 
            error: "Erreur lors de l'ajout du patient.",
            formData: req.body
          });
        }

        const sqlGetUser = "SELECT * FROM patient WHERE id_patient = ?";
        db.query(sqlGetUser, [result.insertId], (err, users) => {
          if (err || users.length === 0) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err);
            return res.render("signup", { 
              error: "Erreur lors de la création de la session",
              formData: req.body
            });
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
      });
    });
  } catch (error) {
    console.error("Erreur (catch) :", error);
    res.render("signup", { 
      error: "Erreur serveur",
      formData: req.body
    });
  }
});

// Patient Signin
router.get("/signin", (req, res) => {
  res.render("signin", { error: null, email: "" });
});
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM patient WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.render("signin", { 
        error: "Erreur de la base de données.", 
        email 
      });
    }

    if (results.length === 0) {
      return res.render("signin", { 
        error: "❌ Utilisateur non trouvé !", 
        email 
      });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.user = {
        id: user.id_patient,
        name: user.prenom,
        email: user.email,
      };
      
      req.session.save(() => {
        res.redirect("/dashboard");
      });
    } else {
      res.render("signin", { 
        error: "Mot de passe incorrect", 
        email 
      });
    }
  });
});



router.get("/signinMed", (req, res) => {
  res.render("signinMed", { error: null, email: "" });
});

router.post("/signinMed", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM medecin WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.render("signinMed", { 
        error: "Erreur de la base de données.", 
        email 
      });
    }

    if (results.length === 0) {
      return res.render("signinMed", { 
        error: "❌ Utilisateur non trouvé !", 
        email 
      });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.med = {
        id: user.id_medecin,
        name: user.nom,
        email: user.email,
      };
      
      req.session.save(() => {
        res.redirect("/dashboardMed");
      });
    } else {
      res.render("signinMed", { 
        error: "Mot de passe incorrect", 
        email 
      });
    }
  });
});

router.get("/listePatients", isAuthenticatedMed, (req, res) => {
  const medID = req.session.med.id;

  db.query("SELECT nom,prenom,DATE_FORMAT(date_RDV, '%d %M %Y') AS date_RDV,heure_debut FROM patient p,rdv r where r.id_medecin=? and r.id_patient=p.id_patient",[medID], (err, listePatients) => {
    if (err) {
      return res.render("listePatients", { 
        listePatients: [],
        user: req.session.med,
        error: "Erreur lors de la récupération des patients"
      });
    }
    res.render('listePatients', { 
      listePatients: listePatients,
      user: req.session.med,
      error: null
    });
  });
});
router.get("/infoPatient", isAuthenticatedMed, (req, res) => {
  res.render("infoPatient", {
    user: req.session.med,
    error: null
  });
});
// Logout
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

router.get("/logoutMed", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/signinMed"); 
  });
});
// Edit Patient Profile
router.get("/edit/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM patient WHERE id_patient = ?";
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.render("edit", { 
        user: null, 
        error: "Erreur lors de la récupération des données" 
      });
    }
    res.render("edit", { 
      user: results[0],
      error: null
    });
  });
});

router.post("/update/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;  
  const { nom, prenom, email, tel, dateNaissance, taille, poids } = req.body;
  const sql = "UPDATE patient SET nom = ?, prenom = ?, email = ?, num_tel = ?, date_naissance = ?, taille = ?, poids = ? WHERE id_patient = ?";
  
  db.query(sql, [nom, prenom, email, tel, dateNaissance, taille, poids, id], (err, result) => {
    if (err) {
      return res.render("edit", { 
        user: req.body, 
        error: "Erreur lors de la mise à jour" 
      });
    }
    res.redirect("/dashboard"); 
  });
});

// Dashboard
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.session.user,
    error: null
  });
});
router.get("/dashboardMed", isAuthenticatedMed, (req, res) => {
  res.render("dashboardMed", {
    user: req.session.med,
    error: null
  });
});

// Appointments
router.get("/appointments", isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  db.query("SELECT DATE_FORMAT(date_RDV, '%d %M %Y') AS date_RDV,nom as doctor_name,heure_debut ,id_RDV FROM rdv,medecin as m WHERE id_patient = ? and m.id_medecin=rdv.id_medecin", [userId], (err, results) => {
    if (err) {
      return res.render("appointments", { 
        appointments: [],
        user: req.session.user,
        error: "Erreur lors de la récupération des rendez-vous"
      });
    }
    res.render('appointments', { 
      appointments: results,
      user: req.session.user,
      error: null
    }); 
  });
});

router.post("/appointments/cancel/:id", isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const appointmentId = req.params.id;

  db.query(
    "DELETE FROM rdv WHERE id_patient = ? AND id_RDV = ?",
    [userId, appointmentId],
    (err, results) => {
      if (err) {
        return res.render("appointments", { 
          appointments: [],
          user: req.session.user,
          error: "Erreur lors de l'annulation du rendez-vous"
        });
      }
      
      if (results.affectedRows === 0) {
        return res.render("appointments", { 
          appointments: [],
          user: req.session.user,
          error: "Rendez-vous non trouvé"
        });
      }

      res.redirect("/appointments");
    }
  );
});

// Doctors List
router.get("/allMedecins", isAuthenticated, (req, res) => {
  db.query("SELECT * FROM medecin ", (err, results) => {
    if (err) {
      return res.render("listemed", { 
        listeMed: [],
        user: req.session.user,
        error: "Erreur lors de la récupération des médecins"
      });
    }
    res.render('listemed', { 
      listeMed: results,
      user: req.session.user,
      error: null
    });
  });
});
router.get("/listePatients",isAuthenticatedMed,(req,res)=>{
  const userId = req.session.user.id;


})

// Utility functions
const getDayOfWeek = (date) => {
  const day = new Date(date).getDay();
  return day === 0 ? 6 : day;
};

// Book Appointment
router.get("/prendreRdv/:id", isAuthenticated, async (req, res) => {
  try {
    const medecinId = req.params.id;
    const selectedDate = req.query.date || new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(selectedDate).getDay();

    // 1. Récupération du médecin
    const medecin = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM medecin WHERE id_medecin = ?", [medecinId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });

    if (!medecin) {
      return res.render("PageRDV", { 
        error: "Médecin non trouvé",
        noSchedule: true
      });
    }

    // 2. Récupération du planning
    const schedules = await new Promise((resolve, reject) => {
      db.query(`
        SELECT * FROM doctor_schedule 
        WHERE id_medecin = ? 
        AND day_of_week = ? 
        AND is_active = 1
      `, [medecinId, dayOfWeek], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // 3. Récupération des RDV existants
    const existingAppointments = await new Promise((resolve, reject) => {
      db.query(`
        SELECT heure_debut 
        FROM rdv 
        WHERE id_medecin = ? 
        AND date_RDV = ?
      `, [medecinId, selectedDate], (err, results) => {
        if (err) return reject(err);
        resolve(results.map(r => r.heure_debut));
      });
    });

    // 4. Génération des créneaux disponibles
    let availableSlots = [];
    
    if (schedules.length > 0) {
      for (const schedule of schedules) {
        const slots = generateTimeSlots(
          schedule.start_time,
          schedule.end_time,
          schedule.slot_duration,
          existingAppointments,
          selectedDate
        );
        availableSlots = [...availableSlots, ...slots];
      }
    }

    res.render("PageRDV", {
      med: medecin,
      selectedDate,
      availableSlots,
      noSchedule: schedules.length === 0, // true si aucun planning n'est défini pour ce jour
      error: schedules.length === 0 ? "Le médecin ne travaille pas ce jour" : null
    });

  } catch (err) {
    console.error("ERREUR:", err);
    res.render("PageRDV", {
      error: "Erreur technique",
      noSchedule: true
    });
  }
});

// Fonction pour générer les créneaux horaires
function generateTimeSlots(startTime, endTime, duration, bookedSlots, selectedDate) {
  const slots = [];
  
  // Convertir en objets Date pour faciliter les comparaisons
  const start = new Date(`${selectedDate}T${startTime}`);
  const end = new Date(`${selectedDate}T${endTime}`);
  
  let current = new Date(start);
  
  while (current < end) {
    const timeString = current.toTimeString().substring(0, 8);
    const isBooked = bookedSlots.includes(timeString);
    
    if (!isBooked) {
      slots.push({
        time: timeString,
        displayTime: timeString.substring(0, 5) // Format HH:MM
      });
    }
    
    // Ajouter la durée du créneau
    current.setMinutes(current.getMinutes() + duration);
  }
  
  return slots;
}

function formatTimeDisplay(timeString) {
  if (!timeString) return '';
  return timeString.toString().substring(0, 5); // Format HH:MM
}

// AJAX endpoint for time slots
router.get("/prendreRdv/:id/slots", isAuthenticated, async (req, res) => {
  try {
    const medecinId = req.params.id;
    const selectedDate = req.query.date;
    const dayOfWeek = getDayOfWeek(selectedDate);
    
    // Récupérer le planning du médecin
    const schedule = await new Promise((resolve, reject) => {
      db.query(`
        SELECT * FROM doctor_schedule 
        WHERE id_medecin = ? AND day_of_week = ? AND is_active = 1
      `, [medecinId, dayOfWeek], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });

    if (!schedule) {
      return res.json({
        success: true,
        noSchedule: true,
        message: "Le médecin n'a pas de disponibilités ce jour"
      });
    }

    // Récupérer les RDV déjà pris
    const existingAppointments = await new Promise((resolve, reject) => {
      db.query(`
        SELECT heure_debut 
        FROM rdv 
        WHERE id_medecin = ? AND date_RDV = ?
      `, [medecinId, selectedDate], (err, results) => {
        if (err) reject(err);
        resolve(results.map(r => r.heure_debut));
      });
    });

    // Générer les créneaux disponibles
    const availableSlots = generateTimeSlots(
      schedule.start_time,
      schedule.end_time,
      schedule.slot_duration,
      existingAppointments,
      selectedDate
    );

    res.json({
      success: true,
      noSchedule: false,
      availableSlots,
      message: availableSlots.length === 0 ? "Aucun créneau disponible" : ""
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});

// Book Appointment POST
router.post("/prendreRdv/:id", isAuthenticated, async (req, res) => {
  try {
    const medecinId = req.params.id;
    const { date, heure } = req.body;
    const userId = req.session.user.id;

    // Vérifier si le créneau est toujours disponible
    const checkQuery = `
      SELECT COUNT(*) as count 
      FROM rdv 
      WHERE id_medecin = ? 
      AND date_RDV = ? 
      AND heure_debut = ?
    `;
    
    const checkResult = await new Promise((resolve, reject) => {
      db.query(checkQuery, [medecinId, date, heure], (err, results) => {
        if (err) reject(err);
        resolve(results[0].count > 0);
      });
    });

    if (checkResult) {
      const medecin = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM medecin WHERE id_medecin = ?", [medecinId], (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        });
      });

      return res.render("PageRDV", {
        med: medecin,
        selectedDate: date,
        error: "Ce créneau horaire est déjà réservé. Veuillez en choisir un autre.",
        availableSlots: [],
        noSchedule: false
      });
    }

    // Insérer le nouveau RDV
    const insertQuery = `
      INSERT INTO rdv (id_medecin, id_patient, date_RDV, heure_debut) 
      VALUES (?, ?, ?, ?)
    `;
    
    await new Promise((resolve, reject) => {
      db.query(insertQuery, [medecinId, userId, date, heure], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    res.redirect("/appointments");

  } catch (err) {
    console.error("Erreur lors de la réservation :", err);
    res.render("PageRDV", {
      med: { id_medecin: req.params.id },
      selectedDate: req.body.date,
      error: "Une erreur est survenue lors de la réservation",
      availableSlots: [],
      noSchedule: false
    });
  }
});
// Add Doctor
router.get("/AjoutMed", isAuthenticatedAdmin, (req, res) => {
  res.render("AjoutMed", { error: null, success: null });
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
      return res.render("AjoutMed", { 
        error: "L'email ou le numéro de téléphone existe déjà.",
        success: null
      });
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
      return res.render("AjoutMed", { 
        error: "Erreur lors de l'ajout du médecin.",
        success: null
      });
    }
    return res.render("AjoutMed", { 
      success: "Médecin créé avec succès!",
      error: null
    });
  } catch (err) {
    console.error("Erreur:", err);
    return res.render("AjoutMed", { 
      error: "Erreur serveur",
      success: null
    });
  }
});
router.get("/calender",(req,res)=> {
  res.render("calendrier");
});

module.exports = router;