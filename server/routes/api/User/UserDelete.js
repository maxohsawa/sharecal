const router = require("express").Router();
const { User } = require("../../../models");

// Delete User by ID route
// Requires UI to ask user to retype email address to confirm deletion
// /api/user/delete/:id
router.delete("/:id", async (req, res) => {
	try {
		const { confirmationEmail } = req.body;
		confirmationEmail.toLowerCase();

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).send("User not found.");
		}

		if (user.email === confirmationEmail) {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json({ message: `Account for ${user.name} deleted!` });
		} else {
			res.status(400).send("Confirmation email does not match user record.");
		}
	} catch (err) {
		res.status(400).json(err);
	}
});
