const router = require("express").Router();
const { User } = require("../../../models");
const { auth } = require("../../../utils/auth");

// Get User by ID route
// /api/user/get/:id
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.json(user);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Get all Users route
// /api/user/get/
router.get("/", auth, async (req, res) => {
	try {
		const users = await User.find({});
		res.json(users);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Get users who subscribe to a particular calendar
// Get users by Calendar ID in subscribed_calendars field
// (/api/user/get/calendar/:id)
router.get("/calendar/:id", auth, async (req, res) => {
	try {
		const calendarID = req.params.id;
		const users = await User.find({ subscribed_calendars: { $in: [calendarID] } });
		res.json(users);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Get users who are attending an event
// Get users by Event ID in attending_events
// /api/user/get/event/going/:id
router.get("/event/going/:id", async (req, res) => {
	try {
		const eventID = req.params.id;
		const users = await User.find({ attending_events: { $in: [eventID] } });
		res.json(users);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Get users who have declined an event
// Get users by Event ID in declined_events
// /api/user/get/event/declined/:id
router.get("/event/declined/:id", async (req, res) => {
	try {
		const eventID = req.params.id;
		const users = await User.find({ declined_events: { $in: [eventID] } });
		res.json(users);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Get users who have been invited to an event
// Get users by Event ID in invited_events
// /api/user/get/event/invited/:id
router.get("/event/invited/:id", async (req, res) => {
	try {
		const eventID = req.params.id;
		const users = await User.find({ invited_events: { $in: [eventID] } });
		res.json(users);
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
