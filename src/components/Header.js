/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Config} from './../config.js';

import { Tooltip, Popover, Input, Icon, Button } from 'antd';
import userLibrary from '../userLibrary';
// import MdClear from 'react-icons/lib/md/clear';

import logo from '../img/WeShare-neg-logo-200.png';
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

    handleChange(e){
        let value = e.target.value;
        if(value.length > 12){
            return;
        }
        this.setState({number: value})
        this.user.Number = value;
        userLibrary.update(this.user);
    }

    handleOpen = () => {
        this.setState({ isOpen: true })
    }

   
    handleClose = () => {
        this.setState({ isOpen: false })
    }
    emitEmpty = () => {
        this.phoneInput.focus();
        this.setState({ number: '' });
    }

    render() {
        let profil;
        let siteName = Config.Name;
        const {number} = this.state;
        if(this.state.userLoaded){
            profil = this.user.Lastname + " " + this.user.Name;
            if(this.user.Location){
                profil += " at " + this.user.Location;
            }
            if(number){
                profil += " | " + number;
            }
        }
        const suffix = number ? <Icon type="close-circle" style={{ color: 'rgba(0,0,0,.25)' }} onClick={this.emitEmpty} /> : null;
        return (
            <div className="header">
                <div className="wrapper">
                    <Link to={`/index.aspx`} replace>
                        <div className="siteName">
                            <img src={logo} alt="Logo" className="logo" />
                            {siteName}
                        </div>
                        <div className="pitch">
                            Meet colleagues to share knowledge
                        </div>
                    </Link>
                    {!this.state.isOpen ? (
                        <div className="profilHover">
                            <Tooltip
                                placement="top"
                                title="Click to edit your phone number"
                            >
                                <div onClick={this.handleOpen}>{profil}</div>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="profilClick">
                            <Popover 
                                content={<div>
                                    <Icon className="popupPhoneClear" type="close-circle" style={{ color: 'rgba(0,0,0,.25)' }} onClick={this.handleClose} />
                                    <div className="popupPhoneTitle">Add your phone number to be contacted<br /> quickly when publishing a topic:</div>
                                    
                                    <Input
                                        placeholder="+33677889911"
                                        prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        suffix={suffix}
                                        value={number}
                                        onChange={this.handleChange}
                                        ref={node => this.phoneInput = node}
                                    />
                                    <Button type="primary" className="popupPhoneButton" onClick={this.handleClose}>
                                        Save
                                    </Button>
                                </div>}
                                visible={true}
                                placement="bottom"
                            >
                                <div>{profil}</div>
                            </Popover>
                            {/* <Popup
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
                            /> */}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}