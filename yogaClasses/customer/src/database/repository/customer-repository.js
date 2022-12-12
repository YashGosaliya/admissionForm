const { CustomerModel, AddressModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/error/app-errors");

class CustomerRepository {
	async CreateCustomer({
		email,
		password,
		phone,
		salt,
		name,
		orders,
		startDate,
		endDate,
		age,
		slot,
	}) {
		try {
			const customer = new CustomerModel({
				email,
				password,
				name,
				orders: [],
				startDate,
				endDate,
				age,
				salt,
				slot,
				phone,
				address: [],
			});
			const customerResult = await customer.save();
			return customerResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on creating customer ${e}`
			);
		}
	}

	async CreateAddress({ _id, street, postalCode, city, country }) {
		try {
			const profile = await CustomerModel.findById(_id);

			if (profile) {
				const newAddress = new AddressModel({
					street,
					postalCode,
					city,
					country,
				});

				await newAddress.save();

				profile.address.push(newAddress);
			}

			return await profile.save();
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on creating address ${e}`
			);
		}
	}

	async FindCustomer(query) {
		try {
			const existingCustomer = await CustomerModel.findOne(query);
			return existingCustomer;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on finding customer ${e}`
			);
		}
	}

	async UpdateCustomer({
		_id,
		email,
		password,
		phone,
		salt,
		name,
		orders,
		startDate,
		endDate,
		slot,
		age,
	}) {
		try {
			const user = await CustomerModel.findById(_id);
			user.email = email || user.email;
			user.password = password || user.password;
			user.phone = phone || user.phone;
			user.salt = salt || user.salt;
			user.name = name || user.name;
			user.orders = orders || user.orders;
			user.startDate = startDate || user.startDate;
			user.endDate = endDate || user.endDate;
			user.age = age || user.age;
			user.slot = slot || user.slot;
			const data = await user.save();
			return data;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on updating customer ${e}`
			);
		}
	}

	async FindCustomerById({ _id }) {
		try {
			const existingCustomer = await CustomerModel.findById(_id).populate(
				{
					path: "address",
					select: ["-__v"],
				}
			);
			return existingCustomer;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on finding customer ${e}`
			);
		}
	}
}

module.exports = CustomerRepository;
