/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { Row, Col } from 'antd';

import '../css/Line.css';
import FaStar from 'react-icons/lib/fa/star';
import FaStarO from 'react-icons/lib/fa/star-o';
import FaStarHalfEmpty from 'react-icons/lib/fa/star-half-empty';

export default class Line extends Component {
    item;
    state = { hover:false };

    componentWillMount(){
        this.item = this.props.data;
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
    }
    componentWillReceiveProps(newProps){
        this.item = newProps.data;
    }

    mouseEnter(){
        this.setState({hover: true});
    }
    mouseLeave(){
        this.setState({hover: false});
    }
    render() {
        if(this.item.Closed){
            this.color = "lineGray";
            this.message = "This item is closed";
        }else{
            if(this.item.Type === "request"){
                this.color = "lineRed";
                if(this.item.User.Lastname){
                    this.message = this.item.User.Lastname + " needs your help";
                }else{
                    this.message = "... needs your help";
                }
                
            }else if(this.item.Type === "share"){
                this.color = "lineGreen";
                if(this.item.User.Lastname){
                    this.message = this.item.User.Lastname + " can help you";
                }else{
                    this.message = "... can help you";
                }
            }
        }
        

        let starsNb = Math.trunc(this.item.Ratings);
        let halfStarsNb = (this.item.Ratings % 1 === 0) ? 0: 1;
        let emptyStarsNb = 5 - (starsNb + halfStarsNb);
        let stars = [], halfStars = [], emptyStars = [];
        for(var i = 0; i < starsNb; i++){
            stars.push(
                <FaStar color='#004D9A' />
            )
        };
        for(var y = 0; y < halfStarsNb; y++){
            halfStars.push(
                <FaStarHalfEmpty key={y} color='#004D9A' />
            )
        };
        for(var z = 0; z < emptyStarsNb; z++){
            emptyStars.push(
                <FaStarO key={z} color='#004D9A' />
            )
        };

        let title = this.item.Title;
        let n = 85;
        if(title.length > n){
            title = title.substr(0, n-1) + '...';
        }
        if(this.item.Closed){
            title = "[Closed] " + title;
        }
        return (
            <Link
                to={'/index.aspx/item/' + this.item.ID}
            >
                <div className={this.color + " line"} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                    <Row justify="space-around" align="middle">
                        {this.state.hover ? (
                            <Col span={6}>
                                <div className="lineMessage">
                                    {this.message}
                                </div>
                            </Col>
                        ) : null}
                        
                        <Col span={16}>
                            <div className="lineTitle">
                                <span title={this.item.Title}>{title}</span>
                            </div>
                            <div className="lineInfos">
                                {new Date(this.item.Date).toLocaleString()} 
                                
                                {this.item.Duration && Number.isInteger(parseInt(this.item.Duration, 10)) ?(
                                    <span> - {this.item.Duration} minutes</span>
                                ) : null}
                                {this.item.Duration && !Number.isInteger(parseInt(this.item.Duration, 10)) ?(
                                    <span> {this.item.Duration}</span>
                                ) : null}
                            </div>
                            
                        </Col>
                        {this.state.hover ? ( null
                        ) : 
                            <Col span={2} offset={6}>
                                <div className="lineRatings">       
                                    {stars}
                                    {halfStars}
                                    {emptyStars}
                                </div>
                            </Col>
                        }
                    </Row>
                </div>
            </Link>
        );
    }
}

