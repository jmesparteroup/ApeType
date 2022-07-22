const shortid = require("shortid");
const conn = require("../config/db");
const User = require("../models/user");
const words = require("../db/words.json");
const quotes = require("../db/quotes.json");

async function populateScores(num) {
	try {
		// populate users db with random testers
		const userQuery = "CALL CreateUser(?, ?, ?, ?, ?, ?)";

		// create admin tester
		await conn.query(userQuery, [
			shortid.generate(),
			"admin@gmail.com",
			await User.hashPassword("admin"),
			"Josh",
			"Admin",
			"admin"
		]);

		for (let i = 0; i < num; i++) {
			const userID = `user${i}`;
			const email = `user${i}@gmail.com`;
			const firstName = `User${i}`;
			const lastName = `Last${i}`;
			const userRole = "user";
			const hashPassword = await User.hashPassword("password");
			const entry = [
				userID,
				email,
				hashPassword,
				firstName,
				lastName,
				userRole,
			];
			await conn.query(userQuery, entry);
		}

		// populate scores db with random scores
		const scoreQuery = "CALL CreateScore(?, ?, ?, ?, ?, ?, ?, ?, ?)";
		const leaderboardQuery =
			"CALL createLeaderboardEntry (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		const populateTimeScores = async (level) => {
			for (let i = 0; i < num; i++) {
				const userID = `user${i}`;
				for (let j = 0; j < 5; j++) {
					const wpm = 20 + i + j + Math.floor(Math.random() * 15);
					const accuracy = 90 + Math.floor(Math.random() * 10);
					const entry = [
						shortid.generate(),
						userID,
						`User${i}`,
						`Last${i}`,
						"time",
						level,
						wpm,
						accuracy,
						new Date(),
					];
					await conn.query(scoreQuery, entry);
					if (j === 4) await conn.query(leaderboardQuery, entry);
				}
			}
		};

		await populateTimeScores(15);
		await populateTimeScores(30);
		await populateTimeScores(60);
		await populateTimeScores(120);

		console.log("Populated db with random scores");
	} catch (err) {
		console.log(err);
	}
}

async function populateWordsAndQuotesDB() {
	// populate words db with words from json file
	const insertWord = "CALL CreateWord(?)";
    
    for (let i = 0; i < words.length; i++) {
        const entry = [words[i]];
        await conn.query(insertWord, entry);
    }
    console.log("Populated db with words");

    // populate quotes db with quotes from json file
    const insertQuote = "CALL CreateQuote(?,?,?)";
    for (let i = 0; i < quotes.length; i++) {
        const entry = [quotes[i].source, quotes[i].text, quotes[i].length];
        await conn.query(insertQuote, entry);
    }
    console.log("Populated db with quotes");
}

module.exports = { populateScores, populateWordsAndQuotesDB };
