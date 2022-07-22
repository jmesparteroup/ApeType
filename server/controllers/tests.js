class TestController {

	constructor(Factory, redisRepository, allowed, repository){
		this.Factory = Factory;
		this.redisRepository = redisRepository;
		this.allowed = allowed;
		this.repository = repository;
	}	

	async grabTest (req, res) {
		try {
			const { type, userID, quoteLength, time, numWords } = req.query;

			if (
				!type ||
				!this.allowed.type.includes(type) ||
				(quoteLength && !this.allowed.quoteLength.includes(+quoteLength)) ||
				(time && !this.allowed.time.includes(+time)) ||
				(numWords && !this.allowed.numWords.includes(+numWords))
			)
				return res.status(400).json({});
			

			const factory = new this.Factory(this.repository, this.redisRepository);

			const test = factory.createTest(type, req.query);
			const testcase = await test.getTest();

			res.status(200).json(testcase);

		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}
};


module.exports = TestController;
