const router = require("express").Router();
const { User } = require("../../../models");
const { auth } = require("../../../utils/auth");

// Update User name, email, or password, usable route for all three separate update functions.
// Would require the update requests to be sent indivdually, not designed for multiple updates at once.
// /api/user/put/
router.put("/", auth, async (req, res) => {
	try {
		const {
			newFirstName,
			newLastName,
			newEmail,
			newPassword,
			confirmationNewPassword,
			existingPassword,
		} = req.body;
		let updatedField = {};

		const userId = req.user._id;

		if (newFirstName) {
			updatedField.first_name = newFirstName;
		}

		if (newLastName) {
			updatedField.last_name = newLastName;
		}

		if (newEmail) {
			updatedField.email = newEmail;
		}

		if (newPassword) {
			// if resetting password, asks for existing password and new password typed twice
			if (!existingPassword) {
				return res.status(400).send("Please enter your existing password.");
			}

			const user = await User.findById(userId);
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

			updatedField.password = newPassword;
		}

		if (Object.keys(updatedField).length === 0) {
			return res.status(400).send("No updates provided.");
		}

		const updatedUser = await User.findByIdAndUpdate(userId, updatedField, {
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

// User route that adds eventID to appropriate array and handles for checking if an event being added to attending, invited, or declined is already in another array and removes it from that array
// /api/user/put/event/attending-status/
router.put("/event/attending-status/", auth, async (req, res) => {
	try {
		const { eventId, attendingStatus } = req.body;
		const userId = req.user._id;

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

		const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, {
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

// Both admin and owned would be allowed to edit event details, but owned is the original owner
// No current system for changing ownership of an event

// User route for when a new event is created, adding it to their owned events and attending events
// /api/user/put/event/create
router.put("/event/create", auth, async (req, res) => {
	try {
		const { newEventId } = req.body;
		const userId = req.user._id;

		if (!newEventId) {
			return res.status(400).send("No event ID provided.");
		}

		const updatedUser = await User.findByIdAndUpdate(userId, {
			$addToSet: { owned_events: newEventId, attending_events: eventId },
		});

		res.status(200).json({
			message: `Event added to ${updatedUser.first_name}'s owned and attending events!`,
			updatedUser,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// User route for adding or removing an admin from an event, if authorized
// /api/user/put/event/admin/:id
router.put("/event/admin/:id", auth, async (req, res) => {
	try {
		const { eventId, adminStatus } = req.body;
		const authUserId = req.user._id;
		const targetUserId = req.params.id;
		const eventTypes = {
			admin: "admin_events",
			nonAdmin: "non_admin_events",
		};

		const authUser = await User.findById(authUserId);

		if (
			!authUser.owned_events.includes(eventId) ||
			!authUser.admin_events.includes(eventId)
		) {
			return res
				.status(400)
				.send("User is not authorized to change admins for this event.");
		}

		if (!eventId || !targetUserId || !eventTypes[adminStatus]) {
			return res
				.status(400)
				.send("Missing either eventId, targetUserId, or nonvalid event type provided.");
		}

		// if the adminStatus is nonAdmin, remove the event from the admin_events array
		if (adminStatus === "nonAdmin") {
			// Remove the calendar from other arrays if it exists
			const updatedUser = await User.findByIdAndUpdate(targetUserId, {
				$pull: { admin_events: eventId },
			});
			return res
				.status(200)
				.json({ message: "Admin status removed from event!", updatedUser });
		}

		const updatedUser = await User.findByIdAndUpdate(
			targetUserId,
			{
				$addToSet: { admin_events: eventId },
			},
			{
				new: true,
			}
		);

		res.status(200).json({
			message: `${updatedUser.first_name} added as event admin!`,
			updatedUser,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// User portion that adds calendarID to appropriate invited or subscribed array
// /api/user/put/calendar/subscribed-status/
router.put("/calendar/subscribed-status/:id", auth, async (req, res) => {
	try {
		const { calendarId, subscribedStatus } = req.body;
		const userId = req.user._id;

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
		const user = await User.findById(userId);
		const { subscribed_calendars, admin_calendars, invited_calendars, owned_calendars } =
			user;

		if (
			subscribed_calendars.includes(calendarId) &&
			subscribedStatus !== "unsubscribed"
		) {
			return res.status(200).send("Already subscribed to calendar!");
		} else if (invited_calendars.includes(calendarId) && subscribedStatus === "invited") {
			return res.status(200).send("Already invited to calendar!");
		} else if (
			owned_calendars.includes(calendarId) ||
			admin_calendars.includes(calendarId)
		) {
			return res
				.status(200)
				.send("Cannot change subscription to owned or admin-ed calendar!");
		} else if (subscribedStatus === "unsubscribed") {
			// Remove the calendar from other arrays if it exists
			const updatedUser = await User.findByIdAndUpdate(
				userId,
				{
					// pull from all arrays
					$pull: {
						subscribed_calendars: calendarId,
						invited_calendars: calendarId,
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
		const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, {
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

// Both admin and owned would be allowed to edit calendar details, but owned is the original owner
// No current system for changing ownership of an event

// User route for adding a calendar to owned calendars when it is created and subscribing to it
// /api/user/put/calendar/create/
router.put("/calendar/create/", auth, async (req, res) => {
	try {
		const { newCalendarId } = req.body;
		const userId = req.user._id;

		if (!newCalendarId) {
			return res.status(400).send("No calendar ID provided.");
		}

		const updatedUser = await User.findByIdAndUpdate(userId, {
			$addToSet: { owned_calendars: newCalendarId, subscribed_calendars: newCalendarId },
		});

		res.status(200).json({
			message: `Calendar added to ${updatedUser.first_name}'s owned and subscribed calendars!`,
			updatedUser,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// User route for adding or removing an admin from a calendar
// /api/user/put/calendar/admin/:id
router.put("/calendar/admin/:id", auth, async (req, res) => {
	try {
		const { calendarId, adminStatus } = req.body;
		const authUserId = req.user._id;
		const targetUserId = req.params.id;

		const calendarTypes = {
			admin: "admin_calendars",
			nonAdmin: "non_admin_calendars",
		};

		const authUser = await User.findById(authUserId);

		if (
			!authUser.admin_calendars.includes(calendarId) ||
			!authUser.owned_calendars.includes(calendarId)
		) {
			return res
				.status(400)
				.send("User is not authorized to change admins for this calendar.");
		}

		if (!calendarId || !targetUserId || !eventTypes[adminStatus]) {
			return res
				.status(400)
				.send(
					"Missing either calendarId, targetUserId, or nonvalid calendar type provided."
				);
		}

		if (adminStatus === "nonAdmin") {
			// Remove the calendar from other arrays if it exists
			const user = await User.findByIdAndUpdate(targetUserId, {
				$pull: { admin_calendars: calendarId },
			});
			return res
				.status(200)
				.json({ message: "Admin status removed from calendar!", user });
		}

		const updatedUser = await User.findByIdAndUpdate(
			targetUserId,
			{
				$addToSet: { admin_calendars: calendarId, subscribed_calendars: calendarId },
			},
			{
				new: true,
			}
		);

		res.status(200).json({
			message: `${updatedUser.first_name} added as calendar admin!`,
			updatedUser,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// User route for if event is deleted, removing ID from all users' arrays.
// /api/user/put/event/deleted/
router.put("/event/deleted/", auth, async (req, res) => {
	try {
		const { eventId } = req.body;
		const userId = req.user._id;

		const user = await User.findById(userId);

		if (!user.owned_events.includes(eventId) || !user.admin_events.includes(eventId)) {
			return res
				.send(400)
				.json({ message: "You are not authorized to delete this event." });
		}
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
router.put("/calendar/deleted/", auth, async (req, res) => {
	try {
		const { calendarId } = req.body;
		const userId = req.user._id;

		const user = await User.findById(userId);

		if (
			!user.owned_calendars.includes(eventId) ||
			!user.admin_calendars.includes(eventId)
		) {
			return res
				.send(400)
				.json({ message: "You are not authorized to delete this calendar." });
		}

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
