import React, { useEffect, useRef, useState } from "react";
// import PropTypes from 'prop-types';
import PlanData from "../../../data/batch.json";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { url } from "../../../utilities";
import moment from "moment";

const Plans = React.memo(() => {
	const navigate = useNavigate();
	const localData = localStorage.getItem("visualUserInfo");
	const userInfo = localData ? JSON.parse(localData) : null;

	const apiKey = useRef(null);
	const defaultValue = userInfo?.slot ? true : false;
	const [isPaidUser, setIsPaidUser] = useState(defaultValue);
	const setIsPaymentSuccess = useRef(false);
	const slotRef = useRef(null);
	const startDate = userInfo?.startDate;
	const endDate = userInfo?.endDate || null;

	// invalid end date case
	const isInvalidUser = useRef(false);
	const fetchProfileDetails = async () => {
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
			};
			const { data } = await axios.get(`${url}/customer/profile`, config);
			// console.log("profileData", data);
			if (data.success) {
				// console.log(data.data.orders)
				if (data.data.slot) setIsPaidUser(true);
			}
		} catch (e) {}
	};

	useEffect(() => {
		if (!userInfo) {
			navigate("/");
		}

		if (endDate && moment(endDate) < moment(Date.now())) {
			console.log("runs");
			isInvalidUser.current = true;
			setIsPaidUser(false);
		}
		if (defaultValue === false || isPaidUser === false) {
			fetchProfileDetails();
		}
	}, []);

	// Load API Keys for razorpay payments
	const loadKey = async () => {
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
			};
			const data = await axios.get(`${url}/payments/keys`, config);
			if (data) apiKey.current = data.data.apiKey;
		} catch (e) {
			console.log(e);
		}
	};

	// Load razorpay scripts
	function loadScript(src) {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = src;
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	}

	async function purchasePlanHandler(id, index) {
		await loadKey();
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const res = await loadScript(
			"https://checkout.razorpay.com/v1/checkout.js"
		);

		if (!res) {
			alert("Razorpay SDK failed to load. Are you online?");
			return;
		}

		const slot = `${PlanData[index].startTime}-${PlanData[index].endTime}`;
		const result = await axios.post(
			`${url}/payments/start`,
			{
				slot,
			},
			config
		);
		const { razorpay_order_id } = result.data.data.data;
		if (!result) {
			alert("Server error. Are you online?");
			return;
		}

		const options = {
			key: apiKey.current, // Enter the Key ID generated from the Dashboard
			currency: "INR",
			name: "Flex Money Payment",
			description: "Test Transaction",
			// image: { logo },
			order_id: razorpay_order_id,
			handler: async function (response) {
				const data = {
					orderCreationId: razorpay_order_id,
					razorpay_payment_id: response.razorpay_payment_id,
					razorpay_order_id: response.razorpay_order_id,
					razorpay_signature: response.razorpay_signature,
				};

				const result = await axios.post(
					`${url}/payments/complete`,
					data,
					config
				);
				if (result?.data.success) {
					setIsPaymentSuccess.current = true;
					slotRef.current = result.data.data.slot;
					isInvalidUser.current = false;
					setIsPaidUser(true);
				} else alert("OOPS! Your Payment is Declined,Pls Try Again");
			},
			prefill: {
				name: `${userInfo.name}`,
				email: `${userInfo.email}`,
				contact: `${userInfo.phone}`,
			},
			notes: {
				address: "Soumya Dey Corporate Office",
			},
			theme: {
				color: "#61dafb",
			},
		};

		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	}

	return (
		<div className="container-3 mt-3">
			{!isPaidUser && !isInvalidUser.current && (
				<p className={styles.plansHeading}>
					Get our Membership to start using our Product.
				</p>
			)}
			{isInvalidUser.current && !isPaidUser && (
				<p className={styles.plansHeading}>
					Your batch has expired, Purchase a new batch.
				</p>
			)}
			<div className={`${styles.plansCardSection} p-3`}>
				{!isPaidUser &&
					PlanData.length > 0 &&
					PlanData.map((item, index) => {
						return (
							<Card
								key={index}
								className={`${styles.plansCard}`}
								style={{ width: "18rem" }}
							>
								<Card.Img
									variant="top"
									src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc0x5QUUG8Cnwg-DGXWWkFmZfrIAIEOVGixg&usqp=CAU"
								/>
								<Card.Body>
									<Card.Title>{item.title}</Card.Title>
									<Card.Text>
										<p>
											Schedule :{" "}
											<span className="text-dark">
												{item.startTime}
											</span>{" "}
											-{" "}
											<span className="text-dark">
												{item.endTime}
											</span>
										</p>
										<p>
											Price :{" "}
											<span className="text-dark">
												$500 months
											</span>
										</p>
									</Card.Text>
									<Button
										className="btn-2"
										onClick={() =>
											purchasePlanHandler(item._id, index)
										}
									>
										Purchase Now
									</Button>
								</Card.Body>
							</Card>
						);
					})}
				{isPaidUser && !isInvalidUser.current && (
					<div className={styles.infoCard}>
						<h2>Congratulations your enrolled in our batch</h2>
						<br />
						<h4>
							Vist the Profile Section to get more Info about
							batch
						</h4>
					</div>
				)}
			</div>
		</div>
	);
});

Plans.propTypes = {};
Plans.defaultProps = {};

export default Plans;
