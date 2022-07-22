/* Replace with your SQL commands */
/* Replace
 WITH your SQL commands */
use apetype;

CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(16) NOT NULL PRIMARY KEY,
    `email` VARCHAR(50) DEFAULT NULL,
    `userPassword` VARCHAR(255) DEFAULT NULL,
    `lastName` VARCHAR(50) DEFAULT NULL,
    `firstName` VARCHAR(50) DEFAULT NULL,
    `userRole` VARCHAR(50) DEFAULT NULL
);

CREATE INDEX emailIndex ON `users` (email);

CREATE TABLE IF NOT EXISTS `scores` (
    `id` VARCHAR(16) NOT NULL PRIMARY KEY,
    `userID` VARCHAR(16) DEFAULT NULL,
    `type` VARCHAR(16) DEFAULT NULL,
    `level` SMALLINT DEFAULT NULL,
    `wpm` SMALLINT DEFAULT NULL,
    `accuracy` SMALLINT DEFAULT NULL,
    `dateAdded` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX userIDIndex ON `scores` (`userID`);
CREATE INDEX typeIndex ON `scores` (`type`);
CREATE INDEX levelIndex ON `scores` (`level`);
CREATE INDEX scoreIndex  ON `scores` (`wpm`, `accuracy`);

CREATE TABLE IF NOT EXISTS `leaderboard` (
    `id` VARCHAR(16) NOT NULL PRIMARY KEY,
    `userID` VARCHAR(16) DEFAULT NULL,
    `firstName` VARCHAR(50) DEFAULT NULL,
    `lastName` VARCHAR(50) DEFAULT NULL,
    `type` VARCHAR(16) DEFAULT NULL,
    `level` SMALLINT DEFAULT NULL,
    `wpm` SMALLINT DEFAULT NULL,
    `accuracy` SMALLINT DEFAULT NULL,
    `dateAdded` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX typeIndex ON `leaderboard` (`type`);
CREATE INDEX userIDIndex ON `leaderboard` (`userID`);
CREATE INDEX levelIndex ON `leaderboard` (`level`);
CREATE INDEX scoreIndex  ON `leaderboard` (`wpm`, `accuracy`);


CREATE TABLE IF NOT EXISTS `words` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `word` VARCHAR(255) DEFAULT NULL
);

CREATE INDEX wordIndex ON `words` (`word`);

CREATE TABLE IF NOT EXISTS `quotes` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `source` VARCHAR(255) DEFAULT NULL,
    `quote` VARCHAR(5000) DEFAULT NULL,
    `length` INT DEFAULT NULL
);

CREATE INDEX lengthIndex ON `quotes` (`length`);

DROP PROCEDURE IF EXISTS `SelectAllUsers`;

CREATE PROCEDURE `SelectAllUsers`() BEGIN
SELECT
    id,
    email,
    firstName,
    lastName,
    userRole
FROM
    users;

END;

DROP PROCEDURE IF EXISTS `SelectUser`;

CREATE PROCEDURE `SelectUser`(IN idArg VARCHAR(16)) BEGIN
SELECT
    id,
    email,
    lastName,
    firstName,
    userRole
FROM
    users
WHERE
    id = idArg;

END;

DROP PROCEDURE IF EXISTS `UpdateUser`;

CREATE PROCEDURE `UpdateUser`(
    IN idArg VARCHAR(16),
    IN emailArg VARCHAR(50),
    IN passwordArg VARCHAR(255),
    IN lastNameArg VARCHAR(50),
    IN firstNameArg VARCHAR(50),
    IN roleArg VARCHAR(50)
) BEGIN
UPDATE
    users
SET
    email = COALESCE(emailArg, email),
    userPassword = COALESCE(passwordArg, userPassword),
    lastName = COALESCE(lastNameArg, lastName),
    firstName = COALESCE(firstNameArg, firstName),
    userRole = COALESCE(roleArg, userRole)
WHERE
    id = idArg;

SELECT
    id,
    email,
    lastName,
    firstName,
    userRole
FROM
    users
WHERE
    id = idArg;

END;

