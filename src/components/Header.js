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
 
    state = { isOpen: false, number: '', userLoaded: false }

    componentWillMount(){
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        userLibrary.getCurrentUser().then((result) => {
            this.user = result;
            if(this.user.Number){
                this.setState({ number: this.user.Number });
            }
            this.setState({ userLoaded: true });
        });
            
    }

    handleChange(e, {name, value}){
        if(value.length > 12){
            return;
        }
        this.setState({number: value})
    }

    handleOpen = () => {
        this.setState({ isOpen: true })
    }

   
    handleClose = () => {
        this.setState({ isOpen: false })
    }

    render() {
        let profil;
        let siteName = Config.Name;
        const {number} = this.state;
        if(this.state.userLoaded){
            profil = this.user.Lastname 
                + " " + this.user.Name 
                + " at " + this.user.Location;
            if(number){
                profil += " - " + number;
            }
        }
        
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
                                content='Click to edit your profile'
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
                                    <div className="popupPhoneTitle">Add your phone number to be contacted quickly when publishing a topic:</div>
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