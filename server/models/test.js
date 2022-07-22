const shortid = require("shortid");

class Test {
	constructor(dataStoreDB, dataStoreRedis) {
		this.date = new Date().toISOString();
		this.id = shortid.generate();
		this.testcase = "";
		
		this.dataStoreDB = dataStoreDB;
		this.dataStoreRedis = dataStoreRedis;
	}

	async getData() {
		try {
			this.data = await this.dataStoreRedis.getWords();
			if (this.data.length === 0) {
				console.log("DB: getting words from db");
				this.data = await this.dataStoreDB.getAllWords();

				if (this.data.length === 0 ) throw new Error("No words found");

				this.dataStoreRedis.setWords(this.data);
			} else {
				console.log("Redis: getting words from redis");
			}
		} catch (error) {
			console.log(error);
			throw new Error(error);
		}
	}

	scrambler(num) {
		const getRandom = () => Math.floor(Math.random() * this.data.length);

		let prev = -2,
			curr = getRandom();

		const result = [];

		for (let i = 0; i < num; i++) {
			// mechanism to prevent the same word getting picked twice in a row
			while (curr == prev) {
				curr = getRandom();
			}
			result.push(this.data[curr]);
			prev = curr;
		}
		return result.join(" ");
	}

	getTest() {
		return this.testcase;
	}

	getID() {
		return this.id;
	}
}

module.exports = Test;
