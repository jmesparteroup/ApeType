const Test = require("./test");

class QuoteTest extends Test {
	constructor(quoteLength, dataStoreDB, dataStoreRedis) {
		super(dataStoreDB, dataStoreRedis);
		this.quoteLength = quoteLength;
	}

	async getData() {
		this.data = await this.dataStoreRedis.getQuotes(+this.quoteLength);
		if (this.data.length === 0) {
			console.log("DB: getting quotes from db");
			this.data = await this.dataStoreDB.getAllQuotes(+this.quoteLength);

			if (this.data.length === 0) throw new Error("No quotes found");

			this.dataStoreRedis.setQuotes(this.data, +this.quoteLength);
		} else {
			console.log("Redis: getting quotes from redis");
		}
	}

	// Redefine Test method to scramble quotes
	scrambler() {
		const chosen = Math.floor(Math.random() * this.data.length);
		return this.data[chosen].quote;
	}

	async getTest() {
		try {
			await this.getData();
			return {
				id: this.id,
				quoteLength: this.quoteLength,
				testcase: this.scrambler(),
			};
		} catch (error) {
			throw new Error(error);
		}
	}
}

module.exports = QuoteTest;
