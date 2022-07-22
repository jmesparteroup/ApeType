const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin");
const AdminRepository = require("../repositories/admin-repository");
const RedisRepository = require("../repositories/redis-repository");

const adminController = new AdminController(new AdminRepository(), new RedisRepository());

// POST new word to db
router.post("/words", adminController.addWord.bind(adminController));
// POST new quote to db
router.post("/quotes", adminController.addQuote.bind(adminController));
// PATCH existing word in db
router.patch("/words", adminController.patchWord.bind(adminController));
// DELETE existing word from db
router.delete("/words/:word", adminController.deleteWord.bind(adminController));
// PATCH existing quote in db
router.patch("/quotes", adminController.patchQuote.bind(adminController));
// DELETE existing quote from db
router.delete("/quotes", adminController.deleteQuote.bind(adminController));
// GET all words from db
router.get("/words", adminController.getAllWords.bind(adminController));
// GET all quotes from db
router.get("/quotes", adminController.getAllQuotes.bind(adminController));

module.exports = router;
