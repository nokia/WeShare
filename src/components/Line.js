/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Grid} from 'semantic-ui-react';

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
    componentWillReceiveProps(nextProps){
        this.item = nextProps.data;
    }

    mouseEnter(){
        this.setState({hover: true});
    }
    mouseLeave(){
        this.setState({hover: false});
    }
    render() {
        if(this.item.Type === "request"){
            this.color = "lineBlue";
            this.message = "I need your help";
        }else if(this.item.Type === "share"){
            this.color = "lineYellow";
            this.message = "I can help you";
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

        return (
            <Link
                to={'/index.aspx/item/' + this.item.ID}
            >
                <div className={this.color + " line"} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                    <Grid columns='equal' stackable container verticalAlign='middle'>
                        <Grid.Row>
                            {this.state.hover ? (
                                <Grid.Column width={3}>
                                <div className="lineMessage">
                                    {this.message}
                                </div>
                            </Grid.Column>
                            ) : null}
                           
                            <Grid.Column>
                                <div className="lineTitle">
                                    {this.item.Title}
                                </div>
                                <div className="lineInfos">
                                    {/* {this.item.Date.toLocaleDateString()} - {this.item.Duration} minutes */}
                                    {new Date(this.item.Date).toLocaleString()} 
                                    {this.item.Duration ? (<span> - {this.item.Duration} minutes</span>) : null}
                                </div>
                                
                            </Grid.Column>
                            <Grid.Column width={2}>
                                
                                <div className="lineRatings">       
                                    {stars}
                                    {halfStars}
                                    {emptyStars}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Link>

           
        );
    }
}

