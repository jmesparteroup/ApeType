const words = require("../db/words");
const Test = require("./test");

class TimeTest extends Test {
	constructor(time, dataStoreDB, dataStoreRedis) {
		super(dataStoreDB, dataStoreRedis);
		this.time = [15, 30, 60, 120][time];
	}
	async getTest() {
		try {
			await this.getData();
			return {
				id: this.id,
				time: this.time,
				testcase: this.scrambler(Math.floor((this.time * 300) / 60)),
			};
		} catch (error) {
			throw new Error(error);
		}
	}
}

module.exports = TimeTest;
