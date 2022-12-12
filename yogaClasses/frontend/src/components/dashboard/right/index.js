import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import Plans from '../plans'
import Badge from 'react-bootstrap/Badge';

const Right = React.memo(({
    userName,
    isPremiumUser
    // userEmail,
}) => {
    return (
        <div className="rightContainer">
            <div className={styles.greetSection}>
                <p>Welcome <span className='user-name'>{userName}</span></p>
            </div>
            <Plans />
        </div>
    );
});

Right.propTypes = {
    userName: PropTypes.string,
    userEmail: PropTypes.string,
    isPremiumUser: PropTypes.bool,
}

Right.defaultProps = {
    userName: 'User',
    userEmail: 'abc@123',
    isPremiumUser: false,
}
export default Right;