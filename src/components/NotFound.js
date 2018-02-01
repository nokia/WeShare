/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';

import Header from './Header';

export default class NotFound extends Component {
  

    render() {
        return (
            <div className="notFound">
                <Header />
                <div className="wrapper">
                    Not Found
                </div>
            </div>
        );
    }
}
