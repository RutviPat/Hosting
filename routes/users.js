const router = require('express').Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

const dotenv = require("dotenv");
dotenv.config();


// Set up passport 
passport.use(new LocalStrategy(
	{ usernameField: 'username', passwordField: 'password' },
	async (username, password, done) => {
		const user = await User.findOne({username: username });

		if (!user) {
			return done(null, false, { message: "No such user found"});
		}


		bcrypt.compare(password, user.password, async(err, result) => {
			if (err) {
				return done(err);
			}
			if (result) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Incorrect username or password"});
			}
		})
	}
));

// passport.use(new GithubStrategy(
// 	async (accessToken, refreshToken, profile, done) => {
// 		const user = await User.findOne({ username: profile.username });
// 		if (user) {
// 			return done(null, user);
// 		}

// 		// If user not in account:
// 		const newUser = new User({
// 			username: profile.username,
// 			email: profile.emails[0].value,
// 			password: "RandomPassword1"
// 		});

// 		await newUser.save();
// 		return done(null, newUser);
// 	}
// ))

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/users/login");
}


// Send sign up page
router.get("/signup", (req, res) => {
	res.render("user/signup");
});

// Handle signup
router.post("/signup", async (req, res) => {
	console.log(req.body);
	const { username, email, password } = req.body;
	bcrypt.hash(password, Number(process.env.SALT_ROUNDS)).then(async (hash) => {
		const newUser = new User({
			username: username,
			email: email,
			password: hash
		});
		await newUser.save();
	});
	res.redirect("/user/login");
});

// Send login page
router.get("/login", (req, res) => {
	res.render("user/login");
});

// Handle login with local strategy
router.post("/login", passport.authenticate('local', {
	successRedirect: '/entry/all',
	failureRedirect: '/users/login'
}));

// Handle login with github strategy
router.get("/login/github", 
	passport.authenticate('github', {
		scope: ['user:username']
	})
);

router.get("/github/callback", 
	passport.authenticate('github', {
		failureRedirect: '/users/login'
	}),
	(req, res) => {
		res.redirect("/entry/all");
	}
)

// Handle logout
router.get("/logout", (req, res) => {
	req.logout(() => {
		res.redirect("/users/login");
	});
});


module.exports = {
	router,
	isAuthenticated
}