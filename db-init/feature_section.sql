-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 
-- 伺服器版本： 10.4.6-MariaDB
-- PHP 版本： 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `lungsoundviz`
--

-- --------------------------------------------------------

--
-- 資料表結構 `feature_section`
--

CREATE TABLE `feature_section` (
  `section_id` int(11) UNSIGNED NOT NULL,
  `feature_id` int(11) DEFAULT NULL,
  `start` float(5,3) DEFAULT NULL,
  `end` float(5,3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `feature_section`
--
ALTER TABLE `feature_section`
  ADD PRIMARY KEY (`section_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `feature_section`
--
ALTER TABLE `feature_section`
  MODIFY `section_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
