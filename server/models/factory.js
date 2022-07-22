const QuoteTest = require("./quote-test");
const TimeTest = require("./time-test");
const WordTest = require("./words-test");

class Factory {
	constructor(dataStoreDB, dataStoreRedis) {
		this.dataStoreDB = dataStoreDB;
		this.dataStoreRedis = dataStoreRedis;
	}

	createTest(type, param) {
		try {
			let test;

			switch (type) {
				case "time":
					const time = +param.time;
					test = new TimeTest(
						time,
						this.dataStoreDB,
						this.dataStoreRedis
					);
					break;
				case "quote":
					const quoteLength = +param.quoteLength;
					test = new QuoteTest(
						quoteLength,
						this.dataStoreDB,
						this.dataStoreRedis
					);
					break;
				case "words":
					const numWords = +param.numWords;
					test = new WordTest(
						numWords,
						this.dataStoreDB,
						this.dataStoreRedis
					);
					break;
				default:
					return null;
			}
			return test;
		} catch (error) {
			throw new Error(error);
		}
	}
}

module.exports = Factory;
