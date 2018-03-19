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
        title: '', category: '', checked:false, duration: '', description: ''};
    optionsType = [
        { key: 'request', text: 'Request', value: 'request' },
        { key: 'share', text: 'Share', value: 'share' }
    ]
    optionsDuration = [
        { key: '15', text: '15 minutes', value: '15' },
        { key: '30', text: '30 minutes', value: '30' },
        { key: '45', text: '45 minutes', value: '45' }
    ]
    optionsCategory = [
        { key: 'Unclassified', text: 'Unclassified', value: 'Unclassified' }
    ]


    toggle = () => this.setState({ checked: !this.state.checked })
    componentWillMount(){
        if(this.props.item){
            this.init(this.props.item);
        }
        this.closeModal = this.closeModal.bind(this);
        this.toggle = this.toggle.bind(this);
        this.submitModal = this.submitModal.bind(this);
        this.init = this.init.bind(this);
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
        this.editItem = item;
        this.setState({
            title : item.Title, 
            category : item.Category, 
            duration : item.Duration.toString(),
            description : item.Description
        });
    }

    componentWillReceiveProps(newProps){
        this.setState({openModal: true, typeModal: newProps.type});
        if(newProps.item){
            this.init(newProps.item);
        }else{  
            this.setState({title: '', category: '', duration: '', description: ''});
        }
    }
    
    closeModal(type){
        var self = this;
        this.setState( {openModal: false});
        setTimeout(function(){ self.props.modalFormHide(); }, 200);
        
        
    }
    getValue = (e) => {
        const select = e.target;
        return select.options[select.selectedIndex].value;
    }
    durationChange = (e) => this.setState({ duration: this.getValue(e) });    
    categoryChange = (e) => this.setState({ category: this.getValue(e) });
   
    submitModal(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { title, category, duration, description } = values;
                console.log(title, category, duration, description);
                
                let notifTitle, notifMessage;
                if(this.editItem){
                    this.editItem.Title = title;
                    this.editItem.Duration = duration;
                    this.editItem.Category = category;
                    this.editItem.Description = description;
                    dataLibrary.update(this.editItem).then((result)=>{
                        
                    });
                    notifTitle = "Success";
                    notifMessage = "Your post has been updated with success";
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
                    notifTitle = "Success";
                    notifMessage = "Your post has been added with success";
                    // console.log('add',item);
                    dataLibrary.add(item).then((result)=>{
                        this.props.refresh();
                        if(this.state.checked){
                            dataLibrary.notify(result);
                        }                
                    });
                }
                this.closeModal();
                this.props.modalFormMessage('success', notifTitle, notifMessage);      
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
                <span>I need some help</span>
            ) : this.state.typeModal === "share" ? (
                <span>I have knowledge to share</span>
            ) : null
        return (
            <div>
                
                <Modal
                title={tit}
                width={900}
                wrapClassName="vertical-center-modal"
                visible={this.state.openModal}
                onOk={this.submitModal}
                onCancel={this.closeModal} 
                okText="Submit"
                maskClosable={false}
                >
                    <Form className="modalForm">
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