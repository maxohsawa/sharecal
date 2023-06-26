const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../../../models");

// User create route
// /api/user/post/create
router.post("/create", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const user = await User.create({ name, email, password });
		res.status(200).json({ message: `Account for ${name} created!` });
	} catch (err) {
		res.status(400).json(err);
	}
});

// User login route
// /api/user/post/login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		email.toLowercase();
		const user = await User.findOne({ email });

		if (!user) {
			res.status(400).send("Email not found.");
		}

		const verified = await user.isCorrectPassword(password);

		if (!verified) {
			res.status(400).send("Password does not match.");
		}

		res.json({ message: "Login successful!" });
	} catch (err) {
		res.status(400).json(err);
	}
});
