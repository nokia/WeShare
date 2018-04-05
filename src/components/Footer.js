/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';

import nokia_logo from '../img/nokia_logo.png';
import { Tooltip } from 'antd';
import '../css/Footer.css';
import userLibrary from '../userLibrary';

export default class Footer extends Component {
    state = {statistics: '...'}
    componentWillMount(){
        this.statistics = userLibrary.get().then((us) => {
            this.setState({statistics: 'Number of users: ' + us.length})
        });
    }
    render() {
        let statistics = this.state.statistics;
        return (
            <div className="footer">
                <div className="divider bgBlue"></div>
                <div className="center">
                    <img src={nokia_logo} alt="Nokia logo" className="nokiaLogo" />
                    <Tooltip
                        placement="top"
                        title={statistics}
                    >
                        <span className="statistics">- Statistics</span>
                    </Tooltip>
                </div>
            </div>
        );
    }
}