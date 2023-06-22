const { Schema, model } = require("mongoose");

const calendarSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	invited_users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	subscribed_users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	admin_users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	declined_users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	events: [
		{
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	],
	notes: {
		type: String,
	},
	theme: {
		type: String,
		required: true,
		default: "red",
	},
});

const Calendar = model("Calendar", calendarSchema);

module.exports = Calendar;
