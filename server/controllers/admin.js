class AdminController {
	constructor(repository, redisRepository) {
		this.repository = repository;
		this.redisRepository = redisRepository;
	}
	async addWord(req, res) {
		try {
			const { word } = req.body;

			console.log(word);
			
			// check if word is a valid word format
			if (!word.match(/^[a-zA-Z]+$/)) return res.status(400).json({});
			const result = await this.repository.addWord(word);
			// invalidate redis 
			await this.redisRepository.invalidateWords();
			res.status(200).json(result);
		} catch (err) {
			console.log("ERROR",err);
			res.status(500).json(err);
		}
	}

	async patchWord(req, res) {
		try {
			const { word, newWord } = req.body;

			// check if word is a valid word format
			if (!newWord) return res.status(400).json({});
			if (!newWord.match(/^[a-zA-Z]+$/)) return res.status(400).json({});
			const result = await this.repository.patchWord(word, newWord);
			// invalidate redis 
			await this.redisRepository.invalidateWords();
			res.status(200).json(result);
		} catch (err) {
			console.log("ERROR",err);
			res.status(500).json(err);
		}
	}

	async deleteWord(req, res) {
		try {
			const { word } = req.params;
			const result = await this.repository.deleteWord(word);
			// invalidate redis 
			await this.redisRepository.invalidateWords();
			res.status(200).json(result);
		} catch (err) {
			console.log("ERROR",err);
			res.status(500).json(err);
		}
	}

	async addQuote(req, res) {
		try {
			const { quote, source } = req.body;
			const result = await this.repository.addQuote(quote, source);
			res.status(200).json(result);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}

	async patchQuote(req, res) {
		try {
			const { id, quote, source } = req.body;
			const result = await this.repository.patchQuote(id, quote, source);
			res.status(200).json(result);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}

	async deleteQuote(req, res) {
		try {
			const { id } = req.body;
			const result = await this.repository.deleteQuote(id);
			res.status(200).json(result);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}


	async getAllWords(req, res) {
		try {
			const result = await this.repository.getAllWords();
			res.status(200).json(result);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}

	async getAllQuotes(req, res) {
		try {
			const result = await this.repository.getAllQuotes();
			res.status(200).json(result);
			
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}

}

module.exports = AdminController;
