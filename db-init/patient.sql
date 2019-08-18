
DROP TABLE IF EXISTS `patient`;
CREATE TABLE `patient`
(
  `patient_id` int
(11) NOT NULL AUTO_INCREMENT,
  `name` varchar
(10) DEFAULT NULL,
  `sex` varchar
(10) DEFAULT NULL,
  `birth` varchar
(45) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `mmrc` varchar
(10) DEFAULT NULL,
  `cat` varchar
(10) DEFAULT NULL,
  PRIMARY KEY
(`patient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of patient
-- ----------------------------
INSERT INTO patient
VALUES
  ('1', '陳OO', 'M', '1950/01/01', '咳嗽 發燒 無就診', '30', '3');
INSERT INTO patient
VALUES
  ('2', '李OO', 'F', '1960/12/31', '感冒 喘部過氣 已就診', '25', '2');