DROP PROCEDURE IF EXISTS `DeleteUser`;

CREATE PROCEDURE `DeleteUser`(IN idArg VARCHAR(16)) BEGIN
DELETE FROM
    users
WHERE
    id = idArg;

END;

DROP PROCEDURE IF EXISTS `CreateUser`;

CREATE PROCEDURE `CreateUser`(
    IN idArg VARCHAR(16),
    IN emailArg VARCHAR(50),
    IN passwordArg VARCHAR(255),
    IN lastNameArg VARCHAR(50),
    IN firstNameArg VARCHAR(50),
    IN roleArg VARCHAR(50)
) BEGIN
INSERT INTO
    users (
        `id`,
        `email`,
        `userPassword`,
        `firstname`,
        `lastname`,
        `userRole`
    )
VALUES
    (
        idArg,
        emailArg,
        passwordArg,
        firstNameArg,
        lastNameArg,
        roleArg
    );

END;

DROP PROCEDURE IF EXISTS `LoginUser`;

CREATE PROCEDURE `LoginUser`(IN emailArg VARCHAR(50)) BEGIN
SELECT
    id,
    userRole,
    userPassword
FROM
    users
WHERE
    email = emailArg;

END;

DROP PROCEDURE IF EXISTS `CreateScore`;

CREATE PROCEDURE `CreateScore`(
    IN idArg VARCHAR(16),
    IN userIDArg VARCHAR(16),
    IN firstNameArg VARCHAR(50),
    IN lastNameArg VARCHAR(50),
    IN typeArg VARCHAR(16),
    IN levelArg SMALLINT,
    IN wpmArg SMALLINT,
    IN accuracyArg SMALLINT,
    IN dateAddedArg DATETIME
) BEGIN
INSERT INTO
    scores (
        `id`,
        `userID`,
        `type`,
        `level`,
        `wpm`,
        `accuracy`,
        `dateAdded`
    )
VALUES
    (
        idArg,
        userIDArg,
        typeArg,
        levelArg,
        wpmArg,
        accuracyArg,
        dateAddedArg
    );

END;

DROP PROCEDURE IF EXISTS `GetTopFiveUserScoresByType`;

CREATE PROCEDURE `GetTopFiveUserScoresByType`(
    IN userIDArg VARCHAR(16),
    IN typeArg VARCHAR(16),
    IN levelArg SMALLINT
) BEGIN
SELECT
    id,
    userID,
    type,
    level,
    wpm,
    accuracy,
    dateAdded
FROM
    scores
WHERE
    type = typeArg
    AND level = levelArg
    AND userID = userIDArg
ORDER BY
    wpm DESC,
    accuracy DESC
LIMIT
    5;

END;

DROP PROCEDURE IF EXISTS `GetLeaderboardEntryById`;

CREATE PROCEDURE `GetLeaderboardEntryById`(IN idArg VARCHAR(16)) BEGIN
SELECT
    id,
    userID,
    firstName,
    lastName,
    type,
    level,
    wpm,
    accuracy,
    dateAdded
FROM
    leaderboard
WHERE
    id = idArg;

END;

DROP PROCEDURE IF EXISTS `DeleteLeaderboardEntry`;

CREATE PROCEDURE `DeleteLeaderboardEntry`(
    IN userIDArg VARCHAR(16),
    IN typeArg VARCHAR(16),
    IN levelArg SMALLINT
) BEGIN
DELETE FROM
    leaderboard
WHERE
    userID = userIDArg
    AND type = typeArg
    AND level = levelArg;

END;

DROP PROCEDURE IF EXISTS `createLeaderboardEntry`;

CREATE PROCEDURE `createLeaderboardEntry`(
    IN idArg VARCHAR(16),
    IN userIDArg VARCHAR(16),
    IN firstNameArg VARCHAR(50),
    IN lastNameArg VARCHAR(50),
    IN typeArg VARCHAR(16),
    IN levelArg SMALLINT,
    IN wpmArg SMALLINT,
    IN accuracyArg SMALLINT,
    IN dateAddedArg DATETIME
) BEGIN
INSERT INTO
    leaderboard (
        `id`,
        `userID`,
        `firstName`,
        `lastName`,
        `type`,
        `level`,
        `wpm`,
        `accuracy`,
        `dateAdded`
    )
