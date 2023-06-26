const router = require("express").Router();
const { User } = require("../../../models");

// Update User name, email, or password, usable route for all three separate update functions.
// Would require the update requests to be sent indivdually, not designed for multiple updates at once.
// /api/user/put/:id
router.put("/:id", async (req, res) => {
	try {
		const { newName, newEmail, newPassword, confirmationNewPassword, existingPassword } =
			req.body;
		let updatedField;

		if (newName) {
			updatedField = { name: newName };
		} else if (newEmail) {
			updatedField = { email: newEmail };
		} else if (newPassword) {
			// if resetting password, asks for existing password and new password typed twice
			if (!existingPassword) {
				return res.status(400).send("Please enter your existing password.");
			}
			const user = await User.findById(req.params.id);
			// confirmation that existing password is correct
			const verified = await user.isCorrectPassword(existingPassword);
			if (!verified) {
				return res
					.status(400)
					.send("Your existing password is incorrect. Please try again.");
			}

			// confirmation that new password typed twice matches
			if (newPassword !== confirmationNewPassword) {
				return res.status(400).send("New passwords don't match.");
			}

			updatedField = { password: newPassword };
		} else {
			res.status(400).send("No field to update.");
		}

		const user = await User.findByIdAndUpdate(req.params.id, updatedField, { new: true });

		if (!user) {
			return res.status(404).send("User not found.");
		}

		res.status(200).json({ message: `Account for ${user.name} updated!`, user });
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
