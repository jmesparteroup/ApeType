const express = require("express");
const router = express.Router();

const TestController = require("../controllers/tests");
const RedisRepository = require("../repositories/redis-repository");
const TestRepository = require("../repositories/test-repository");
const Factory = require("../models/factory");

const allowed = require("../utils/allowed");

const controller = new TestController(Factory, new RedisRepository(), allowed, new TestRepository());

router.get("/", controller.grabTest.bind(controller));




module.exports = router;
