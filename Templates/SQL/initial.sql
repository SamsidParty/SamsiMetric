SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
CREATE TABLE `config` (
  `File` varchar(64) NOT NULL,
  `Content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `config` (`File`, `Content`) VALUES
('keys.json', '[\r\n  {\r\n    \"value\": \"$2y$10$cEnZKAJasuGoD/wC6rsMqu5eYYVCffrywHhQ4.CM2Lq3aBkNHUPOG\",\r\n    \"id\": \"1680410510.insecure\",\r\n    \"name\": \"Default\",\r\n    \"icon\": \"default.png\",\r\n    \"perms\": \"admin\"\r\n  }\r\n]'),
('projects.json', '[]');


CREATE TABLE `data_average` (
  `MetricID` varchar(100) NOT NULL,
  `ProjectID` varchar(100) NOT NULL,
  `Average` double NOT NULL DEFAULT '0',
  `ReportCount` bigint UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `data_country` (
  `MetricID` varchar(100) NOT NULL,
  `ProjectID` varchar(100) NOT NULL,
  `Total` bigint NOT NULL,
  `ReportCount` bigint UNSIGNED NOT NULL,
  `CountryAF` bigint UNSIGNED NOT NULL,
  `CountryAL` bigint UNSIGNED NOT NULL,
  `CountryDZ` bigint UNSIGNED NOT NULL,
  `CountryAD` bigint UNSIGNED NOT NULL,
  `CountryAO` bigint UNSIGNED NOT NULL,
  `CountryAG` bigint UNSIGNED NOT NULL,
  `CountryAR` bigint UNSIGNED NOT NULL,
  `CountryAM` bigint UNSIGNED NOT NULL,
  `CountryAU` bigint UNSIGNED NOT NULL,
  `CountryAT` bigint UNSIGNED NOT NULL,
  `CountryAZ` bigint UNSIGNED NOT NULL,
  `CountryBS` bigint UNSIGNED NOT NULL,
  `CountryBH` bigint UNSIGNED NOT NULL,
  `CountryBD` bigint UNSIGNED NOT NULL,
  `CountryBB` bigint UNSIGNED NOT NULL,
  `CountryBY` bigint UNSIGNED NOT NULL,
  `CountryBE` bigint UNSIGNED NOT NULL,
  `CountryBZ` bigint UNSIGNED NOT NULL,
  `CountryBJ` bigint UNSIGNED NOT NULL,
  `CountryBT` bigint UNSIGNED NOT NULL,
  `CountryBO` bigint UNSIGNED NOT NULL,
  `CountryBA` bigint UNSIGNED NOT NULL,
  `CountryBW` bigint UNSIGNED NOT NULL,
  `CountryBR` bigint UNSIGNED NOT NULL,
  `CountryBN` bigint UNSIGNED NOT NULL,
  `CountryBG` bigint UNSIGNED NOT NULL,
  `CountryBF` bigint UNSIGNED NOT NULL,
  `CountryBI` bigint UNSIGNED NOT NULL,
  `CountryCV` bigint UNSIGNED NOT NULL,
  `CountryKH` bigint UNSIGNED NOT NULL,
  `CountryCM` bigint UNSIGNED NOT NULL,
  `CountryCA` bigint UNSIGNED NOT NULL,
  `CountryCF` bigint UNSIGNED NOT NULL,
  `CountryTD` bigint UNSIGNED NOT NULL,
  `CountryCL` bigint UNSIGNED NOT NULL,
  `CountryCN` bigint UNSIGNED NOT NULL,
  `CountryCO` bigint UNSIGNED NOT NULL,
  `CountryKM` bigint UNSIGNED NOT NULL,
  `CountryCG` bigint UNSIGNED NOT NULL,
  `CountryCD` bigint UNSIGNED NOT NULL,
  `CountryCR` bigint UNSIGNED NOT NULL,
  `CountryCI` bigint UNSIGNED NOT NULL,
  `CountryHR` bigint UNSIGNED NOT NULL,
  `CountryCU` bigint UNSIGNED NOT NULL,
  `CountryCY` bigint UNSIGNED NOT NULL,
  `CountryCZ` bigint UNSIGNED NOT NULL,
  `CountryDK` bigint UNSIGNED NOT NULL,
  `CountryDJ` bigint UNSIGNED NOT NULL,
  `CountryDM` bigint UNSIGNED NOT NULL,
  `CountryDO` bigint UNSIGNED NOT NULL,
  `CountryEC` bigint UNSIGNED NOT NULL,
  `CountryEG` bigint UNSIGNED NOT NULL,
  `CountrySV` bigint UNSIGNED NOT NULL,
  `CountryGQ` bigint UNSIGNED NOT NULL,
  `CountryER` bigint UNSIGNED NOT NULL,
  `CountryEE` bigint UNSIGNED NOT NULL,
  `CountrySZ` bigint UNSIGNED NOT NULL,
  `CountryET` bigint UNSIGNED NOT NULL,
  `CountryFJ` bigint UNSIGNED NOT NULL,
  `CountryFI` bigint UNSIGNED NOT NULL,
  `CountryFR` bigint UNSIGNED NOT NULL,
  `CountryGA` bigint UNSIGNED NOT NULL,
  `CountryGM` bigint UNSIGNED NOT NULL,
  `CountryGE` bigint UNSIGNED NOT NULL,
  `CountryDE` bigint UNSIGNED NOT NULL,
  `CountryGH` bigint UNSIGNED NOT NULL,
  `CountryGR` bigint UNSIGNED NOT NULL,
  `CountryGD` bigint UNSIGNED NOT NULL,
  `CountryGT` bigint UNSIGNED NOT NULL,
  `CountryGN` bigint UNSIGNED NOT NULL,
  `CountryGW` bigint UNSIGNED NOT NULL,
  `CountryGY` bigint UNSIGNED NOT NULL,
  `CountryHT` bigint UNSIGNED NOT NULL,
  `CountryHN` bigint UNSIGNED NOT NULL,
  `CountryHU` bigint UNSIGNED NOT NULL,
  `CountryIS` bigint UNSIGNED NOT NULL,
  `CountryIN` bigint UNSIGNED NOT NULL,
  `CountryID` bigint UNSIGNED NOT NULL,
  `CountryIR` bigint UNSIGNED NOT NULL,
  `CountryIQ` bigint UNSIGNED NOT NULL,
  `CountryIE` bigint UNSIGNED NOT NULL,
  `CountryIL` bigint UNSIGNED NOT NULL,
  `CountryIT` bigint UNSIGNED NOT NULL,
  `CountryJM` bigint UNSIGNED NOT NULL,
  `CountryJP` bigint UNSIGNED NOT NULL,
  `CountryJO` bigint UNSIGNED NOT NULL,
  `CountryKZ` bigint UNSIGNED NOT NULL,
  `CountryKE` bigint UNSIGNED NOT NULL,
  `CountryKI` bigint UNSIGNED NOT NULL,
  `CountryKP` bigint UNSIGNED NOT NULL,
  `CountryKR` bigint UNSIGNED NOT NULL,
  `CountryKW` bigint UNSIGNED NOT NULL,
  `CountryKG` bigint UNSIGNED NOT NULL,
  `CountryLA` bigint UNSIGNED NOT NULL,
  `CountryLV` bigint UNSIGNED NOT NULL,
  `CountryLB` bigint UNSIGNED NOT NULL,
  `CountryLS` bigint UNSIGNED NOT NULL,
  `CountryLR` bigint UNSIGNED NOT NULL,
  `CountryLY` bigint UNSIGNED NOT NULL,
  `CountryLI` bigint UNSIGNED NOT NULL,
  `CountryLT` bigint UNSIGNED NOT NULL,
  `CountryLU` bigint UNSIGNED NOT NULL,
  `CountryMG` bigint UNSIGNED NOT NULL,
  `CountryMW` bigint UNSIGNED NOT NULL,
  `CountryMY` bigint UNSIGNED NOT NULL,
  `CountryMV` bigint UNSIGNED NOT NULL,
  `CountryML` bigint UNSIGNED NOT NULL,
  `CountryMT` bigint UNSIGNED NOT NULL,
  `CountryMH` bigint UNSIGNED NOT NULL,
  `CountryMR` bigint UNSIGNED NOT NULL,
  `CountryMU` bigint UNSIGNED NOT NULL,
  `CountryMX` bigint UNSIGNED NOT NULL,
  `CountryFM` bigint UNSIGNED NOT NULL,
  `CountryMD` bigint UNSIGNED NOT NULL,
  `CountryMC` bigint UNSIGNED NOT NULL,
  `CountryMN` bigint UNSIGNED NOT NULL,
  `CountryME` bigint UNSIGNED NOT NULL,
  `CountryMA` bigint UNSIGNED NOT NULL,
  `CountryMZ` bigint UNSIGNED NOT NULL,
  `CountryMM` bigint UNSIGNED NOT NULL,
  `CountryNA` bigint UNSIGNED NOT NULL,
  `CountryNR` bigint UNSIGNED NOT NULL,
  `CountryNP` bigint UNSIGNED NOT NULL,
  `CountryNL` bigint UNSIGNED NOT NULL,
  `CountryNZ` bigint UNSIGNED NOT NULL,
  `CountryNI` bigint UNSIGNED NOT NULL,
  `CountryNE` bigint UNSIGNED NOT NULL,
  `CountryNG` bigint UNSIGNED NOT NULL,
  `CountryMK` bigint UNSIGNED NOT NULL,
  `CountryNO` bigint UNSIGNED NOT NULL,
  `CountryOM` bigint UNSIGNED NOT NULL,
  `CountryPK` bigint UNSIGNED NOT NULL,
  `CountryPW` bigint UNSIGNED NOT NULL,
  `CountryPA` bigint UNSIGNED NOT NULL,
  `CountryPG` bigint UNSIGNED NOT NULL,
  `CountryPY` bigint UNSIGNED NOT NULL,
  `CountryPE` bigint UNSIGNED NOT NULL,
  `CountryPH` bigint UNSIGNED NOT NULL,
  `CountryPL` bigint UNSIGNED NOT NULL,
  `CountryPT` bigint UNSIGNED NOT NULL,
  `CountryQA` bigint UNSIGNED NOT NULL,
  `CountryRO` bigint UNSIGNED NOT NULL,
  `CountryRU` bigint UNSIGNED NOT NULL,
  `CountryRW` bigint UNSIGNED NOT NULL,
  `CountryKN` bigint UNSIGNED NOT NULL,
  `CountryLC` bigint UNSIGNED NOT NULL,
  `CountryVC` bigint UNSIGNED NOT NULL,
  `CountryWS` bigint UNSIGNED NOT NULL,
  `CountrySM` bigint UNSIGNED NOT NULL,
  `CountryST` bigint UNSIGNED NOT NULL,
  `CountrySA` bigint UNSIGNED NOT NULL,
  `CountrySN` bigint UNSIGNED NOT NULL,
  `CountryRS` bigint UNSIGNED NOT NULL,
  `CountrySC` bigint UNSIGNED NOT NULL,
  `CountrySL` bigint UNSIGNED NOT NULL,
  `CountrySG` bigint UNSIGNED NOT NULL,
  `CountrySK` bigint UNSIGNED NOT NULL,
  `CountrySI` bigint UNSIGNED NOT NULL,
  `CountrySB` bigint UNSIGNED NOT NULL,
  `CountrySO` bigint UNSIGNED NOT NULL,
  `CountryZA` bigint UNSIGNED NOT NULL,
  `CountrySS` bigint UNSIGNED NOT NULL,
  `CountryES` bigint UNSIGNED NOT NULL,
  `CountryLK` bigint UNSIGNED NOT NULL,
  `CountrySD` bigint UNSIGNED NOT NULL,
  `CountrySR` bigint UNSIGNED NOT NULL,
  `CountrySE` bigint UNSIGNED NOT NULL,
  `CountryCH` bigint UNSIGNED NOT NULL,
  `CountrySY` bigint UNSIGNED NOT NULL,
  `CountryTJ` bigint UNSIGNED NOT NULL,
  `CountryTZ` bigint UNSIGNED NOT NULL,
  `CountryTH` bigint UNSIGNED NOT NULL,
  `CountryTL` bigint UNSIGNED NOT NULL,
  `CountryTG` bigint UNSIGNED NOT NULL,
  `CountryTO` bigint UNSIGNED NOT NULL,
  `CountryTT` bigint UNSIGNED NOT NULL,
  `CountryTN` bigint UNSIGNED NOT NULL,
  `CountryTR` bigint UNSIGNED NOT NULL,
  `CountryTM` bigint UNSIGNED NOT NULL,
  `CountryTV` bigint UNSIGNED NOT NULL,
  `CountryUG` bigint UNSIGNED NOT NULL,
  `CountryUA` bigint UNSIGNED NOT NULL,
  `CountryAE` bigint UNSIGNED NOT NULL,
  `CountryGB` bigint UNSIGNED NOT NULL,
  `CountryUS` bigint UNSIGNED NOT NULL,
  `CountryUY` bigint UNSIGNED NOT NULL,
  `CountryUZ` bigint UNSIGNED NOT NULL,
  `CountryVU` bigint UNSIGNED NOT NULL,
  `CountryVE` bigint UNSIGNED NOT NULL,
  `CountryVN` bigint UNSIGNED NOT NULL,
  `CountryYE` bigint UNSIGNED NOT NULL,
  `CountryZM` bigint UNSIGNED NOT NULL,
  `CountryZW` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `data_snapshot` (
  `MetricID` varchar(64) NOT NULL,
  `SnapTime` bigint NOT NULL,
  `SnapData` varbinary(5000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `data_total` (
  `Total` double NOT NULL DEFAULT '0',
  `MetricID` varchar(100) NOT NULL DEFAULT '',
  `ProjectID` varchar(100) NOT NULL DEFAULT '',
  `ReportCount` bigint UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `icons` (
  `IconID` varchar(100) NOT NULL,
  `IconData` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `sessions` (
  `Token` varchar(128) NOT NULL,
  `KeyID` varchar(128) NOT NULL,
  `Identity` varchar(128) NOT NULL,
  `Permanent` tinyint(1) NOT NULL DEFAULT '0',
  `LastAccess` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `snapshot_history` (
  `MetricID` varchar(64) NOT NULL,
  `LastSnap` bigint UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `config`
  ADD PRIMARY KEY (`File`);

ALTER TABLE `data_average`
  ADD PRIMARY KEY (`MetricID`);

ALTER TABLE `data_country`
  ADD PRIMARY KEY (`MetricID`);

ALTER TABLE `data_total`
  ADD PRIMARY KEY (`MetricID`);

ALTER TABLE `icons`
  ADD PRIMARY KEY (`IconID`);

ALTER TABLE `sessions`
  ADD PRIMARY KEY (`Token`);

ALTER TABLE `snapshot_history`
  ADD PRIMARY KEY (`MetricID`);
COMMIT;
