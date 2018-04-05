/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Config} from './../config.js';

import { Tooltip, Popover, Input, Icon, Button, Switch } from 'antd';
import userLibrary from '../userLibrary';

import logo from '../img/WeShare-neg-logo-200.png';
import '../css/Header.css';

export default class Header extends Component {
 
    state = { isOpen: false, number: '', notification: false, userLoaded: false }

    componentWillMount(){
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        userLibrary.getCurrentUser().then((result) => {
            this.user = result;
            if(this.props.onUserLoaded){
                this.props.onUserLoaded(true);
            }
            if(this.user.Number){
                this.setState({ number: this.user.Number });
            }
            if(this.user.Notification){
                this.setState({notification: this.user.Notification});
            }
            
            this.setState({ userLoaded: true });
        });
            
    }

    handleSwitch(checked){
        this.setState({notification: checked})
        this.user.Notification = checked;
        userLibrary.update(this.user);
    }
    handleChange(e){
        let value = e.target.value;
        if(value.length > 14){
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
        const {number, notification} = this.state;
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
                    {/* <Link to={`/index.aspx`} replace> */}
                        <div className="siteName">
                            <img src={logo} alt="Logo" className="logo" />
                            {siteName}
                        </div>
                        <div className="pitch">
                            Match & Share
                        </div>
                    {/* </Link> */}
                    {!this.state.isOpen ? (
                        <div className="profilHover">
                            <Tooltip
                                placement="top"
                                title="Click to edit your profile"
                            >
                                <div onClick={this.handleOpen}>{profil}</div>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="profilClick">
                            <Popover 
                                content={<div>
                                    <div className="width90">
                                        <div className="popupPhoneTitle">Add your phone number to be contacted quickly when publishing a topic:</div>
                                    
                                        <Input
                                            placeholder="+33677889911"
                                            prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            suffix={suffix}
                                            value={number}
                                            onChange={this.handleChange}
                                            ref={node => this.phoneInput = node}
                                        />

                                        <br /><br/>
                                        <div className="popupPhoneTitle">Do you want to be contacted by email when a post is submitted ?</div>
                                        <Switch checked={notification} checkedChildren="Yes" unCheckedChildren="No" onChange={this.handleSwitch} />
                                        <br /><br/>
                                        <Button type="primary" className="popupPhoneButton" onClick={this.handleClose}>
                                            Save
                                        </Button>
                                    </div>
                                    <div className="width10 right">
                                        <Icon className="popupPhoneClear" type="close-circle" style={{ color: 'rgba(0,0,0,.25)' }} onClick={this.handleClose} />
                                    </div>
                                </div>}
                                visible={true}
                                placement="bottom"
                            >
                                <div>{profil}</div>
                            </Popover>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}