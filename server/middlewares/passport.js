//require dot config
const { getUser } = require("../repositories/users-repository");
require("dotenv").config();

const JwtStrategy = require("passport-jwt").Strategy,
	ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
	new JwtStrategy(opts, function (jwt_payload, done) {
		getUser(jwt_payload.userID)
			.then((user) => {
				if (user) {
					return done(null, user);
				}
				return done(null, false);
			})
			.catch((err) => {
				return done(err, false);
			});
	})
);

const authenticationWhiteList = ['GET /scores']

module.exports = (req,res,next) => {
	let route = `${req.method} ${req.baseUrl}`;
	console.log(`${route}`);

	if (authenticationWhiteList.indexOf(route) !== -1) return next();

	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) {
			return res.status(500).json({ message: "Something went wrong" });
		}
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		req.user = user;
		next();
	})(req,res,next);
}


