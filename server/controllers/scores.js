class ScoresController {
	constructor(repository, redisRepository, io) {
		this.repository = repository;
		this.redisRepository = redisRepository;
		this.io = io;
	}

	async recordScore(req, res) {
		try {
			const { userID, type, level, wpm, accuracy } = req.body;
			const user = req.user;

			if (!userID || !type || !level || !wpm || !accuracy || !user)
				return res.status(400).json({});

			const { lastName, firstName } = user;

			const entry = await this.repository.createScore({
				userID,
				firstName,
				lastName,
				type,
				level,
				wpm,
				accuracy,
			});

			const userScores = await this.repository.getTopFiveUserScoresByType(
				userID,
				type,
				level
			);

			if (userScores.length === 5 && type === "time") {
				// insert best of 5 into database
				console.log("Inserting best of 5 into database");

				const bestScore = userScores[0];

				// check if this score is already in leaderboards DB
				// Review: logic can be improved. Has code smell with regards to blind delete.
				//         Don't put function calls in conditional statements.
				if (
					!(await this.repository.getLeaderboardEntryById(
						bestScore.id
					))
				) {
					console.log("Data not found in leaderboards DB");
					await this.repository.deleteLeaderboardEntry(
						bestScore.userID,
						bestScore.type,
						bestScore.level
					);
					await this.repository.createLeaderboardEntry({
						...bestScore,
						firstName,
						lastName,
						userID,
					});
				}

				const cachedLeaderboard =
					await this.redisRepository.getTimeLeaderboards(level);

				if (cachedLeaderboard.length < 10) {
					this.redisRepository.invalidateTimeLeaderboards(level);
					this.io.emit("leaderboards", {
						message: `Congratulations Ape Smasher - ${firstName} ${lastName} for getting through the Top 10 of the Time Leaderboards - ${level}s.`,
					});
				}

				if (cachedLeaderboard.length >= 10) {
					if (
						bestScore.wpm > cachedLeaderboard[9].wpm ||
						(bestScore.wpm === cachedLeaderboard[9].wpm &&
							accuracy > cachedLeaderboard[9].accuracy)
					) {
						this.io.emit("gameLeaderboard", {
							message: `Congratulations Ape Smasher - ${firstName} ${lastName} for getting through the Top 10 of the Time Leaderboards - ${level}s.`,
						});

						this.redisRepository.invalidateTimeLeaderboards(level);
					}
				}
			}

			return res.status(200).json({ id: entry.id });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: `${err.message}` });
		}
	}
	async readUserScores(req, res) {
		try {
			const userID = req.params.id;

			if (!userID) return res.status(404).json({});

			const userScores = await this.repository.readUserScores(userID);

			res.status(200).json(userScores);
		} catch (err) {
			res.status(400).json({ message: `${err.message}` });
			console.error(err);
		}
	}

	async readAllScores(req, res) {
		try {
			const limit = req.query.limit || 50;
			const allScores = await this.repository.readAllScores(limit);
			res.status(200).json(allScores);
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: `${err.message}` });
		}
	}

	async getTimeLeaderboards(req, res) {
		try {
			const { level } = req.params;
			if (!level) return res.status(400).json({});

			let leaderboards;
			leaderboards = await this.redisRepository.getTimeLeaderboards(
				level
			);

			if (leaderboards.length > 0) {
				console.log("leaderboards from redis");
				return res.status(200).json(leaderboards);
			}
			leaderboards = await this.repository.getLeaderboards(
				+level,
				"time"
			);
			console.log("leaderboards from db");
			res.status(200).json(leaderboards);

			await this.redisRepository.setTimeLeaderboards(level, leaderboards);
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: `${err.message}` });
		}
	}
}

module.exports = ScoresController;
