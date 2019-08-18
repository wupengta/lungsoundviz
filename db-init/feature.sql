
CREATE TABLE `feature`
(
  `feature_id` int
(11) NOT NULL AUTO_INCREMENT,
  `file_id` int
(11) DEFAULT NULL,
  `feature` varchar
(20) DEFAULT NULL,
  `percentage` int
(11) DEFAULT NULL,
  PRIMARY KEY
(`feature_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
