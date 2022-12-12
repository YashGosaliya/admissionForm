const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		salt: { type: String },
		age: {
			type: Number,
			required: [true, "Age is required"],
			min: 18,
			max: 65,
		},
		phone: {
			type: String,
			unique: true,
			match: /^(\[- ]?)?\d{10}$/,
			required: [true, "Not a valid phone number"],
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		name: { type: String, required: [true, "Name is required"] },
		address: [
			{ type: Schema.Types.ObjectId, ref: "address", required: true },
		],
		orders: [
			{
				_id: { type: String, required: true },
				slot: { type: String, required: true },
				date: { type: Date },
				startDate: { type: Date },
				endDate: { type: Date },
			},
		],
		startDate: { type: Date },
		endDate: { type: Date },
		slot: { type: String },
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.salt;
				delete ret.__v;
			},
		},
		timestamps: true,
	}
);

module.exports = mongoose.model("customer", CustomerSchema);
