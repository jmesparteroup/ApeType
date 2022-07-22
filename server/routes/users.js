const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");
const usersRepository = require("../repositories/users-repository");

const controller = new UsersController(usersRepository);

router.post("/", controller.createUser.bind(controller));
router.get("/", controller.getUsers.bind(controller));
router.get("/:id", controller.getUser.bind(controller));
router.patch("/", controller.updateUser.bind(controller));
router.delete("/:id", controller.deleteUser.bind(controller));
router.post("/login", controller.userLogin.bind(controller));

module.exports = router;
