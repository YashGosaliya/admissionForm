const { AsyncAPIError } = require("../../src/utils/error/app-errors");
const { CustomerRepository } = require("../database");
const {
	FormateData,
	GeneratePassword,
	GenerateSalt,
	GenerateSignature,
	ValidatePassword,
} = require("../utils");
const { APIError, BadRequestError } = require("../utils/error/app-errors");
const moment = require("moment");
class CustomerService {
	constructor() {
		this.repository = new CustomerRepository();
	}

	async SignIn({ phone, password }) {
		try {
			const existingCustomer = await this.repository.FindCustomer({
				phone,
			});

			if (existingCustomer) {
				const validPassword = await ValidatePassword(
					password,
					existingCustomer.password,
					existingCustomer.salt
				);

				if (validPassword) {
					const token = await GenerateSignature({
						email: existingCustomer.email,
						_id: existingCustomer._id,
					});
					return FormateData({
						_id: existingCustomer._id,
						token,
						name: existingCustomer.name,
						phone: existingCustomer.phone,
						email: existingCustomer.email,
						slot: existingCustomer.slot,
						startDate: existingCustomer.startDate,
						endDate: existingCustomer.endDate,
					});
				} else {
					throw new BadRequestError("Wrong Password");
				}
			}
			return FormateData(null);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async SignUp({ email, phone, password, name, age }) {
		try {
			let salt = await GenerateSalt();

			let userPassword = await GeneratePassword(password, salt);

			const customer = await this.repository.CreateCustomer({
				email,
				password: userPassword,
				phone,
				salt,
				name,
				age,
			});

			const token = await GenerateSignature({
				email: email,
				_id: customer._id,
			});

			return FormateData({
				_id: customer._id,
				token,
				name: customer.name,
				phone: customer.phone,
				email: customer.email,
			});
		} catch (e) {
			throw new APIError(e);
		}
	}

	async AddNewAddress({ _id, street, postalCode, city, country }) {
		try {
			const addressResult = await this.repository.CreateAddress({
				_id,
				street,
				postalCode,
				city,
				country,
			});
			return FormateData(addressResult);
		} catch (e) {
			throw new APIError("Data Not found", e);
		}
	}

	async GetProfile({ _id }) {
		try {
			const existingCustomer = await this.repository.FindCustomerById({
				_id,
			});

			return FormateData(existingCustomer);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async UpdateProfile({
		_id,
		name,
		email,
		phone,
		password,
		age,
		slot,
		orders,
		startDate,
		endDate,
	}) {
		try {
			let newPassword = null;
			if (password) {
				let salt = await GenerateSalt();
				newPassword = await GeneratePassword(password, salt);
			}

			const newCustomer = await this.repository.UpdateCustomer({
				_id,
				email,
				password,
				phone,
				name,
				orders,
				startDate,
				endDate,
				age,
				slot,
			});

			return FormateData(newCustomer);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async AddOrderToProfile({ _id, order }) {
		try {
			const existingCustomer = await this.repository.FindCustomerById({
				_id,
			});

			const { startDate, endDate, slot, createdAt, razorpay_order_id } =
				order;

			const orders = existingCustomer.orders || [];
			orders.push({
				_id: razorpay_order_id,
				slot,
				date: createdAt,
				startDate,
				endDate,
			});
			const newCustomer = await this.repository.UpdateCustomer({
				_id,
				orders,
				startDate,
				endDate,
				slot,
			});

			return FormateData(newCustomer);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async SubscribeEvents(payload) {
		payload = JSON.parse(payload);
		try {
			const { event, payment, customerId } = payload.data;

			switch (event) {
				case "ADD_ORDER":
					await this.AddOrderToProfile({
						_id: customerId,
						order: payment,
					});
					break;
				default:
					break;
			}
		} catch (e) {
			throw new AsyncAPIError(e);
		}
	}
}

module.exports = CustomerService;
