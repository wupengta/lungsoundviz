CREATE TABLE `file`
(
  `file_id` int
(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int
(11) DEFAULT NULL,
  `filename` varchar
(45) DEFAULT NULL,
  `part` varchar
(10) DEFAULT NULL,
  `time` varchar
(10) DEFAULT NULL,
  `upload_date` date DEFAULT NULL,
  PRIMARY KEY
(`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
