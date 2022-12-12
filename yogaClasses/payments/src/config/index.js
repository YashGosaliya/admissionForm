const dotEnv = require("dotenv").config({ path: "./.env" });

// if (process.env.NODE_ENV !== "prod") {
//   const configFile = `./.env.${process.env.NODE_ENV}`;
//   // dotEnv.config({ path: configFile });
// } else {
//   dotEnv.config();
// }

module.exports = {
	PORT: process.env.PORT,
	DB_URL: process.env.MONGODB_URI,
	APP_SECRET: process.env.APP_SECRET,
	EXCHANGE_NAME: "PROJECT",
	MESSAGE_QUEUE_URL: process.env.RABBIT_MQ_URL,
	CUSTOMER_BINDING_KEY: "CUSTOMER_SERVICE",
	PAYMENT_BINDING_KEY: "PAYMENT_SERVICE",
	QUEUE_NAME: "PROJECT_QUEUE",
	RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
	RAZORPAY_API_SECRET: process.env.RAZORPAY_API_SECRET,
};
