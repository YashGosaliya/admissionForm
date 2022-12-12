import React from 'react';
// import PropTypes from 'prop-types';
import styles from './styles.module.css';
import { Link } from "react-router-dom";

const Left = React.memo(() => {
    return (
        <div className={`${styles.leftContainer} shadow`}>
            <Link to="/dashboard" className={styles.navItem}>Dashboard</Link>
            <Link to="/profile" className={styles.navItem}>Profile</Link>
        </div>
    );
})



export default Left;