const shortid = require("shortid");
const bcrypt = require("bcryptjs");

class User {
	constructor(email, password, firstName, lastName, userRole="user") {
		this.id = shortid.generate();
		this.email = email;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.userRole = userRole;
	}
	getID() {
		return this.id;
	}
	getUserDetails() {
		return {
			id: this.id,
			email: this.email,
			userPassword: this.password,
			firstName: this.firstName,
			lastName: this.lastName,
			userRole: this.userRole,
		};
	}
	getUserRole() {
		return this.userRole;
	}
	static async hashPassword(password){
		return bcrypt.hash(password, 10);
	}
	static async comparePassword(password, hash){
		return bcrypt.compare(password, hash);
	}
}

module.exports = User;
