const words = require("../db/words");
const Test = require("./test");

class WordTest extends Test {
	constructor(numWords, dataStoreDB, dataStoreRedis) {
		super(dataStoreDB, dataStoreRedis);
		this.numWords = [10, 25, 50, 100][numWords];
	}
	async getTest() {
		try {
			await this.getData();
			return {
				id: this.id,
				numWords: this.numWords,
				testcase: this.scrambler(this.numWords),
			};
		} catch (error) {
			throw new Error(error);
		}
	}
}

module.exports = WordTest;
