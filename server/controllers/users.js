
class UsersController {
	constructor(repository) {
		this.repository = repository;
	}
	// callback for POST /user
	async createUser(req, res) {
		try {
			const { email, userPassword, firstName, lastName  } = req.body;

			if (
				!email ||
				!userPassword ||
				!firstName ||
				!lastName ||
				!email.includes("@")
			) {
				return res.status(400).json({message: "Empty fields"});
			}

			if (await this.repository.checkIfExist("email", email))
				return res.status(409).json({message: "email already exists"});

			const user = await this.repository.createUser({ email, userPassword, firstName, lastName });

			return res.status(201).json(user); 
		} catch (err) {
			console.log(err);
			res.status(500).json({message: `${err.message}`});
		}
	}

	// callback for GET /user/all
	async getUsers(req, res) {
		try {
			// NOT IMPLEMENTED CHECK IF ROLE IS ALLOWED FOR THIS ENDPOINT
			const [allUsers, _] = await this.repository.getAllUsers();
			return res.status(200).json({ users: allUsers }); 
		} catch (err) {
			console.log(err);
			return res.status(500).json({message:`${err.message}`}); 
		}
	}

	// callback for GET /user/:id
	async getUser(req, res) {
		try {
			const { id: userID } = req.params;
			const userEntry = await this.repository.getUser(userID); 
			if (!userEntry) return res.status(404).json({});
			return res.status(200).json({ ...userEntry }); 
		} catch (err) {
			return res.status(400).json({message:`${"hello"}`});
		}
	}

	async updateUser(req, res) {
		try {
			const {
				id: userID,
				email,
				userPassword,
				lastName,
				firstName,
			} = req.body;


			if (!userID) return res.status(404).json({});
			// check if email is a valid email format
			if (email && !email.includes("@")) return res.status(400).json({});

			// Update user entry in our db
			const result = await this.repository.updateUser(
				userID,
				email,
				userPassword,
				lastName,
				firstName
			);

			res.status(200).json(result);
		} catch (err) {
			console.log(err);
			res.status(500).json({message:`${err.message}`});
		}
	}
	//callback for DELETE /user/:id
	async deleteUser(req, res) {
		try {
			const userID = req.params.id;

			if (!userID) return res.status(404).json({});

			await this.repository.deleteUser(userID);
			res.status(200).json({ id: userID });
		} catch (err) {
			console.log(err)
			res.status(500).json({});
		}
	}
	//callback for POST /user/login
	async userLogin(req, res) {
		try {
			const { email, password } = req.body;

			if (!email || !password || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
				return res.status(400).json({}); 

			const user = await this.repository.authenticateUser(
				email,
				password
			);
			res.status(200).json(user);
		} catch (error) {
			console.log(error);
			res.status(404).json({ message: "Invalid email or password" });
		}
	}
}

module.exports = UsersController;
