// const usersDB = require("../db/users");
const conn = require("../config/db");
const User = require("../models/user");
const { getToken } = require("../utils/helpers");
require("dotenv").config();

async function checkIfExist(field, value) {
	const query = `SELECT * FROM users WHERE ${field} = ?`;
	try {
		const [rows] = await conn.query(query, value);
		return rows.length > 0;
	} catch (err) {
		console.log(err);
	}
	return false;
}

async function userExists(userID) {
	try {
		const query = "CALL SelectUser(?)";
		const [rows] = await conn.query(query, userID);
		return rows.length > 0;
	} catch (error) {
		throw new Error(error);
	}
}

async function createUser({ email, userPassword, firstName, lastName }) {
	try {
		const user = new User(email, userPassword, firstName, lastName);
		const userData = user.getUserDetails();
		console.log(userData);
		const query = "CALL CreateUser(?, ?, ?, ?, ?, ?)";
		await conn.query(query, [
			user.getID(),
			userData.email,
			await User.hashPassword(userData.userPassword),
			userData.firstName,
			userData.lastName,
			userData.userRole,
		]);

		const userId = user.getID();
		const token = getToken(userId);

		return {
			userID: userId,
			token: "Bearer " + token,
			role: userData.userRole,
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}

async function updateUser(userID, email, userPassword, firstName, lastName) {
	try {
		// OPTION 1: GET THEN PASSBACK TO USER REPLACING ONLY PATCH FIELDS
		// OPTION 2: ATOMIC APPROACH => HANDLE IT SP
		let hashPassword = null;
		if (userPassword) {
			hashPassword = await User.hashPassword(userPassword);
		}

		// check if email exists
		if (email) {
			if (await checkIfExist("email", email)) {
				throw new Error("Email already exists");
			}
		}

		console.log(hashPassword);

		const query = "CALL UpdateUser(?, ?, ?, ?, ?, ?)";
		const [[user,__],_] = await conn.query(query, [
			userID,
			email,
			hashPassword,
			firstName,
			lastName,
			null,
		]);
		console.log(user);
		return user[0];
	} catch (error) {
		throw new Error(error);
	}
}

async function getAllUsers() {
	try {
		const query = "CALL SelectAllUsers()";
		const [rows] = await conn.query(query);
		return rows;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}

async function getUser(userID) {
	try {
		const query = "CALL SelectUser(?)";
		const [[_user, __], _] = await conn.query(query, userID);
		const user = _user[0];
		console.log(user);
		if (!user) throw new Error("User not found");
		return {
			userID: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			userRole: user.userRole,
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}

async function authenticateUser(email, password) {
	try {
		const query = "CALL LoginUser(?)";
		const [[user, __], _] = await conn.query(query, [email]);
		console.log(user);
		if (!user.length) throw new Error("User not found");

		// check for password using compare
		const isValid = await User.comparePassword(password, user[0].userPassword);
		if (!isValid) throw new Error("Invalid password");

		// create token
		const token = getToken(user[0].id);

		return {
			userID: user[0].id,
			token: "Bearer " + token,
			role: user[0].userRole,
		};
	} catch (err) {
		throw new Error(err);
	}
}

async function deleteUser(userID) {
	try {
		const query = "CALL DeleteUser(?)";
		await conn.query(query, userID);
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = {
	userExists,
	checkIfExist,
	createUser,
	getUser,
	getAllUsers,
	userExists,
	authenticateUser,
	updateUser,
	deleteUser,
};
