-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: db
-- Tid vid skapande: 13 jun 2024 kl 21:02
-- Serverversion: 10.6.17-MariaDB-1:10.6.17+maria~ubu2004
-- PHP-version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `debugdivas`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `articles`
--

CREATE TABLE `articles` (
  `article_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `subscription_level` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `articles`
--

INSERT INTO `articles` (`article_id`, `title`, `content`, `subscription_level`, `created_at`) VALUES
(1, '10 Roliga Fakta om Havets Invånare', 'Visste du att sjöhästar är en av få arter där hanen bär och föder ungar? Eller att bläckfiskar har tre hjärtan? Utforska fler fascinerande och oväntade fakta om havets djur!', 2, '2024-06-11 11:17:08'),
(2, 'Jakten på Förlorade Sjöfararens Skatt', 'Jakten på Förlorade Sjöfararens Skatt\r\n \r\nFölj med på en episk skattjakt där vi dyker djupt in i legender och berättelser om förlorade sjöfarares skatter. Vad är sanning och vad är myt?', 3, '2024-06-11 11:17:35'),
(3, 'De Mest Sällsynta Artefakterna från Havets Djup', 'En exklusiv titt på de mest sällsynta och värdefulla artefakterna som hittats på havets botten. Från antika mynt till förlorade stadsvrak, här finns något för varje historiefantast.', 4, '2024-06-11 11:18:01');

-- --------------------------------------------------------

--
-- Tabellstruktur `payments`
--

CREATE TABLE `payments` (
  `stripe_session_id` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `subscriptions`
--

CREATE TABLE `subscriptions` (
  `_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `subscription_level` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `status` enum('active','past_due','expired','') DEFAULT NULL,
  `next_payment` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `stripe_subscription_id` varchar(255) DEFAULT NULL,
  `stripe_customer_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `subscription_level`
--

CREATE TABLE `subscription_level` (
  `_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `subscription_level`
--

INSERT INTO `subscription_level` (`_id`, `name`, `price_id`) VALUES
(1, 'No Access', 0),
(2, 'Blunders Bubblor', 25),
(3, 'Ariels Antikviteter', 50),
(4, 'Tritons Treudd', 100);

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `subscription_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`article_id`),
  ADD KEY `fk_subscription_level` (`subscription_level`);

--
-- Index för tabell `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`stripe_session_id`),
  ADD KEY `fk_payments_user_id` (`user_id`);

--
-- Index för tabell `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `fk_subscriptions_user_id` (`user_id`),
  ADD KEY `subscription_level` (`subscription_level`);

--
-- Index för tabell `subscription_level`
--
ALTER TABLE `subscription_level`
  ADD PRIMARY KEY (`_id`);

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `fk_users_subscription_id` (`subscription_id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `articles`
--
ALTER TABLE `articles`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT för tabell `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT för tabell `subscription_level`
--
ALTER TABLE `subscription_level`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `fk_subscription_level` FOREIGN KEY (`subscription_level`) REFERENCES `subscription_level` (`_id`);

--
-- Restriktioner för tabell `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`_id`);

--
-- Restriktioner för tabell `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `fk_subscriptions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`_id`),
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`subscription_level`) REFERENCES `subscription_level` (`_id`);

--
-- Restriktioner för tabell `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_subscription_id` FOREIGN KEY (`subscription_id`) REFERENCES `subscription_level` (`_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
