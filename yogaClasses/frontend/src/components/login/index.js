import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Message from "../Message";
import Loader from "../loader";
// import registerImg from "../../assets/img/register.png"
import axios from "axios";
import { url } from "../../utilities";
function Login() {
	const [mobileNumber, setMobileNumber] = useState("");
	const [password, setPassword] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	// const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const localData = localStorage.getItem("visualUserInfo");
	const userInfo = localData ? JSON.parse(localData) : null;
	useEffect(() => {
		if (userInfo) {
			navigate("/dashboard");
		}
		// eslint-disable-next-line
	}, [userInfo]);

	if (error) {
		setTimeout(() => {
			setError(null);
		}, 3000);
	}

	const submitLogin = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post(`${url}/customer/login`, {
				phone: mobileNumber,
				password,
			});

			setLoading(false);
			if (data) {
				localStorage.setItem(
					"visualUserInfo",
					JSON.stringify(data.data)
				);
				setSuccess(true);
				// setUser(data.data);
				navigate("/dashboard");
			} else {
				setError("Network error");
			}
		} catch (e) {
			setLoading(false);
			setError("Some Error Occurred");
		}
	};

	return (
		<div className="container d-flex my-5 justify-content-center align-items-center auth-page">
			<div className="left-section">
				<h2 className="logoHeading">Visual</h2>
				<img
					src="https://miro.medium.com/max/1400/0*r7ymuCxhlg-foJBy.jpg"
					className="register-img"
					alt="display_img"
				/>
			</div>

			<div className="form-container p-4" id="formBox">
				<div style={{ width: "100%" }}>
					{error && <Message variant={"danger"}>{error}</Message>}
					{success && (
						<Message variant={"success"}>
							Loggedin Successfully
						</Message>
					)}
					<p className="box-heading text-center">LOGIN</p>
					<p className="box-sub-heading text-center">
						Monitor all your apis at one place
					</p>
					<Form onSubmit={submitLogin}>
						<Form.Group controlId="formBasicName">
							<Form.Label>Mobile Number</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter Mobile Number"
								required
								value={mobileNumber}
								onChange={(e) => {
									setMobileNumber(e.target.value);
								}}
							/>
						</Form.Group>
						<Form.Group
							className="mt-3"
							controlId="formBasicPassword"
						>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								required
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
						</Form.Group>
						{loading ? (
							<Loader />
						) : (
							<Button
								type="submit"
								className={styles.btn}
								disabled={loading}
							>
								Login
							</Button>
						)}
					</Form>
					<div className="mt-3">
						<p>
							Create an account ? <Link to="/">Register</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
