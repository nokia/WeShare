/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Config} from './../config.js';
// import {Modal, Form, Button, TextArea } from 'semantic-ui-react';

import { Form, Modal, Row, Input } from 'antd';
import '../css/ModalFormContact.css';
import dataLibrary from '../dataLibrary';
import userLibrary from '../userLibrary';
const { TextArea } = Input;
const FormItem = Form.Item;


class ModalForm extends Component {
    state = { formError: [], openModal: true, title: '', message: ''};
    
    componentWillMount(){
        this.closeModal = this.closeModal.bind(this);
        this.submitModal = this.submitModal.bind(this);
        this.item = this.props.item;
        if(Config.local){
            this.user = userLibrary.localCurrentUser();
            return;
        }else{
            for(var i = 0; i < userLibrary.users.length; i++) {
                if(userLibrary.users[i].ID === this.item.User.ID){
                    this.user = userLibrary.users[i];
                }
            }
        }
    }
   
    componentWillReceiveProps(newProps){
        this.setState({openModal: true});
        this.item = newProps.item;
        this.setState({formError: [], title: '', message: '' });
        
    }
    
    closeModal(type){
        var self = this;
        this.setState( {openModal: false});
        setTimeout(function(){ self.props.modalFormHide(); }, 200);
    }
   
    submitModal(e){
        
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { title, message } = values;
                let notifTitle, notifMessage;

                if(this.item.Ratings < 5){
                    this.item.Ratings = this.item.Ratings + 0.5;
                    dataLibrary.update(this.item);
                    this.forceUpdate();
                }
                userLibrary.contact(this.user.Email, title, message).then((result) => {
                    if(result === "sent"){
                        notifTitle = "Success";
                        notifMessage = "Your message has been sent with success";
                        this.props.modalFormMessage('success', notifTitle, notifMessage);    
                    }else if(result === "local"){
                        notifTitle = "Error";
                        notifMessage = "Unable to send email in local version";
                        this.props.modalFormMessage('error', notifTitle, notifMessage); 
                    }else{
                        notifTitle = "Error";
                        notifMessage = "An error occured";
                        this.props.modalFormMessage('error', notifTitle, notifMessage); 
                    }
                });
                this.closeModal();   
            }
        });


         
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        // const { title, message } = this.state;
        let tit = "Send a mail to " + this.user.Email;
        return (
            <div>
                 <Modal
                title={tit}
                width={900}
                wrapClassName="vertical-center-modal"
                visible={this.state.openModal}
                onOk={this.submitModal}
                onCancel={this.closeModal} 
                okText="Send message"
                maskClosable={false}
                className="modalForm"
                >
                    <Form>
                        <Row gutter={24}>
                            <FormItem>
                                <span className="label"><span className="red">*</span> Title</span>
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: 'You have to input a title' }],
                                })(
                                    <Input placeholder='The object of your message' />
                                )}
                            </FormItem> 
                        </Row>
                        <Row gutter={24}>  
                            <FormItem>
                                <span className="label"><span className="red">*</span> Message</span>
                                {getFieldDecorator('message', {
                                    rules: [{ required: true, message: 'You have to input a message' }],
                                })(
                                    <TextArea placeholder='Your message' />
                                )}
                            </FormItem>
                        </Row>
                            

                        </Form>
                    <div className="homeFormRequired">*These fields are required.</div>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(ModalForm)