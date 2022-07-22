const conn = require("../config/db");
const shortid = require("shortid");

class TestRepository {
	constructor() {}

    async getAllWords() {
        try {
            const query = "CALL ReadWords()";
            const [[rows],_] = await conn.query(query);
            const words = rows.map(entry => entry.word)
            return words;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async getAllQuotes(level) {
        try {
            const groups = [
                [0, 100],
                [101, 300],
                [301, 600],
                [601, 9999],
            ];
    
            const query = "CALL ReadQuotes(?,?)";
            const [[rows],_] = await conn.query(query,groups[level]);
            return rows;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    

}

module.exports = TestRepository;
