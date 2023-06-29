const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../../../models");

// User create route
// /api/user/post/create
router.post("/create", async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;

		const user = await User.create({ first_name, last_name, email, password });
		res
			.status(200)
			.json({ message: `Account for ${first_name} ${last_name} created!`, user });
	} catch (err) {
		if (err.code === 11000 && err.keyPattern && err.keyValue) {
			// Duplicate key error for email field
			const { email } = err.keyValue;
			return res.status(400).json({ error: `Email '${email}' is already in use.` });
		}
		res.status(400).json(err);
	}
});

// User login route
// /api/user/post/login
router.post("/login", async (req, res) => {
	try {
		let { email, password } = req.body;
		email = email.toLowerCase();
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).send("Email not found.");
		}

		const verified = await user.isCorrectPassword(password);

		if (!verified) {
			return res.status(400).send("Password does not match.");
		}

		// add JWT here

		res.json({ message: "Login successful!" });
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
