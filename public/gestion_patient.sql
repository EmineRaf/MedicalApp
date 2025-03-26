-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2025 at 05:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestion_patient`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `idadmin` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(25) NOT NULL,
  `prenom` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`idadmin`, `username`, `password`, `nom`, `prenom`) VALUES
(1, 'admin1', 'admin', 'amineadmin', 'rafadmin');

-- --------------------------------------------------------

--
-- Table structure for table `emploi_du_temps`
--

CREATE TABLE `emploi_du_temps` (
  `id_medecin` int(11) NOT NULL,
  `id_RDV` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emploi_du_temps`
--

INSERT INTO `emploi_du_temps` (`id_medecin`, `id_RDV`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 10),
(1, 11);

-- --------------------------------------------------------

--
-- Table structure for table `medecin`
--

CREATE TABLE `medecin` (
  `id_medecin` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `specialite` varchar(100) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `prix_visite` float NOT NULL,
  `localisation` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medecin`
--

INSERT INTO `medecin` (`id_medecin`, `nom`, `prenom`, `email`, `specialite`, `description`, `password`, `prix_visite`, `localisation`) VALUES
(1, 'Amel', 'Ghoul', 'Ghoul.amel@medecin.com', 'Ophtalmologue', 'Spécialiste en maladies cardiovasculaires', '0', 60, 'Bizerte');

-- --------------------------------------------------------

--
-- Table structure for table `ordonnance`
--

CREATE TABLE `ordonnance` (
  `id_ordonnance` int(11) NOT NULL,
  `listMed` varchar(50) DEFAULT NULL,
  `dateOrd` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ordonnance`
--

INSERT INTO `ordonnance` (`id_ordonnance`, `listMed`, `dateOrd`) VALUES
(1, 'Paracétamol 500mg, Vitamine C', '2025-03-10 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `patient`
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
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`id_patient`, `num_tel`, `nom`, `prenom`, `email`, `date_naissance`, `genre`, `taille`, `poids`, `password`) VALUES
(1, 12345678, 'Dupont', 'Jean', 'jean.dupont@email.com', '1985-06-15', 'homme', 1.75, 70.5, ''),
(3, 56897841, 'ali', 'ben youssef', 'exemple@yahoo.fr', '2004-03-04', 'homme', 165, 89, ''),
(4, 92059010, 'amine', 'rafrafi', 'eminerae02@gmail.com', '0000-00-00', '', 178, 89, '$2b$10$Jt3u5J1GRJ6jMjDfa0kLueIE2x8zPzqPQkMVRm0jzE.gFMtpiR0Ye'),
(7, 25469874, 'monjia', 'rafrafi', 'monjia@gmail.com', '2007-10-16', 'femme', 164, 75, '$2b$10$1LhtvWjlwPQ9cLOftbdebuziNCCqME8rKz7LB5XNJfgd0AU8vjnYy'),
(10, 56894841, 'halima', 'rafrafi', 'halima@gmail.com', '2007-10-16', 'femme', 164, 75.56, '$2b$10$JY18X1o.FeMPjxqcJiru../8T8f2hEVrJG2xrUmYtJKoZROsAkPn.'),
(19, 14527895, 'ahmed', 'affouri', 'pcfamille2020@gmail.com', '2011-02-02', 'homme', 150, 40, '$2b$10$5KUHaaEvB2O3NddUbTORV.pnMjAYOXvQAzWr7x1V9kYDYrswwsdC.'),
(23, 92057010, 'Amine', 'Rafrafi', 'rafrafiamine2004@gmail.com', '2004-08-17', 'homme', 180, 90, '$2b$10$vpauUgsll8Op.IznIuY/HezUeKZBQN4A4Dj54BdYskybWJfoVZ73K'),
(24, 11445566, 'rawen', 'bensaleh', 'rawen@test.com', '2012-03-27', 'femme', 130, 45, '$2b$10$hhnMV152Ki4t5CmvpQT85exvj/J9zD3HXkwOpF38BWxmpWhlhazfm');

-- --------------------------------------------------------

--
-- Table structure for table `rapport`
--

CREATE TABLE `rapport` (
  `id_rapport` int(11) NOT NULL,
  `date_rapport` date NOT NULL,
  `description` text DEFAULT NULL,
  `id_RDV` int(11) NOT NULL,
  `id_ordonnance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rapport`
--

INSERT INTO `rapport` (`id_rapport`, `date_rapport`, `description`, `id_RDV`, `id_ordonnance`) VALUES
(1, '2025-03-10', 'Examen général, tout est normal.', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `rdv`
--

CREATE TABLE `rdv` (
  `id_RDV` int(11) NOT NULL,
  `date_RDV` datetime NOT NULL,
  `id_patient` int(11) NOT NULL,
  `id_medecin` int(11) NOT NULL,
  `description` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rdv`
--

INSERT INTO `rdv` (`id_RDV`, `date_RDV`, `id_patient`, `id_medecin`, `description`) VALUES
(1, '2025-03-10 10:00:00', 1, 1, 'Consultation de routine'),
(2, '2025-03-11 10:00:00', 3, 1, 'etas du grippe tres severe'),
(3, '2025-03-20 09:00:00', 1, 1, 'corana'),
(10, '2025-03-21 00:17:47', 19, 1, NULL),
(11, '2025-03-21 00:23:36', 19, 1, NULL),
(4, '2025-03-21 09:00:00', 4, 1, 'corana');

--
-- Triggers `rdv`
--
DELIMITER $$
CREATE TRIGGER `after_rdv_insert` AFTER INSERT ON `rdv` FOR EACH ROW BEGIN
    INSERT INTO emploi_du_temps (id_medecin, id_RDV) 
    VALUES (NEW.id_medecin, NEW.id_RDV);
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`idadmin`);

--
-- Indexes for table `emploi_du_temps`
--
ALTER TABLE `emploi_du_temps`
  ADD PRIMARY KEY (`id_medecin`,`id_RDV`),
  ADD KEY `id_RDV` (`id_RDV`);

--
-- Indexes for table `medecin`
--
ALTER TABLE `medecin`
  ADD PRIMARY KEY (`id_medecin`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ordonnance`
--
ALTER TABLE `ordonnance`
  ADD PRIMARY KEY (`id_ordonnance`) USING BTREE;

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`id_patient`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `num_tel` (`num_tel`);

--
-- Indexes for table `rapport`
--
ALTER TABLE `rapport`
  ADD PRIMARY KEY (`id_rapport`,`id_RDV`),
  ADD UNIQUE KEY `id_RDV` (`id_RDV`),
  ADD KEY `id_ordonnance` (`id_ordonnance`);

--
-- Indexes for table `rdv`
--
ALTER TABLE `rdv`
  ADD PRIMARY KEY (`date_RDV`,`id_patient`,`id_medecin`),
  ADD UNIQUE KEY `id_RDV` (`id_RDV`),
  ADD KEY `id_patient` (`id_patient`),
  ADD KEY `id_medecin` (`id_medecin`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `idadmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medecin`
--
ALTER TABLE `medecin`
  MODIFY `id_medecin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ordonnance`
--
ALTER TABLE `ordonnance`
  MODIFY `id_ordonnance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `id_patient` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `rapport`
--
ALTER TABLE `rapport`
  MODIFY `id_rapport` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rdv`
--
ALTER TABLE `rdv`
  MODIFY `id_RDV` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `emploi_du_temps`
--
ALTER TABLE `emploi_du_temps`
  ADD CONSTRAINT `emploi_du_temps_ibfk_1` FOREIGN KEY (`id_medecin`) REFERENCES `medecin` (`id_medecin`) ON DELETE CASCADE,
  ADD CONSTRAINT `emploi_du_temps_ibfk_2` FOREIGN KEY (`id_RDV`) REFERENCES `rdv` (`id_RDV`) ON DELETE CASCADE;

--
-- Constraints for table `ordonnance`
--
ALTER TABLE `ordonnance`
  ADD CONSTRAINT `ordonnance_ibfk_1` FOREIGN KEY (`id_rapport`) REFERENCES `rapport` (`id_rapport`) ON DELETE CASCADE;

--
-- Constraints for table `rapport`
--
ALTER TABLE `rapport`
  ADD CONSTRAINT `rapport_ibfk_1` FOREIGN KEY (`id_RDV`) REFERENCES `rdv` (`id_RDV`) ON DELETE CASCADE,
  ADD CONSTRAINT `rapport_ibfk_2` FOREIGN KEY (`id_ordonnance`) REFERENCES `ordonnance` (`id_ordonnance`) ON DELETE CASCADE;

--
-- Constraints for table `rdv`
--
ALTER TABLE `rdv`
  ADD CONSTRAINT `rdv_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id_patient`) ON DELETE CASCADE,
  ADD CONSTRAINT `rdv_ibfk_2` FOREIGN KEY (`id_medecin`) REFERENCES `medecin` (`id_medecin`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
