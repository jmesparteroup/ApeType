const conn = require("../config/db");
const shortid = require("shortid");

class AdminRepository {
	constructor() {}

	async addWord(word) {
		try {
			const query = "CALL CreateWord(?)";
			await conn.query(query, [word]);
			return { word };
		} catch (err) {
			throw new Error(err);
		}
	}

	async patchWord(word, newWord) {
		try {
			const query = "CALL PatchWord(?, ?)";
			await conn.query(query, [word, newWord]);
			return { newWord };
		} catch (err) {
			throw new Error(err);
		}
	}

	async deleteWord(word) {
		try {
			const query = "CALL DeleteWord(?)";
			await conn.query(query, [word]);
			return { word };
		} catch (err) {
			throw new Error(err);
		}
	}

	async addQuote(quote, source) {
		try {
			const query = "CALL CreateQuote(?)";
			const length = quote.length;
			await conn.query(query, [source, quote, length]);
		} catch (err) {
			throw new Error(err);
		}
	}

	async patchQuote(id, quote, source) {
		try {
			const query = "CALL PatchQuote(?, ?, ?, ?)";
			const length = quote.length;
			await conn.query(query, [id, source, quote, length]);
		} catch (err) {
			throw new Error(err);
		}
	}

	async deleteQuote(id) {
		try {
			const query = "CALL DeleteQuote(?)";
			await conn.query(query, [id]);
		} catch (err) {
			throw new Error(err);
		}
	}

	async getAllWords() {
		try {
			const query = "CALL ReadWords()";
			const [[rows], _] = await conn.query(query);
			return rows;
		} catch (error) {
			console.log(error);
			throw new Error(error);
		}
	}

	async getAllQuotes() {
		try {
			const query = "CALL ReadQuotes(?,?)";
			const [[rows], _] = await conn.query(query, [0, 9999]);
			return rows;
		} catch (error) {
			console.log(error);
			throw new Error(error);
		}
	}
}

module.exports = AdminRepository;
