const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	start_time: {
		type: Date,
	},
	end_time: {
		type: Date,
	},
	all_day: {
		type: Boolean,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	invited_attendees: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	accepted_attendees: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	declined_attendees: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	location: {
		type: String,
	},
	notes: {
		type: String,
	},
});

eventSchema.virtual("duration").get(function () {
	return this.end_time - this.start_time;
});

const Event = model("Event", eventSchema);

module.exports = Event;
