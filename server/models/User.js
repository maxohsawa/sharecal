const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+@.+\..+/, "Must match an email address!"],
	},
	password: {
		type: String,
		required: true,
		validate: {
			validator: function (value) {
				// tests password for having one digit, one lowercase, one uppercase, one special character, and to be at least 8 characters long
				return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
					value
				);
			},
			message: (props) => "Not a valid password!",
		},
	},
	owned_events: [
		{
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	],
	admin_events: [
		{
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	],
	accepted_events: [
		{
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	],
	invited_events: [
		{
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	],
	declined_events: [
		{
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	],
	owned_calendars: [
		{
			type: Schema.Types.ObjectId,
			ref: "Calendar",
		},
	],
	admin_calendars: [
		{
			type: Schema.Types.ObjectId,
			ref: "Calendar",
		},
	],
	accepted_calendars: [
		{
			type: Schema.Types.ObjectId,
			ref: "Calendar",
		},
	],
	invited_calendars: [
		{
			type: Schema.Types.ObjectId,
			ref: "Calendar",
		},
	],
	timezone: {
		type: String,
		required: true,
		default: "UTC-5",
	},
});

userSchema.pre("save", async function (next) {
	this.email = this.email.toLowerCase();
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10;
		try {
			this.password = await bcrypt.hash(this.password, saltRounds);
		} catch (err) {
			console.log(err);
		}
	}
	next();
});

userSchema.methods.isCorrectPassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (err) {
		throw new Error(err);
	}
};

const User = model("User", userSchema);

module.exports = User;