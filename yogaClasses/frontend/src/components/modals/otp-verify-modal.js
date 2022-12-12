import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import Message from "../Message";
import { Button, Modal, Form } from 'react-bootstrap'
import styles from './styles.module.css'
import Loader from "../loader";
import axios from "axios";
import { url } from "../../utilities";

const OTPModal = React.memo(({
    children,
    title,
    logoImg,
    description,
    mobileNumber,
    setMobileNumber
}) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [user, setUser] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const submitRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`${url}/customer/`, {
                name,
                email,
                password,
                phone: mobileNumber

            });

            setLoading(false);
            console.log('data')
            console.log(data.data);
            if (data) {
                localStorage.setItem("visualUserInfo", JSON.stringify(data.data));
                setSuccess(true);
                // setUser(data.data);
                navigate("/dashboard");
            } else {
                setError("Network error");
            }
        } catch (e) {
            setLoading(false);
            setError(e.response.data.error);
        }
    }

    return (
        <>
            {children({ handleShow })}
            {show ? (<Modal show={show} onHide={handleClose} className='p-5'>
                <Modal.Header closeButton style={{ border: 'none' }}>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.headingSection}>
                        <p className='h3 text-center primary'>{title}</p>
                        <p className='text-muted text-center'>{description}</p>
                    </div>
                    <p className="h4 text-center">REGISTER</p>
                    <p className="box-sub-heading text-center">Complete Your Details</p>
                    {success && <Message className="mb-1" variant={"success"}>Successfully created</Message>}
                    {error && <Message className="mb-1" variant={"danger"}>{error}</Message>}
                    <Form className='px-2' onSubmit={submitRegister}>
                        <Form.Group controlId="formBasicOTP" className='mb-2'>
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
                        <Form.Group controlId="formBasicEmail" className='mb-2'>
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
                        <Form.Group controlId="formBasicName" className='mb-2'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                className="input-field"
                                type="text"
                                placeholder="Enter Username"
                                required
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className='mb-2'>
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
                            <Button type="submit" disabled={mobileNumber === ''} className='btn-1 mb-2'>
                                Register
                            </Button>)}
                    </Form>
                </Modal.Body>

            </Modal>) : null}
        </>
    );
});

OTPModal.propTypes = {
    children: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    mobileNumber: PropTypes.string.isRequired,
    setMobileNumber: PropTypes.func.isRequired,
};

OTPModal.defaultProps = {
    title: 'Visual',
    description: 'Monitor all your apis at one place',
}

export default OTPModal;