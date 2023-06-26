const router = require("express").Router();
const { User } = require("../../../models");

// Update User name, email, or password, usable route for all three separate update functions.
// Would require the update requests to be sent indivdually, not designed for multiple updates at once.
// /api/user/put/:id
router.put("/:id", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		let updatedField;
		if (name) {
			updatedField = { name };
		} else if (email) {
			updatedField = { email };
		} else if (password) {
			updatedField = { password };
		} else {
			res.status(400).send("No field to update.");
		}

		const user = await User.findbyIDandUpdate(req.params.id, updatedField);

		if (!user) {
			return res.status(404).send("User not found.");
		}

		res.status(200).json({ message: `Account for ${name} updated!` });
	} catch (err) {
		res.status(400).json(err);
	}
});
