/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import { Checkbox, Form, Modal, Button, Select, Row, Col, Input } from 'antd';
import '../css/ModalForm.css';
import dataLibrary from '../dataLibrary';
import userLibrary from '../userLibrary';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;

class ModalForm extends Component {
    state = { typeModal: this.props.type, openModal: true,
        title: '', category: '', checked:false, duration: '', description: '', submitLoading: false};
    optionsType = [
        { key: 'request', text: 'Request', value: 'request' },
        { key: 'share', text: 'Share', value: 'share' }
    ]
    optionsDuration = [
        { key: '15', text: '15 minutes', value: 15 },
        { key: '30', text: '30 minutes', value: 30 },
        { key: '45', text: '45 minutes', value: 45 },
        { key: 'not-applicable', text: 'Not Applicable', value: 'Not Applicable' }
    ]
    optionsCategory = [
        { key: 'Unclassified', text: 'Unclassified', value: 'Unclassified' }
    ]


    toggle = () => this.setState({ checked: !this.state.checked })
    componentWillMount(){
        this.closeModal = this.closeModal.bind(this);
        this.toggle = this.toggle.bind(this);
        this.submitModal = this.submitModal.bind(this);
        this.init = this.init.bind(this);

        
        this.setState({openModal: true, typeModal: this.props.type});
        if(this.props.item){
            this.init(this.props.item);
        }else{
            if(window.location.href.indexOf("category") > -1){
                let cat = window.location.href.split('/');
                cat = cat[cat.length - 1];
                cat = decodeURI(cat);

                let found = false;
                if(cat === "Unclassified"){
                    found = true;
                }else{
                    dataLibrary.Categories.forEach( category => {
                        if(Array.isArray(category)){
                            category[1].forEach( subCategory => {
                                if(subCategory === cat){
                                    found = true;
                                }
                            });
                        }else{
                            if(category === cat){
                                found = true;
                            }
                        }
                    });
                }
                if(found){
                    this.setState({category: cat});
                }
            }
        }
        userLibrary.getCurrentUser().then((result) =>{
            this.user = result;
        });

        dataLibrary.Categories.forEach(category => {
            if(Array.isArray(category)){
                category[1].forEach( subCategory => {
                    this.optionsCategory.push({key: subCategory, text: subCategory, value: subCategory});
                });
            }
            else{
                this.optionsCategory.push({key: category, text: category, value: category});
            }
        });

    }
    init(item){
            this.editItem = item
            this.setState({
                title : item.Title, 
                category : item.Category, 
                duration : item.Duration.toString(),
                description : item.Description
            });
    }

    componentWillReceiveProps(newProps){
        // this.setState({openModal: true, typeModal: newProps.type});
        // if(newProps.item){
        //     this.init(newProps.item);
        // }else{  
        //     this.setState({title: '', category: '', duration: '', description: ''});
        // }
    }
    
    closeModal(type){
        var self = this;
        this.setState( {openModal: false});
        setTimeout(function(){ self.props.modalFormHide(); }, 200);
        
        
    }
    submitModal(e){
        e.preventDefault();
        var self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({submitLoading: true});
                const { title, category, duration, description } = values;
                
                let notifTitle, notifMessage;
                if(this.editItem){
                    this.editItem.Title = title;
                    this.editItem.Duration = duration;
                    this.editItem.Category = category;
                    this.editItem.Description = description;
                    dataLibrary.update(this.editItem, this.user).then((result)=>{
                        notifTitle = "Success";
                        notifMessage = "Your post has been updated with success";
                        self.props.refresh(result);
                        self.closeModal();
                        self.props.modalFormMessage('success', notifTitle, notifMessage);  
                        
                    });
                    return;
                }else{
                    const item = {
                        Category: category, 
                        Type: this.state.typeModal, 
                        Title: title, 
                        Description: description, 
                        Duration: duration, 
                        Date: new Date(), 
                        User: this.user.ID,
                        Ratings:0
                    }
                    dataLibrary.add(item, this.user).then((result)=>{
                        notifTitle = "Success";
                        notifMessage = "Your post has been added with success";
                        self.closeModal();
                        self.props.modalFormMessage('success', notifTitle, notifMessage);  
                        if(this.state.checked){
                            dataLibrary.notify(result);
                        }                
                    });
                }
            }
        });
          
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { title, description, duration, category } = this.state;
        let tit = 
            this.editItem ? (
                <span>Edit</span>
            ) : this.state.typeModal === "request" ? (
                <span>I need your help</span>
            ) : this.state.typeModal === "share" ? (
                <span>I can help you</span>
            ) : null
        return (
            <div>
                
                <Modal
                title={tit}
                width={900}
                wrapClassName="vertical-center-modal"
                visible={this.state.openModal}
                onCancel={this.closeModal} 
                maskClosable={false}
                className="modalForm"
                
                footer={[
                    <Button icon="rollback" key="cancel" onClick={this.closeModal}>
                        Cancel
                    </Button>,
                    <Button loading={this.state.submitLoading} icon="check" key="submit" type="primary" onClick={this.submitModal}>
                        Submit
                    </Button>
                ]}
                >
                    <Form>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem>
                                    <span className="label"><span className="red">*</span> Title</span>
                                    {getFieldDecorator('title', {
                                        rules: [{ required: true, message: 'You have to input a title' }],
                                        initialValue:title
                                    })(
                                        <Input placeholder='A good eye-catcher title ' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    <span className="label">Type</span>
                                    {getFieldDecorator('type', {
                                        initialValue:this.state.typeModal
                                    })(
                                        <Select disabled placeholder='Share or need help?' />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem>
                                    <span className="label"><span className="red">*</span> Duration</span>
                                    {getFieldDecorator('duration', {
                                        rules: [{ required: true, message: 'You have to select a duration' }],
                                        initialValue:duration
                                    })(
                                        <Select placeholder="The approximative duration of the session">
                                            {this.optionsDuration.map( (item, i) => <Option key={item.key} value={item.value}>{item.text}</Option>)}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    <span className="label"><span className="red">*</span> Category</span>
                                    {getFieldDecorator('category', {
                                        rules: [{ required: true, message: 'You have to select a category' }],
                                        initialValue:category
                                    })(
                                        <Select placeholder="Help people to find your post">
                                            {this.optionsCategory.map( (item, i) => <Option key={item.key} value={item.value}>{item.text}</Option> )}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        
                        <Row gutter={24}>
                            <FormItem>
                                <span className="label"><span className="red">*</span> Description</span>
                                {getFieldDecorator('description', {
                                    rules: [{ required: true, message: 'You have to input a description' }],
                                    initialValue:description
                                })(
                                    <TextArea placeholder='A rich description' />
                                )}
                            </FormItem>
                        </Row>

                    </Form>
                    <div className="homeFormRequired">*These fields are required.</div>

                    {
                        !this.editItem ? (
                            <Checkbox className="modalCheck" checked={this.state.checked} onChange={this.toggle}>Notify the community by email</Checkbox>
                        ) : null
                    }
                </Modal>
               
                
            </div>
        );
    }
}
export default Form.create()(ModalForm)