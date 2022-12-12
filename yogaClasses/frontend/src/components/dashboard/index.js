import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import styles from "./styles.module.css";
import Left from "./left";
import Right from "./right";
import Header from '../navbar'
const Dashboard = () => {
  const navigate = useNavigate();
  const localData = localStorage.getItem("visualUserInfo");
  const userInfo = localData ? JSON.parse(localData) : null;
  const userName = userInfo?.name;
  const userEmail = userInfo?.email;
  const isPremiumUser = userInfo?.slots !== null ? true : false;
  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container-1">
      <Header />
      <div className="container-2 mt-3">
        <Left />
        <Right userName={userName} userEmail={userEmail} isPremiumUser={isPremiumUser} />
      </div>

    </div>
  );
};

export default Dashboard;
