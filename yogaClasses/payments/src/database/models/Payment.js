const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
	{
		razorpay_order_id: {
			type: String,
			required: true,
		},
		customerId: { type: String },
		completed: {
			type: Boolean,
			default: false,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		razorpay_payment_id: {
			type: String,
		},
		razorpay_signature: {
			type: String,
		},
		amount: {
			type: Number,
			default: 0,
		},
		slot: {
			type: String,
			required: true,
			enum: ["6-7AM", "7-8AM", "8-9AM", "5-6PM"],
		},
		startDate: { type: Date },
		endDate: { type: Date },
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

module.exports = mongoose.model("Payment", PaymentSchema);
