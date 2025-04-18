-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 18 avr. 2025 à 23:24
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_patient`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `idadmin` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(25) NOT NULL,
  `prenom` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`idadmin`, `username`, `password`, `nom`, `prenom`) VALUES
(1, 'admin1', 'admin', 'amineadmin', 'rafadmin');

-- --------------------------------------------------------

--
-- Structure de la table `doctor_schedule`
--

CREATE TABLE `doctor_schedule` (
  `id_schedule` int(11) NOT NULL,
  `id_medecin` int(11) NOT NULL,
  `day_of_week` tinyint(1) NOT NULL COMMENT '0=Sunday, 1=Monday, ..., 6=Saturday',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `slot_duration` int(11) NOT NULL DEFAULT 30 COMMENT 'in minutes',
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `doctor_schedule`
--

INSERT INTO `doctor_schedule` (`id_schedule`, `id_medecin`, `day_of_week`, `start_time`, `end_time`, `slot_duration`, `is_active`) VALUES
(1, 1, 1, '09:00:00', '14:00:00', 30, 1),
(2, 1, 2, '09:00:00', '13:00:00', 30, 1),
(3, 1, 3, '09:00:00', '14:00:00', 30, 1),
(4, 1, 4, '09:00:00', '12:00:00', 30, 1),
(5, 1, 5, '09:00:00', '14:00:00', 30, 1),
(17, 2, 1, '10:00:00', '15:00:00', 30, 1),
(18, 2, 2, '08:00:00', '12:00:00', 30, 1),
(19, 2, 3, '10:00:00', '13:00:00', 30, 1),
(20, 2, 4, '09:00:00', '11:00:00', 30, 1),
(21, 2, 5, '10:00:00', '15:00:00', 30, 1);

-- --------------------------------------------------------

--
-- Structure de la table `emploi_du_temps`
--

CREATE TABLE `emploi_du_temps` (
  `id_medecin` int(11) NOT NULL,
  `id_RDV` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `emploi_du_temps`
--

INSERT INTO `emploi_du_temps` (`id_medecin`, `id_RDV`) VALUES
(1, 32);

-- --------------------------------------------------------

--
-- Structure de la table `medecin`
--

CREATE TABLE `medecin` (
  `id_medecin` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tel` int(8) NOT NULL,
  `specialite` varchar(100) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `prix_visite` float NOT NULL,
  `localisation` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `medecin`
--

INSERT INTO `medecin` (`id_medecin`, `nom`, `prenom`, `email`, `tel`, `specialite`, `description`, `password`, `prix_visite`, `localisation`) VALUES
(1, 'Amel', 'Ghoul', 'Ghoul.amel@medecin.com', 0, 'Ophtalmologue', 'Spécialiste en maladies cardiovasculaires', '0', 60, 'Bizerte'),
(2, 'baklouti', 'mustapha', 'mustapha.baklouti@medecin.com', 72458263, 'Cardiologie', '', '$2b$10$3krR.rAdpqm/kTT4rgz7eOarJ2KzQ.DySL314SmSdHehkS8vNV9Sa', 60, 'Bizerte');

-- --------------------------------------------------------

--
-- Structure de la table `ordonnance`
--

