import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Header from "../../navbar";
import styles from "./styles.module.css";
import Left from "../left";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { url } from "../../../utilities";
const Profile = React.memo(() => {
	const navigate = useNavigate();
	const localData = localStorage.getItem("visualUserInfo");
	const userInfo = localData ? JSON.parse(localData) : null;
	const userName = userInfo?.name;
	const userEmail = userInfo?.email;
	const [orderData, setOrderData] = useState(null);
	const fetchProfileDetails = async () => {
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
			};
			const { data } = await axios.get(`${url}/customer/profile`, config);
			if (data.success) {
				setOrderData(data.data.orders);
			}
		} catch (e) {}
	};
	useEffect(() => {
		if (!userInfo) {
			navigate("/");
		}
		fetchProfileDetails();
		// eslint-disable-next-line
	}, []);

	return (
		<div className="container-1">
			<Header />
			<div className="container-2 mt-3">
				<Left />
				<div className="rightContainer p-3">
					<div className={styles.mainSection}>
						<h2>MY PROFILE</h2>
						<h3>Name: {userName}</h3>
						<h3>Email: {userEmail}</h3>
					</div>
					{console.log("order", orderData)}
					{orderData &&
						orderData.map((item, i) => (
							<Card
								key={item._id}
								className={`${styles.plansCard} my-2`}
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
											Slot :{" "}
											<span className="text-dark">
												{item.slot}
											</span>
										</p>
										<p>
											Start Date :{" "}
											<span className="text-dark">
												{moment(item.startDate).format(
													"DD-MM-YY"
												)}
											</span>
										</p>
										<p>
											End Date :{" "}
											<span className="text-dark">
												{moment(item.endDate).format(
													"DD-MM-YY"
												)}
											</span>
										</p>
										<p>
											Price :{" "}
											<span className="text-dark">
												$500 months
											</span>
										</p>
									</Card.Text>
								</Card.Body>
							</Card>
						))}
				</div>
			</div>
		</div>
	);
});

export default Profile;
