/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';

import nokia_logo from '../img/nokia_logo.png';
import '../css/Footer.css';

export default class Footer extends Component {

    render() {
        return (
            <div className="footer">
                <div className="divider bgBlue"></div>
                <div className="center">
                    <img src={nokia_logo} alt="Nokia logo" className="nokiaLogo" />
                </div>
            </div>
        );
    }
}