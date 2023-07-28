-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2021 at 05:54 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `charity`
--

-- --------------------------------------------------------

--
-- Table structure for table `charities`
--

CREATE TABLE `charities` (
  `id` int(3) NOT NULL,
  `name` varchar(50) NOT NULL,
  `purpose` varchar(50) NOT NULL,
  `founder` varchar(30) NOT NULL,
  `cover` varchar(50) NOT NULL DEFAULT 'chars/default.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `charities`
--

INSERT INTO `charities` (`id`, `name`, `purpose`, `founder`, `cover`) VALUES
(47, 'Covid help', 'Help patients suffering from covid', 'admin', 'uploads/image-1637643416672.png');

-- --------------------------------------------------------

--
-- Table structure for table `doner`
--

CREATE TABLE `doner` (
  `d_id` int(10) NOT NULL,
  `d_name` varchar(20) NOT NULL,
  `d_amount` int(15) NOT NULL,
  `d_purpose` varchar(40) NOT NULL,
  `d_date` datetime NOT NULL,
  `d_addr` varchar(40) NOT NULL,
  `d_cell` varchar(15) NOT NULL,
  `d_pay` varchar(25) NOT NULL,
  `d_paytype` varchar(25) NOT NULL,
  `founder` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `raise`
--

CREATE TABLE `raise` (
  `founder` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `purpose` varchar(50) NOT NULL,
  `cover` varchar(50) NOT NULL DEFAULT 'chars/default.jpg',
  `id` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `username`
--

CREATE TABLE `username` (
  `u_name` varchar(20) NOT NULL,
  `u_pass` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `username`
--

INSERT INTO `username` (`u_name`, `u_pass`) VALUES
('admin', '123456'),
('root', 'root');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `u_name` varchar(50) NOT NULL,
  `u_pass` varchar(50) NOT NULL,
  `phno` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`u_name`, `u_pass`, `phno`, `email`, `address`) VALUES
('agagga', 'anay27001', '7878787878', 'anaybhatkar547@gmail.com', 'mumbai'),
('anay', 'bhatkar', '7021571472', 'anaybhatkar35@gmail.com', 'mumbai');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `charities`
--
ALTER TABLE `charities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `doner`
--
ALTER TABLE `doner`
  ADD PRIMARY KEY (`d_id`),
  ADD UNIQUE KEY `d_id` (`d_id`);

--
-- Indexes for table `raise`
--
ALTER TABLE `raise`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `username`
--
ALTER TABLE `username`
  ADD UNIQUE KEY `user` (`u_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`u_name`),
  ADD UNIQUE KEY `phno` (`phno`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `charities`
--
ALTER TABLE `charities`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `doner`
--
ALTER TABLE `doner`
  MODIFY `d_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100099;

--
-- AUTO_INCREMENT for table `raise`
--
ALTER TABLE `raise`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
