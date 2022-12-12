const { APIError, STATUS_CODES } = require("../../utils/error/app-errors");
const { PaymentModel } = require("../models");

class PaymentRepository {
	async CreatePayment({
		razorpay_order_id,
		customerId,
		completed,
		verified,
		razorpay_payment_id,
		razorpay_signature,
		amount,
		slot,
		startDate,
		endDate,
	}) {
		try {
			const payment = new PaymentModel({
				razorpay_order_id,
				customerId,
				completed,
				verified,
				razorpay_payment_id,
				razorpay_signature,
				amount,
				slot,
				startDate,
				endDate,
			});
			const paymentResult = await payment.save();
			return paymentResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on creating payment ${e}`
			);
		}
	}

	async UpdatePayment({
		razorpay_order_id,
		customerId,
		completed,
		verified,
		razorpay_payment_id,
		razorpay_signature,
		amount,
		slot,
		startDate,
		endDate,
		_id,
	}) {
		try {
			const payment = await PaymentModel.findById(_id);

			payment.razorpay_order_id =
				razorpay_order_id || payment.razorpay_order_id;
			payment.customerId = customerId || payment.customerId;
			payment.completed = completed || payment.completed;
			payment.verified = verified || payment.verified;
			payment.razorpay_payment_id =
				razorpay_payment_id || payment.razorpay_payment_id;
			payment.razorpay_signature =
				razorpay_signature || payment.razorpay_signature;
			payment.amount = amount || payment.amount;
			payment.slot = slot || payment.slot;
			payment.startDate = startDate || payment.startDate;
			payment.endDate = endDate || payment.endDate;

			const paymentResult = await payment.save();
			return paymentResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on updating payment ${e}`
			);
		}
	}

	async UpdatePaymentByOrderId({
		razorpay_order_id,
		customerId,
		completed,
		verified,
		razorpay_payment_id,
		razorpay_signature,
		items,
		amount,
		slot,
		startDate,
		endDate,
	}) {
		try {
			const payment = await PaymentModel.findOne({ razorpay_order_id });

			if (!payment) throw new Error("No such payment");

			payment.customerId = customerId || payment.customerId;
			payment.completed = completed || payment.completed;
			payment.verified = verified || payment.verified;
			payment.razorpay_payment_id =
				razorpay_payment_id || payment.razorpay_payment_id;
			payment.razorpay_signature =
				razorpay_signature || payment.razorpay_signature;
			payment.items = items || payment.items;
			payment.amount = amount || payment.amount;
			payment.slot = slot || payment.slot;
			payment.startDate = startDate || payment.startDate;
			payment.endDate = endDate || payment.endDate;

			const paymentResult = await payment.save();
			return paymentResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on updating payment ${e}`
			);
		}
	}

	async FindPayment(query) {
		try {
			const payments = await PaymentModel.find(query);
			return payments;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on finding payment ${e}`
			);
		}
	}

	async FindOnePayemnt(query) {
		try {
			const payment = await PaymentModel.findOne(query);
			return payment;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on finding payment ${e}`
			);
		}
	}
}

module.exports = PaymentRepository;
