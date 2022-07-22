const Redis = require("ioredis");
const redis = new Redis({host: "redis", port: 6379});

class RedisRepository {
	constructor() {
		this.redis = redis;
	}

	// cache-aside for leaderboard
	async getTimeLeaderboards(level) {
		const key = `leaderboard:${level}`;
		const leaderboard = await this.redis.get(key);
		if (leaderboard) return JSON.parse(leaderboard);
		return [];
	}

	// save leaderboard to cache-aside
	async setTimeLeaderboards(level, leaderboard) {
		const key = `leaderboard:${level}`;
		await this.redis.set(key, JSON.stringify(leaderboard));
		await this.redis.expire(key, 15 * 60);
	}

	async invalidateTimeLeaderboards(level) {
		const key = `leaderboard:${level}`;
		await this.redis.del(key);
	}

	// cache-aside for words and quotes
	async getWords() {
		const key = "words";
		const words = await this.redis.get(key);
		if (words) return JSON.parse(words);
		return [];
	}

	async setWords(words) {
		const key = "words";
		await this.redis.set(key, JSON.stringify(words));
		await this.redis.expire(key, 24*60*60);
	}

	async getQuotes(level) {
		const key = `quotes-${level}`;
		const quotes = await this.redis.get(key);
		if (quotes) return JSON.parse(quotes);
		return [];
	}

	async setQuotes(quotes, level) {
		const key = `quotes-${level}`;
		await this.redis.set(key, JSON.stringify(quotes));
		await this.redis.expire(key, 24*60*60);
	}

	async invalidateWords() {
		const key = "words";
		await this.redis.del(key);
	}

	async invalidateQuotes(level) {
		const key = `quotes-${level}`;
		await this.redis.del(key);
	}
	
}

module.exports = RedisRepository;