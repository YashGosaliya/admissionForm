const { FormateData } = require("../utils/index");
const { PaymentRepository } = require("../database");
const { APIError } = require("../utils/error/app-errors");
const moment = require("moment");
const { CreateOrder } = require("../utils/razorpay/index");

class PaymentService {
	constructor() {
		this.repository = new PaymentRepository();
	}

	async GetAllPayment(query) {
		try {
			const data = await this.repository.FindPayment(query);
			return FormateData(data);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async GetOnePayment(query) {
		try {
			const data = await this.repository.FindOnePayemnt(query);
			return FormateData(data);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async PurchaseStart({ customerId, slot }) {
		try {
			let amount = 500;

			const startDate = moment()
				.startOf("month")
				.format("YYYY-MM-DD hh:mm");
			const endDate = moment().endOf("month").format("YYYY-MM-DD hh:mm");

			const order = await CreateOrder({
				amount: amount * 100,
				currency: "INR",
			});

			if (!order) throw new Error("Order cannot be created");
			const purchase = await this.repository.CreatePayment({
				razorpay_order_id: order.id,
				customerId,
				amount,
				slot,
				startDate: startDate,
				endDate: endDate,
			});

			return FormateData(purchase);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async PurchaseComplete({
		razorpay_payment_id,
		razorpay_signature,
		razorpay_order_id,
	}) {
		try {
			const updatedPurchase =
				await this.repository.UpdatePaymentByOrderId({
					razorpay_order_id,
					completed: true,
					razorpay_payment_id,
					razorpay_signature,
				});
			return FormateData(updatedPurchase);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async PurchaseVerfiy() {}

	async GetPaymentPayload(customerId, { razorpay_order_id }, event) {
		try {
			const payment = await this.repository.FindOnePayemnt({
				razorpay_order_id,
			});

			if (!payment)
				return FormateData({ error: "No product is available" });
			const payload = {
				event: event,
				customerId,
				payment,
			};
			return FormateData(payload);
		} catch (e) {
			throw new APIError(e);
		}
	}
}

module.exports = PaymentService;