CREATE TABLE `ordonnance` (
  `id_ordonnance` int(11) NOT NULL,
  `listMed` varchar(50) DEFAULT NULL,
  `dateOrd` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ordonnance`
--

INSERT INTO `ordonnance` (`id_ordonnance`, `listMed`, `dateOrd`) VALUES
(1, 'Paracétamol 500mg, Vitamine C', '2025-03-10 11:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `patient`
--

CREATE TABLE `patient` (
  `id_patient` int(11) NOT NULL,
  `num_tel` int(8) NOT NULL,
  `nom` varchar(12) NOT NULL,
  `prenom` varchar(12) NOT NULL,
  `email` varchar(40) NOT NULL,
  `date_naissance` date NOT NULL,
  `genre` enum('homme','femme') NOT NULL,
  `taille` float DEFAULT NULL,
  `poids` float DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `patient`
--

INSERT INTO `patient` (`id_patient`, `num_tel`, `nom`, `prenom`, `email`, `date_naissance`, `genre`, `taille`, `poids`, `password`) VALUES
(1, 12345678, 'Dupont', 'Jean', 'jean.dupont@email.com', '1985-06-15', 'homme', 1.75, 70.5, ''),
(3, 56897841, 'ali', 'ben youssef', 'exemple@yahoo.fr', '2004-03-04', 'homme', 165, 89, ''),
(4, 92059010, 'amine', 'rafrafi', 'eminerae02@gmail.com', '0000-00-00', '', 178, 89, '$2b$10$Jt3u5J1GRJ6jMjDfa0kLueIE2x8zPzqPQkMVRm0jzE.gFMtpiR0Ye'),
(7, 25469874, 'monjia', 'rafrafi', 'monjia@gmail.com', '2007-10-16', 'femme', 164, 75, '$2b$10$1LhtvWjlwPQ9cLOftbdebuziNCCqME8rKz7LB5XNJfgd0AU8vjnYy'),
(10, 56894841, 'halima', 'rafrafi', 'halima@gmail.com', '2007-10-16', 'femme', 164, 75.56, '$2b$10$JY18X1o.FeMPjxqcJiru../8T8f2hEVrJG2xrUmYtJKoZROsAkPn.'),
(19, 14527895, 'ahmed', 'affouri', 'pcfamille2020@gmail.com', '2011-02-02', 'homme', 150, 40, '$2b$10$5KUHaaEvB2O3NddUbTORV.pnMjAYOXvQAzWr7x1V9kYDYrswwsdC.'),
(23, 92057010, 'Amine', 'Rafrafi', 'rafrafiamine2004@gmail.com', '2004-08-17', 'homme', 180, 90, '$2b$10$vpauUgsll8Op.IznIuY/HezUeKZBQN4A4Dj54BdYskybWJfoVZ73K'),
(24, 11445566, 'rawena', 'bensaleh', 'rawen@test.com', '2013-02-27', 'femme', 130, 45, '$2b$10$hhnMV152Ki4t5CmvpQT85exvj/J9zD3HXkwOpF38BWxmpWhlhazfm'),
(25, 55448896, 'amine', 'rafrafi', 'test@gmail.com', '2009-06-27', 'homme', 0, 0, '$2b$10$aftZPZbHOZhopxIPtEjXF.VKqKwPasrknDLW1bL1jLuIBk5anhHOW');

-- --------------------------------------------------------

--
-- Structure de la table `rapport`
--

CREATE TABLE `rapport` (
  `id_rapport` int(11) NOT NULL,
  `date_rapport` date NOT NULL,
  `description` text DEFAULT NULL,
  `id_RDV` int(11) NOT NULL,
  `id_ordonnance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `rapport`
--

INSERT INTO `rapport` (`id_rapport`, `date_rapport`, `description`, `id_RDV`, `id_ordonnance`) VALUES
(1, '2025-03-10', 'Examen général, tout est normal.', 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `rdv`
--

CREATE TABLE `rdv` (
  `id_RDV` int(11) NOT NULL,
  `date_RDV` date NOT NULL,
  `id_patient` int(11) NOT NULL,
  `id_medecin` int(11) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  `heure_debut` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `rdv`
--

INSERT INTO `rdv` (`id_RDV`, `date_RDV`, `id_patient`, `id_medecin`, `description`, `heure_debut`) VALUES
(32, '2025-04-22', 25, 1, NULL, '09:30:00');

--
-- Déclencheurs `rdv`
--
DELIMITER $$
CREATE TRIGGER `after_rdv_insert` AFTER INSERT ON `rdv` FOR EACH ROW BEGIN
    INSERT INTO emploi_du_temps (id_medecin, id_RDV) 
    VALUES (NEW.id_medecin, NEW.id_RDV);
END
$$
DELIMITER ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`idadmin`);

--
-- Index pour la table `doctor_schedule`
--
ALTER TABLE `doctor_schedule`
  ADD PRIMARY KEY (`id_schedule`),
  ADD KEY `id_medecin` (`id_medecin`);

--
-- Index pour la table `emploi_du_temps`
--
ALTER TABLE `emploi_du_temps`
  ADD PRIMARY KEY (`id_medecin`,`id_RDV`),
  ADD KEY `id_RDV` (`id_RDV`);

--
-- Index pour la table `medecin`
--
ALTER TABLE `medecin`
  ADD PRIMARY KEY (`id_medecin`),
  ADD UNIQUE KEY `tel` (`tel`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `ordonnance`
--
ALTER TABLE `ordonnance`
  ADD PRIMARY KEY (`id_ordonnance`) USING BTREE;

--
-- Index pour la table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`id_patient`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `num_tel` (`num_tel`);

--
-- Index pour la table `rapport`
--
ALTER TABLE `rapport`
  ADD PRIMARY KEY (`id_rapport`,`id_RDV`),
  ADD UNIQUE KEY `id_RDV` (`id_RDV`),
  ADD KEY `id_ordonnance` (`id_ordonnance`);

--
-- Index pour la table `rdv`
--
ALTER TABLE `rdv`
  ADD PRIMARY KEY (`date_RDV`,`id_patient`,`id_medecin`),
  ADD UNIQUE KEY `id_RDV` (`id_RDV`),
  ADD KEY `id_patient` (`id_patient`),
  ADD KEY `id_medecin` (`id_medecin`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `idadmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `doctor_schedule`
--
ALTER TABLE `doctor_schedule`
  MODIFY `id_schedule` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `medecin`
--
ALTER TABLE `medecin`
  MODIFY `id_medecin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `ordonnance`
--
ALTER TABLE `ordonnance`
  MODIFY `id_ordonnance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `patient`
--
ALTER TABLE `patient`
  MODIFY `id_patient` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `rapport`
--
ALTER TABLE `rapport`
  MODIFY `id_rapport` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `rdv`
--
ALTER TABLE `rdv`
  MODIFY `id_RDV` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `doctor_schedule`
--
ALTER TABLE `doctor_schedule`
  ADD CONSTRAINT `doctor_schedule_ibfk_1` FOREIGN KEY (`id_medecin`) REFERENCES `medecin` (`id_medecin`) ON DELETE CASCADE;

--
-- Contraintes pour la table `emploi_du_temps`
--
ALTER TABLE `emploi_du_temps`
  ADD CONSTRAINT `emploi_du_temps_ibfk_1` FOREIGN KEY (`id_medecin`) REFERENCES `medecin` (`id_medecin`) ON DELETE CASCADE,
  ADD CONSTRAINT `emploi_du_temps_ibfk_2` FOREIGN KEY (`id_RDV`) REFERENCES `rdv` (`id_RDV`) ON DELETE CASCADE;

--
-- Contraintes pour la table `rapport`
--
ALTER TABLE `rapport`
  ADD CONSTRAINT `rapport_ibfk_1` FOREIGN KEY (`id_ordonnance`) REFERENCES `ordonnance` (`id_ordonnance`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `rdv`
--
ALTER TABLE `rdv`
  ADD CONSTRAINT `rdv_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id_patient`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rdv_ibfk_2` FOREIGN KEY (`id_medecin`) REFERENCES `medecin` (`id_medecin`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
