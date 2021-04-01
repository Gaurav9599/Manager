import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Employee from './components/employee'


class Portal extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Employee/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default Portal;
