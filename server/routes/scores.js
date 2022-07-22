const express = require("express");
const router = express.Router();
const { io } = require("../socket");

const ScoresController = require("../controllers/scores");
const ScoresRepository = require("../repositories/scores-repository");
const RedisRepository = require("../repositories/redis-repository");

const repository = new ScoresRepository();
const redisRepository = new RedisRepository();
const controller = new ScoresController(repository, redisRepository, io);

router.post("/", controller.recordScore.bind(controller));
router.get("/", controller.readAllScores.bind(controller));
router.get("/:id", controller.readUserScores.bind(controller));
router.get("/leaderboards/:level", controller.getTimeLeaderboards.bind(controller));

module.exports = router;
