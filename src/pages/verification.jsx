import React from 'react';
import { Link } from 'react-router-dom';

const VerificationPage = () => {
    return ( 
        <>
            <section className="auth-wrapper confirm-wrapper">
                <div className="auth-box">
                    <img src="assets/images/confirm.png" alt="" />
                    <h2 className="title">Account Created Successfully</h2>
                    <Link to="/login">
                        <button>Sign In</button>
                    </Link>
                </div>
            </section>
        </>
     );
}
 
export default VerificationPage;