const {
	CUSTOMER_BINDING_KEY,
	RAZORPAY_API_KEY,
	RAZORPAY_API_SECRET,
} = require("../config");
const Auth = require("../middlewares/auth");
const PaymentService = require("../services/payment-service");
const { PublishMessage } = require("../utils");

module.exports = (app, channel) => {
	const paymentService = new PaymentService();

	app.get("/", Auth, async (req, res, next) => {
		try {
			const query = req.query;
			const customerId = req.user._id;
			query.customerId = customerId;

			const data = await paymentService.GetAllPayment(query);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.get("/one", Auth, async (req, res, next) => {
		try {
			const query = req.query;
			const customerId = req.user._id;
			query.customerId = customerId;

			const data = await paymentService.GetOnePayment(query);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/start", Auth, async (req, res, next) => {
		try {
			const customerId = req.user._id;
			const { slot } = req.body;

			const data = await paymentService.PurchaseStart({
				customerId,
				slot,
			});

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/complete", Auth, async (req, res, next) => {
		try {
			const customerId = req.user._id;

			const {
				razorpay_payment_id,
				razorpay_signature,
				razorpay_order_id,
			} = req.body;

			const data = await paymentService.PurchaseComplete({
				razorpay_payment_id,
				razorpay_signature,
				razorpay_order_id,
			});

			const payload = await paymentService.GetPaymentPayload(
				customerId,
				{ razorpay_order_id },
				"ADD_ORDER"
			);

			PublishMessage(
				channel,
				CUSTOMER_BINDING_KEY,
				JSON.stringify(payload)
			);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.get("/keys", Auth, (req, res) => {
		const apiKey = RAZORPAY_API_KEY;
		const secretKey = RAZORPAY_API_SECRET;
		return res.send({
			data: {
				apiKey,
				secretKey,
			},
		});
	});
};
