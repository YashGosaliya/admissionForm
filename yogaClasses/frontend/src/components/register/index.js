import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Message from "../Message";
import Loader from "../loader";
// import registerImg from "../../assets/img/register.png";
import axios from "axios";
import { url } from "../../utilities";
function Register() {
	const navigate = useNavigate();
	const localData = localStorage.getItem("visualUserInfo");
	const userInfo = localData ? JSON.parse(localData) : null;

	const [mobileNumber, setMobileNumber] = useState("");
	const [age, setAge] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Submit Register
	const submitRegister = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post(`${url}/customer/signup`, {
				name,
				email,
				password,
				phone: mobileNumber,
				age: age,
			});

			setLoading(false);
			if (data) {
				localStorage.setItem(
					"visualUserInfo",
					JSON.stringify(data.data)
				);
				setSuccess(true);
				navigate("/dashboard");
			} else {
				setError("Network error");
			}
		} catch (e) {
			setLoading(false);
			setError(e.response.data.error);
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate("/dashboard");
		}
		// eslint-disable-next-line
	}, [userInfo]);

	return (
		<div style={{ width: "100%" }}>
			<p className="box-heading text-center">
				Get Started with <span className="logo-text">VISUAL</span>
			</p>
			<p className="box-sub-heading text-center">
				Monitor all your apis at one place
			</p>
			{success && (
				<Message className="mb-1" variant={"success"}>
					Successfully created
				</Message>
			)}
			{error && (
				<Message className="mb-1" variant={"danger"}>
					{error}
				</Message>
			)}
			<Form className="px-2" onSubmit={submitRegister}>
				<Form.Group controlId="formBasicOTP" className="mb-2">
					<Form.Label>Mobile Number</Form.Label>
					<Form.Control
						className="input-field"
						type="text"
						placeholder="Enter Mobile Number"
						value={mobileNumber}
						required
						onChange={(e) => {
							setMobileNumber(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group controlId="formBasicEmail" className="mb-2">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						className="input-field"
						type="email"
						placeholder="Enter email"
						required
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group controlId="formBasicName" className="mb-2">
					<Form.Label>Full Name</Form.Label>
					<Form.Control
						className="input-field"
						type="text"
						placeholder="Enter Full Name"
						required
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group controlId="formBasicAge" className="mb-2">
					<Form.Label>Age</Form.Label>
					<Form.Control
						className="input-field"
						type="text"
						placeholder="Enter Your Age"
						value={age}
						required
						onChange={(e) => {
							setAge(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group controlId="formBasicPassword" className="mb-2">
					<Form.Label>Password</Form.Label>
					<Form.Control
						className="input-field"
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
						disabled={mobileNumber === ""}
						className="btn-1 mb-2"
					>
						Register
					</Button>
				)}
			</Form>
			<div className="mt-3">
				<p>
					Already have an account ? <Link to="/login">Login</Link>
				</p>
			</div>
		</div>
	);
}

export default Register;
