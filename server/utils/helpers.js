const jwt = require("jsonwebtoken");

module.exports = {
	idExist: function (db, userID) {
		return userID in db;
	},
	getToken: function (userID) {
		return jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
	}
};
