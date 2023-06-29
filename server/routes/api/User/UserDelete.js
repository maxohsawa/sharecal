const router = require("express").Router();
const { User } = require("../../../models");
const { auth } = require("../../../utils/auth");

// Delete User by ID route
// Requires UI to ask user to retype email address to confirm deletion
// /api/user/delete/
router.delete("/", auth, async (req, res) => {
	try {
		const { confirmationPassword } = req.body;

		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).send("User not found.");
		}

		const verification = await user.isCorrectPassword(confirmationPassword);

		if (!verification) {
			return res.status(400).send("Password does not match user record.");
		}

		const deletedUser = await User.findByIdAndDelete(req.user._id);
		res.status(200).json({ message: `Account for ${deletedUser.first_name} deleted!` });
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
