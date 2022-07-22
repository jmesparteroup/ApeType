const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");
const Game = require("./game");

const Factory = require("./models/factory");
const RedisRepository = require("./repositories/redis-repository");
const TestRepository = require("./repositories/test-repository");
const UserRepository = require("./repositories/users-repository");

const server = http.createServer(app);
const io = socket(server, {
	cors: {
		origin: "http://localhost:4200",
	},
});

const factory = new Factory(new TestRepository(), new RedisRepository());

// NOTE: change this into a redis store later on
let games = [];

const findGame = async function (gameId) {
	return games.find((game) => {
		return game.id === gameId;
	});
};

io.on("connection", (socket) => {
	// console.log("connected - sending games");
	// socket.emit("gamesSent", { games: games });
	let previousRoomId;
	let test = factory.createTest("words", { numWords: 0 });

	socket.on("getGame", async (payload) => {
		const game = await findGame(payload.gameId);

		socket.emit("gameLoaded", { game: game });
	});

	socket.on("createGame", (payload) => {
		console.log("EVENT: Creating Game!", payload);
		const newGame = new Game(payload.creatorId);
		games.push(newGame);
		io.to(socket.id).emit("gameCreated", { gameId: newGame.id });
	});

	socket.on("joinGame", async (payload) => {
		const gameId = payload.gameId;

		const game = await findGame(gameId);

		if (!game) {
			console.log("Game not found");
			return;
		}

		if (game.players.length > 5) {
			io.to(socket.id).emit("gameFull", { gameId: gameId });
		} else {
			const user = await UserRepository.getUser(payload.playerId);

			game.addPlayer(payload.playerId, user.firstName);

			// join a room/channel for specific game
			if (previousRoomId) {
				socket.leave(previousRoomId);
			}

			socket.join(gameId);
			previousRoomId = gameId;
			console.log("EVENT: Joined Game!", gameId);

			io.to(gameId).emit("gameJoined", { game: game });
		}

		// now you are subscribed to all events for that game
	});

	socket.on("leaveGame", async (payload) => {
		const gameId = payload.gameId;

		// leave the game
		socket.leave(gameId);

		// remove listeners
		socket.removeAllListeners('gameJoined', 'gameStarted', 'gameJoined', 'gameFull', 'gameCreated', 'gameLoaded');

		// remove the player from the game
		const game = await findGame(gameId);
		if (game) {
			game.removePlayer(payload.playerId);
			io.to(gameId).emit("gameLeft", { game: game });
		}

		// if you joined the room before, now you are not
	});

	socket.on("updateOptions", async (payload) => {
		const game = await findGame(payload.gameId);

		if (game) {
			const testcase = [];
			game.changeTestcase(testcase, payload.type, payload.level);

			io.to(payload.gameId).emit("gameUpdatedOptions", { game: game });
		}
	});

	socket.on("readyPlayer", async (payload) => {
		const game = await findGame(payload.gameId);

		if (game) {
			game.playerReady(payload.playerId);

			if (game.readyToStart) {
				// default testcase
				const test = factory.createTest(game.testType, { numWords: game.testLevel, quoteLength: game.testLevel, time: game.testLevel });
				const testcaseRaw = await test.getTest();
				const testcase = testcaseRaw.testcase.split(" ");
				game.changeTestcase(testcase, game.testType, game.testLevel);
				game.startGame();

				io.to(payload.gameId).emit("gameStarted", { game: game });
			} else {
				io.to(payload.gameId).emit("gameReady", { game: game });
			}
		}
	});

	socket.on("startGame", async (payload) => {
		console.log("EVENT: Starting Game!", payload);

		const game = await findGame(payload.gameId);
		game.changeTestcase(testcase);
		game.startGame();

		io.to(payload.gameId).emit("gameStarted", { game: game });
	});

	socket.on("finishPlayer", async (payload) => {
		const game = await findGame(payload.gameId);
		if (game) {
			game.finishTest(payload.playerId);
			game.updateWPM(payload.playerId, payload.wpm);
			game.updateAccuracy(payload.playerId, payload.accuracy);
			io.to(payload.gameId).emit("gamePlayerFinish", { game: game });
		}
	});

	socket.on("updateProgress", async (payload) => {
		const game = await findGame(payload.gameId);
		game.updateProgress(payload.playerId, payload.progress);
		io.to(payload.gameId).emit("gameUpdateProgress", {
			players: game.players,
		});
	});
});

const data = {
	app: app,
	server: server,
	io: io,
};

module.exports = data;
