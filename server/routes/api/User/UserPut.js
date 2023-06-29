const router = require("express").Router();
const { User } = require("../../../models");
const { estimatedDocumentCount } = require("../../../models/User");

// Update User name, email, or password, usable route for all three separate update functions.
// Would require the update requests to be sent indivdually, not designed for multiple updates at once.
// /api/user/put/:id
router.put("/:id", async (req, res) => {
	try {
		const {
			newFirstName,
			newLastName,
			newEmail,
			newPassword,
			confirmationNewPassword,
			existingPassword,
		} = req.body;
		let updatedField;

		if (newFirstName && newLastName) {
			updatedField = { first_name: newFirstName, last_name: newLastName };
		} else if (newFirstName) {
			updatedField = { first_name: newFirstName };
		} else if (newLastName) {
			updatedField = { last_name: newLastName };
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

		const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedField, {
			new: true,
		});

		if (!updatedUser) {
			return res.status(404).send("User not found.");
		}

		res
			.status(200)
			.json({ message: `Account for ${updatedUser.first_name} updated!`, updatedUser });
	} catch (err) {
		return res.status(400).json(err);
	}
});

// User portion that adds eventID to appropriate array and handles for checking if an event being added to attending, invited, or declined is already in another array and removes it from that array
// /api/user/put/event/attending-status/:id
router.put("/event/attending-status/:id", async (req, res) => {
	try {
		const { eventId, attendingStatus } = req.body;

		if (!eventId) {
			return res.status(400).send("No event ID provided.");
		}

		// types of attendingStatus are "attending", "invited", "declined"
		const eventTypes = {
			attending: "attending_events",
			invited: "invited_events",
			declined: "declined_events",
		};

		if (!eventTypes[attendingStatus]) {
			return res.status(400).send("Invalid event status.");
		}

		// Remove the event from other arrays if it exists
		const updateQuery = {
			$pull: {},
			$addToSet: { [eventTypes[attendingStatus]]: eventId },
		};

		for (const eventType in eventTypes) {
			if (eventType !== attendingStatus) {
				updateQuery.$pull[eventTypes[eventType]] = eventId;
			}
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.id, updateQuery, {
			new: true,
		});

		res.status(200).json({
			message: `Event added to ${updatedUser.first_name}'s ${attendingStatus} events!`,
			updatedUser,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// User route for creating an event or becoming admin of an event
// Both admin and owned would be allowed to edit event details, but owned is the original owner
// /api/user/put/event/owned-or-admin/:id
router.put("/event/owned-or-admin/:id", async (req, res) => {
	try {
		const { eventId, ownedStatus } = req.body;

		if (!eventId) {
			return res.status(400).send("No event ID provided.");
		}

		const eventTypes = {
			owned: "owned_events",
			admin: "admin_events",
			nonAdmin: "nonAdmin_events",
		};

		if (!eventTypes[ownedStatus]) {
			return res.status(400).send("Invalid event status.");
		}

		if (ownedStatus === "nonAdmin") {
			// Remove the calendar from other arrays if it exists
			const user = await User.findByIdAndUpdate(req.params.id, {
				$pull: { admin_events: eventId },
			});
			return res.status(200).json({ message: "Admin status removed from event!", user });
		}

		// if the ownedStatus is owned, also add the event to the attending_events array
		const updateQuery = {
			$addToSet: { [eventTypes[ownedStatus]]: eventId },
		};

		if (ownedStatus === "owned") {
			updateQuery.$addToSet["attending_events"] = eventId;
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.id, updateQuery, {
			new: true,
		});

		res.status(200).json({
			message: `Event added to ${updatedUser.first_name}'s ${ownedStatus} events!`,
			updatedUser,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// User portion that adds calendarID to appropriate invited or subscribed array
// /api/user/put/calendar/subscribed-status/:id
router.put("/calendar/subscribed-status/:id", async (req, res) => {
	try {
		const { calendarId, subscribedStatus } = req.body;

		if (!calendarId) {
			return res.status(400).send("No calendar ID provided.");
		}

		// types of subscribedStatus are "subscribed", "invited" (don't track declined)
		const subscribedTypes = {
			subscribed: "subscribed_calendars",
			invited: "invited_calendars",
			unsubscribed: "unsubscribed_calendars",
		};

		if (!subscribedTypes[subscribedStatus]) {
			return res.status(400).send("Invalid event status.");
		}

		// Check if calendarId exists in either subscribed_calendars or invited_calendars arrays
		const user = await User.findById(req.params.id);
		const { subscribed_calendars, invited_calendars, owned_calendars } = user;

		if (
			subscribed_calendars.includes(calendarId) &&
			subscribedStatus !== "unsubscribed"
		) {
			return res.status(200).send("Already subscribed to calendar!");
		} else if (invited_calendars.includes(calendarId) && subscribedStatus === "invited") {
			return res.status(200).send("Already invited to calendar!");
		} else if (owned_calendars.includes(calendarId)) {
			return res.status(200).send("Cannot change subscription to owned calendar!");
		} else if (subscribedStatus === "unsubscribed") {
			// Remove the calendar from other arrays if it exists
			const updatedUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					// pull from all arrays
					$pull: {
						subscribed_calendars: calendarId,
						invited_calendars: calendarId,
						admin_calendars: calendarId,
					},
				},
				{
					new: true,
				}
			);

			return res
				.status(200)
				.json({ message: "Calendar unsubscribed/removed!", updatedUser });
		}

		const updateQuery = {
			$pull: {},
			$addToSet: { [subscribedTypes[subscribedStatus]]: calendarId },
		};

		if (subscribedStatus === "subscribed") {
			updateQuery.$pull["invited_calendars"] = calendarId;
		}

		// if the subscribedStatus is unsubscribed, also remove the calendar from all arrays and don't push the id anywhere
		const updatedUser = await User.findByIdAndUpdate(req.params.id, updateQuery, {
			new: true,
		});

		res.status(200).json({
			message: `Calendar added to ${updatedUser.first_name}'s ${subscribedStatus} calendars!`,
			updatedUser,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// User route for creating a calendar or becoming admin of a calendar
// Both admin and owned would be allowed to edit calendar details, but owned is the original owner
// /api/user/put/calendar/owned-or-admin/:id
router.put("/calendar/owned-or-admin/:id", async (req, res) => {
	try {
		const { calendarId, ownedStatus } = req.body;

		if (!calendarId) {
			return res.status(400).send("No event ID provided.");
		}

		const calendarTypes = {
			owned: "owned_calendars",
			admin: "admin_calendars",
			nonAdmin: "nonAdmin_calendars",
		};

		if (!calendarTypes[ownedStatus]) {
			return res.status(400).send("Invalid calendar status.");
		}

		if (ownedStatus === "nonAdmin") {
			// Remove the calendar from other arrays if it exists
			const user = await User.findByIdAndUpdate(req.params.id, {
				$pull: { admin_calendars: calendarId },
			});
			return res
				.status(200)
				.json({ message: "Admin status removed from calendar!", user });
		}

		// if owned or admin, also add the calendar to the subscribed_calendars array
		const updateQuery = {
			$addToSet: {
				[calendarTypes[ownedStatus]]: calendarId,
				subscribed_calendars: calendarId,
			},
		};

		const updatedUser = await User.findByIdAndUpdate(req.params.id, updateQuery, {
			new: true,
		});

		res.status(200).json({
			message: `Calendar added to ${updatedUser.first_name}'s ${ownedStatus} calendars!`,
			updatedUser,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// User route for if event is deleted, removing ID from all users' arrays.
// /api/user/put/event/deleted/
router.put("/event/deleted/", async (req, res) => {
	try {
		const { eventId } = req.body;
		const updatedUsers = await User.updateMany(
			{
				$pull: {
					owned_events: eventId,
					admin_events: eventId,
					attending_events: eventId,
					invited_events: eventId,
					declined_events: eventId,
				},
			},
			{ new: true }
		);

		res
			.status(200)
			.json({ message: `Event removed from all users' events!`, updatedUsers });
	} catch (err) {
		res.status(400).json(err);
	}
});

// User route for if calendar is deleted, removing ID from all users' arrays.
// /api/user/put/calendar/deleted/
router.put("/calendar/deleted/", async (req, res) => {
	try {
		const { calendarId } = req.body;
		await User.updateMany(
			{},
			{
				$pull: {
					owned_calendars: calendarId,
					admin_calendars: calendarId,
					subscribed_calendars: calendarId,
					invited_calendars: calendarId,
				},
			},
			{ new: true }
		);

		const updatedUsers = await User.find({});

		res.status(200).json({
			message: `Calendar removed from users' calendars!`,
			updatedUsers,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