VALUES
    (
        idArg,
        userIDArg,
        firstNameArg,
        lastNameArg,
        typeArg,
        levelArg,
        wpmArg,
        accuracyArg,
        dateAddedArg
    );

END;

DROP PROCEDURE IF EXISTS `GetLeaderboard`;

CREATE PROCEDURE `GetLeaderboard`(IN levelArg SMALLINT, IN typeArg VARCHAR(16)) BEGIN -- GET TOP 50 SCORES BY TYPE AND level
SELECT
    *
FROM
    leaderboard
WHERE
    type = typeArg
    AND level = levelArg
ORDER BY
    wpm DESC,
    accuracy DESC
LIMIT
    50;

END;

DROP PROCEDURE IF EXISTS `ReadUserScores`;

CREATE PROCEDURE `ReadUserScores`(IN idArg VARCHAR(16)) BEGIN
SELECT
    *
FROM
    scores
WHERE
    userID = idArg;

END;

DROP PROCEDURE IF EXISTS `ReadScores`;

CREATE PROCEDURE `ReadScores`() BEGIN
SELECT
    *
FROM
    scores;

END;

DROP PROCEDURE IF EXISTS `ReadScoresByType`;

CREATE PROCEDURE `ReadScoresByType`(IN typeArg VARCHAR(16)) BEGIN
SELECT
    *
FROM
    scores
WHERE
    `type` = typeArg;

END;

-- SP FOR WORDS --
DROP PROCEDURE IF EXISTS `CreateWord`;

CREATE PROCEDURE `CreateWord`(IN word VARCHAR(16)) BEGIN
INSERT INTO
    words (`word`)
VALUES
    (word);

END;

DROP PROCEDURE IF EXISTS `PatchWord`;

CREATE PROCEDURE `PatchWord`(IN wordArg VARCHAR(16), IN newWordArg VARCHAR(16)) BEGIN
UPDATE
    words
SET
    word = COALESCE(newWordArg, word)
WHERE
    word = wordArg;

END;

DROP PROCEDURE IF EXISTS `DeleteWord`;

CREATE PROCEDURE `DeleteWord`(IN wordArg VARCHAR(16)) BEGIN
DELETE FROM
    words
WHERE
    word = wordArg;

END;

DROP PROCEDURE IF EXISTS `ReadWords`;

CREATE PROCEDURE `ReadWords`() BEGIN
SELECT
    *
FROM
    words;

END;

-- SP FOR QUOTES --
DROP PROCEDURE IF EXISTS `CreateQuote`;

CREATE PROCEDURE `CreateQuote`(
    IN sourceArg VARCHAR(255),
    IN quoteArg VARCHAR(5000),
    IN lengthArg INT
) BEGIN
INSERT INTO
    quotes (
        `source`,
        `quote`,
        `length`
    )
VALUES
    (
        sourceArg,
        quoteArg,
        lengthArg
    );

END;

DROP PROCEDURE IF EXISTS `PatchQuote`;

CREATE PROCEDURE `PatchQuote`(
    IN idArg INT,
    IN sourceArg VARCHAR(255),
    IN quoteArg VARCHAR(5000),
    IN lengthArg INT
) BEGIN
UPDATE
    quotes
SET
    source = COALESCE(sourceArg, source),
    quote = COALESCE(quoteArg, quote),
    length = COALESCE(lengthArg, length)
WHERE
    id = idArg;

END;

DROP PROCEDURE IF EXISTS `DeleteQuote`;

CREATE PROCEDURE `DeleteQuote`(IN idArg INT) BEGIN
DELETE FROM
    quotes
WHERE
    id = idArg;

END;

DROP PROCEDURE IF EXISTS `ReadQuotes`;

CREATE PROCEDURE `ReadQuotes`(IN lower SMALLINT, IN upper SMALLINT) BEGIN
SELECT
    *
FROM
    quotes
WHERE
    length BETWEEN lower
    AND upper;

END;