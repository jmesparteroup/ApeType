const conn = require("../config/db");
const shortid = require("shortid");
const allowed = require("../utils/allowed");

class ScoresRepository {
	constructor() {}

	async createScore(data) {
		try {
			if (!allowed.type.includes(data.type))
				throw new Error("Invalid type");

			const query = "CALL CreateScore(?,?,?,?,?,?,?,?,?)";
			const id = shortid.generate();
			const dateAdded = new Date();

			const entry = [
				id,
				data.userID,
				data.firstName,
				data.lastName,
				data.type,
				data.level,
				data.wpm,
				data.accuracy,
				dateAdded,
			];
			await conn.query(query, entry);
			return {
				id: id,
				userID: data.userID,
				type: data.type,
				level: data.level,
				wpm: data.wpm,
				accuracy: data.accuracy,
				dateAdded: dateAdded,
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async readUserScores(userID) {
		try {
			const query = "CALL ReadUserScores(?)";
			const [[scoresEntry, __], _] = await conn.query(query, userID);
			return scoresEntry;
		} catch (err) {
			throw new Error(err);
		}
	}

	async readAllScores(limit = 50) {
		try {
			const query = "CALL ReadScores()";
			const [[rows, __], _] = await conn.query(query);

			console.log(rows);

			function filterSort(type) {
				const filteredData = rows
					.filter((entry) => entry.type === type)
					.sort(
						(a, b) =>
							a.params - b.params ||
							a.wpm - b.wpm ||
							a.accuracy - b.accuracy
					);

				return filteredData.slice(
					0,
					Math.max(limit, filteredData.length)
				);
			}

			const timeScores = filterSort("time");
			const quoteScores = filterSort("quote");
			const wordScores = filterSort("words");

			return { timeScores, quoteScores, wordScores };
		} catch (error) {
			throw new Error(error);
		}
	}

	async getLeaderboards(level, type) {
		try {
			const query = "CALL GetLeaderboard(?,?)";
			const [[rows, __], _] = await conn.query(query, [level, type]);
			console.log("RETRIEVED:", rows);
			return rows;
		} catch (error) {
			throw new Error(error);
		}
	}

	async getLeaderboardEntryById(id) {
		try {
			const query = "CALL GetLeaderboardEntryById(?)";
			const [[rows, __], _] = await conn.query(query, id);
			console.log("Leaderboard Entry By ID:", rows);
			if (rows.length === 0) return false;
			return rows[0];
		} catch (error) {
			throw new Error(error);
		}
	}

	async deleteLeaderboardEntry(id, type, level) {
		try {
			const query = "CALL DeleteLeaderboardEntry(?, ? ,?)";
			await conn.query(query, [id, type, level]);
		} catch (error) {
			throw new Error(error);
		}
	}

	async getTopFiveUserScoresByType(userID, type, level) {
		try {
			console.log('getTopFiveUserScoresByType', userID, type, level)
			const query = "CALL GetTopFiveUserScoresByType(?,?,?)";
			const [[rows, __], _] = await conn.query(query, [userID, type, level]);
			console.log("RETRIEVED:", rows);
			return rows;
		} catch (error) {
			throw new Error(error);
		}
	}

	async createLeaderboardEntry(data) {
		try {
			console.log('insertLeaderboard: ', data)
			const query = "CALL createLeaderboardEntry(?,?,?,?,?,?,?,?,?)";
			await conn.query(query, [
				data.id,
				data.userID,
				data.firstName,
				data.lastName,
				data.type,
				data.level,
				data.wpm,
				data.accuracy,
				data.dateAdded,
			]);
			return;
		} catch (err) {
			throw new Error(err);
		}
	}

}

module.exports = ScoresRepository;
