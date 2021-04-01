import React, { Component } from 'react';
import './footer.css';

function Footer() {
    return (
        <div className="pos">
            <div collapseOnSelect expand="lg" className="bg-dark" variant="dark">
                <div className="d-flex justify-content-center p-0">
                    <p className="text-center text-white p-0 pt-3" >© 2021-2022 | Employee Management System.</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
