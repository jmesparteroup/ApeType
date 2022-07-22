const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const passport = require("passport");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const testsRouter = require("./routes/tests");
const scoresRouter = require("./routes/scores");
const adminRouter = require("./routes/admin");

const populate = require("./utils/populate");

const authenticateRoute = require("./middlewares/passport");
const adminAuth = require("./middlewares/adminAuth");

const appData = require('./socket');
const app = appData.app;
const server = appData.server


app.use(cors());
app.use(passport.initialize());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tests", testsRouter);
app.use("/scores", authenticateRoute, scoresRouter);
app.use("/admin", [authenticateRoute, adminAuth], adminRouter);

app.get("/populate", async (req, res, next) => {
	await populate.populateScores(60);
	await populate.populateWordsAndQuotesDB();
	res.status(200).send("Populated");
});

const port = 3001;
app.set('port', port);
console.log(`Server started on port ${port}`);
server.listen(port);
server.on('error', (err) => {
	
	console.log(err);
});
server.on('listening', () => {
	console.log('Socket listening on port 3001');
});


// console.log("Server started");
module.exports = app;
