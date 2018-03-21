/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import img from '../img/404.png';
import Header from './Header';
import '../css/NotFound.css';

export default class NotFound extends Component {

    render() {
        return (
            <div className="notFound">
                <Header />
                <div className="wrapper center">
                    <img className="notImg" src={img} alt="Page not found" />
                    <div className="not">Page not Found</div>
                    
                </div>
            </div>
        );
    }
}
