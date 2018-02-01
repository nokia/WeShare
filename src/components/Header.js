/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Config} from './../config.js';
import {Button, Popup, Input} from 'semantic-ui-react';

import userLibrary from '../userLibrary';
import MdClear from 'react-icons/lib/md/clear';
import '../css/Header.css';

export default class Header extends Component {
 
    state = { isOpen: false, number: '' }

    componentWillMount(){
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.user = userLibrary.get();
        if(this.user.number){
            this.setState({ umber: this.user.number });
        }
    }

    handleChange(e, {name, value}){
        this.setState({number: value})
    }

    handleOpen = () => {
        this.setState({ isOpen: true })
    }

   
    handleClose = () => {
        this.setState({ isOpen: false })
    }

    render() {
        const {number} = this.state;
        let siteName = Config.Name;
        let profil = this.user.lastname + " " + this.user.name + " - " + this.user.location;
        return (
            <div className="header">
                <div className="wrapper">
                    <Link to={`/index.aspx`} replace>
                        <div className="siteName">
                            {siteName}
                        </div>
                    </Link>
                    {!this.state.isOpen ? (
                        <div className="profilHover">
                            <Popup
                                trigger={<div onClick={this.handleOpen}>{profil}</div>}
                                content='Click to add your phone number (People will be able to call you if you create an item)'
                                on='hover'
                                inverted
                            />
                        </div>
                    ) : (
                        <div className="profilClick">
                            <Popup
                                trigger={<div>{profil}</div>}
                                content={<div>
                                    <MdClear className="popupPhoneClear" onClick={this.handleClose}/> 
                                    <div className="popupPhoneTitle">Add your phone number</div>
                                    <Input 
                                        size="small" 
                                        icon='phone' 
                                        iconPosition='left' 
                                        placeholder='No phone number yet..'
                                        onChange={this.handleChange}
                                        value={number}
                                    />
                                    <Button size='mini' className="popupPhoneButton" onClick={this.handleClose}>
                                        Save
                                    </Button>
                                </div>}
                                open={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}