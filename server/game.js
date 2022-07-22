const shortid = require("shortid");

class Game {
	constructor(creatorId) {
		this.id = shortid.generate();
		this.creatorId = creatorId;
		this.creatorReady = false;
		this.players = [];

		this.testType = "words";
		this.testLevel = 0;
		this.testcase = "";

		this.readyToStart = false;
		this.rankings = [];
	}

	changeTestcase(testcase, type, level) {
		this.testcase = testcase;
		this.testType = type || this.testType;
		this.testLevel = level;
	}

	addPlayer(playerId, nickname) {
		function generateRandomColor() {
			const letters = "0123456789ABCDEF";
			let color = "#";
			for (let i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}

		// check if player is already in game
		const index = this.getPlayerIndex(playerId);
		if (index !== -1) {
			return;
		}
		const player = {
			id: playerId,
			nickname: `${this.players.length + 1}-${nickname}`,
			color: generateRandomColor(),
			ready: false,
			wpm: 0,
			accuracy: 0,
			progress: 0,
		};

		this.players.push(player);
		this.readyToStart = false;
	}

	removePlayer(playerId) {
		const index = this.getPlayerIndex(playerId);
		if (index === -1) {
			return;
		}
		this.players.splice(index, 1);
	}

	playerReady(playerId) {
		const index = this.getPlayerIndex(playerId);
		this.players[index].ready = !this.players[index].ready;

		if (this.creatorId === playerId) {
			if (this.creatorReady) {
				// remove ready state of all players except creator
				this.players.forEach((p) => {
					if (p.id !== playerId) {
						p.ready = false;
					}
				});
			}
			this.creatorReady = !this.creatorReady;
		}

		if (this.players.every((p) => p.ready)) {
			this.readyToStart = true;
		} else {
			this.readyToStart = false;
		}
	}

	getPlayerIndex(playerId) {
		return this.players.findIndex((p) => p.id === playerId);
	}

	startGame() {
		this.restartGame();
	}

	finishTest(playerId) {
		const index = this.getPlayerIndex(playerId);
		this.rankings.push(this.players[index]);
		// change player ready to false
		this.players[index].ready = false;
	}

	updateProgress(playerId, progress) {
		const index = this.getPlayerIndex(playerId);
		const { netwpm, progressIndex } = progress;

		const percentage = Math.round(
			(progressIndex / this.testcase.length) * 100
		);

		this.updateWPM(playerId, netwpm);
		this.players[index].progress = percentage;
	}

	updateWPM(playerId, wpm) {
		const index = this.getPlayerIndex(playerId);
		this.players[index].wpm = wpm;
	}

	updateAccuracy(playerId, accuracy) {
		const index = this.getPlayerIndex(playerId);
		this.players[index].accuracy = accuracy;
	}

	restartGame() {
		this.readyToStart = false;
		this.creatorReady = false;
		this.rankings = [];
		this.players.forEach((p) => {
			p.ready = false;
			p.finished = false;
			p.wpm = 0;
			p.accuracy = 0;
			p.progress = 0;
		});
	}
}

module.exports = Game;
