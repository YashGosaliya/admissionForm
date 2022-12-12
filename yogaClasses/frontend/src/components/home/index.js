import React, { useEffect, useState } from "react";
// import styles from "./styles.module.css";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Message from "../Message";
import Loader from "../loader";
// import OTPModal from "../modals/otp-verify-modal";
// import registerImg from "../../assets/img/register.png";
import axios from "axios";
import { url } from "../../utilities";
import Register from "../register";
function Home() {
  const navigate = useNavigate();
  const localData = localStorage.getItem("visualUserInfo");
  const userInfo = localData ? JSON.parse(localData) : null;

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
    else{
      navigate("/")
    }
    // eslint-disable-next-line
  }, []);


  return (
    <div className="container my-5 d-flex justify-content-center align-items-center auth-page">
      <div className='left-section'>
        <h2 className="logoHeading">Visual</h2>
        <img
          src="https://miro.medium.com/max/1400/0*r7ymuCxhlg-foJBy.jpg"
          className='register-img'
          alt="display_img"
        />
      </div>
      <div
        className="form-container p-4"
        id="formBox"
        style={{marginTop:'100px'}}
      >
      <Register />
      </div>
    </div>
  );
}

export default Home;
