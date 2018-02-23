/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Config} from './../config.js';
import {Modal, Form, Button, TextArea } from 'semantic-ui-react';

import '../css/ModalFormContact.css';
import dataLibrary from '../dataLibrary';
import userLibrary from '../userLibrary';


export default class ModalForm extends Component {
    state = { formError: [], openModal: true, title: '', message: ''};
    
    componentWillMount(){
        this.closeModal = this.closeModal.bind(this);
        this.submitModal = this.submitModal.bind(this);
        // this.user = userLibrary.get();
        this.item = this.props.item;
        console.log(userLibrary.users, this.item)
        for(var i = 0; i < userLibrary.users.length; i++) {
            if(userLibrary.users[i].ID === this.item.User){
                this.user = userLibrary.users[i];
            }
        }
    }

   
    componentWillReceiveProps(newProps){
        this.setState({openModal: true});
        this.item = newProps.item;
        this.setState({formError: [], title: '', message: '' });
        
    }
    
    closeModal(type){
        this.setState( {openModal: false});
        this.props.modalFormHide();
    }
    handleFormChange = (e, {name, value}) => {
        this.setState({ [name]: value });
    }
   
    submitModal(){
        let { title, message } = this.state;

        let tmp = [];
        if(title === ""){
            tmp.push('title');
        }if(message === ""){
            tmp.push('message');
        }
        this.setState({formError: tmp});
        if(tmp.length > 0){
            return;
        }

        let textMessage;

        if(this.item.Ratings < 5){
            this.item.Ratings = this.item.Ratings + 0.5;
            dataLibrary.update(this.item);
            this.forceUpdate();
        }
        // SH.contact(this.user.Email).then((result) => {
        //     console.log('sent')
        // });
        userLibrary.contact("felix.fuin@nokia.com", title, message).then((result) => {
            console.log('sent')
        });
        textMessage = "Your message has been sent with success";
        
        
        this.closeModal();
        this.props.modalFormMessage('green', textMessage);        
    }

    render() {
        // console.log(this.item);
        const { title, message } = this.state;
        console.log(this.user)
        return (
            <div>
                <Modal 
                open={this.state.openModal}
                onClose={this.closeModal} 
                closeIcon
                closeOnEscape={false}
                closeOnRootNodeClick={false}
                >
                    <Modal.Header>
                        Send a mail to {this.user.Email}
                    </Modal.Header>
                    <Modal.Content>
                        <Form size="small" key="small">
                            <Form.Input error={this.state.formError.includes('title') ? (true) : (false)} value={title} name='title' onChange={this.handleFormChange} id='form-input-control-title' required label='Title' placeholder='Object of your email' />
                            <Form.Input error={this.state.formError.includes('message') ? (true) : (false)} value={message} name="message" onChange={this.handleFormChange} id='form-textarea-control-message' required control={TextArea} label='Message' placeholder='Body of your email' />  
                        </Form>
                        <div className="homeFormRequired">*These fields are required.</div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive icon='checkmark' labelPosition='right' content="Send message" onClick={this.submitModal} />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
