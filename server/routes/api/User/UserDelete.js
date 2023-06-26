const router = require("express").Router();
const { User } = require("../../../models");

// Delete User by ID route
// Requires UI to ask user to retype email address to confirm deletion
// /api/user/delete/:id
router.delete("/:id", async (req, res) => {
	try {
		const { confirmationPassword } = req.body;

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).send("User not found.");
		}

		const verification = await user.isCorrectPassword(confirmationPassword);

		if (!verification) {
			return res.status(400).send("Password does not match user record.");
		}

		const deletedUser = await User.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: `Account for ${deletedUser.name} deleted!` });
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
