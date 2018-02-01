/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Config} from './../config.js';
import {Modal, Form, Button, TextArea } from 'semantic-ui-react';

import '../css/ModalForm.css';
import dataLibrary from '../dataLibrary';
import userLibrary from '../userLibrary';


export default class ModalForm extends Component {
    state = { formError: [], typeModal: this.props.type, openModal: true,
        title: '', category: '', duration: '', description: ''};
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

    componentWillMount(){
        if(this.props.item){
            this.init(this.props.item);
        }
        this.closeModal = this.closeModal.bind(this);
        this.submitModal = this.submitModal.bind(this);
        this.init = this.init.bind(this);
        this.user = userLibrary.get();

        Config.Categories.forEach(category => {
            if(Array.isArray(category)){
                // this.optionsCategory.push({key: category[0], text: category[0], value: category[0]});
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
            this.setState({formError: [], title: '', category: '', duration: '', description: ''});
        }
    }
    
    closeModal(type){
        this.setState( {openModal: false});
        this.props.modalFormHide();
    }
    handleFormChange = (e, {name, value}) => {
        this.setState({ [name]: value });
    }
   
    submitModal(){
        let { title, category, duration, description } = this.state;

        let tmp = [];
        if(title === ""){
            tmp.push('title');
        }if(category === ""){
            tmp.push('category');
        }if(duration === ""){
            tmp.push('duration');
        }if(description === ""){
            tmp.push('description');
        }
        this.setState({formError: tmp});
        if(tmp.length > 0){
            return;
        }

        let textMessage;
        if(this.editItem){
            this.editItem.Title = title;
            this.editItem.Duration = duration;
            this.editItem.Category = category;
            this.editItem.Description = description;
            dataLibrary.update(this.editItem);
            textMessage = "Your post has been updated with success";
        }else{
            let item = {
                ID: new Date().getTime() + Math.round(Math.random()*1000000), 
                Category: category, 
                Type: this.state.typeModal, 
                Title: title, 
                Description: description, 
                Duration: duration, 
                Date: new Date(), 
                User: this.user,
                Ratings:0
            }
            dataLibrary.add(item);
            textMessage = "Your post has been added with success";
        }
        
        this.closeModal();
        this.props.modalFormMessage('green', textMessage);        
    }

    render() {
        const { title, category, duration, description } = this.state;
        return (
            <div>
                <Modal 
                dimmer="inverted" 
                open={this.state.openModal}
                onClose={this.closeModal} 
                closeIcon
                closeOnEscape={false}
                closeOnRootNodeClick={false}
                >
                    <Modal.Header>
                        {
                            this.item ? (
                                <span>Edit</span>
                            ) : this.state.typeModal === "request" ? (
                                <span>I need some help</span>
                            ) : this.state.typeModal === "share" ? (
                                <span>I have knowledge to share</span>
                            ) : null
                        }
                    </Modal.Header>
                    <Modal.Content>
                        <Form size="small" key="small">
                            <Form.Group widths='equal'>
                                <Form.Input error={this.state.formError.includes('title') ? (true) : (false)} value={title} name='title' onChange={this.handleFormChange} id='form-input-control-title' required label='Title' placeholder='A good eye-catcher title ' />
                                <Form.Select id='form-textarea-control-type' value={this.state.typeModal} disabled required label='Type' options={this.optionsType} placeholder='Share or need help?' />
                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Select error={this.state.formError.includes('duration') ? (true) : (false)} value={duration} name="duration" onChange={this.handleFormChange} id='form-select-control-duration' required label='Duration' options={this.optionsDuration} placeholder='The approximative duration of the session' />
                                <Form.Select error={this.state.formError.includes('category') ? (true) : (false)} value={category} name="category" onChange={this.handleFormChange} id='form-select-control-category' required label='Category' options={this.optionsCategory} placeholder='Help people to find your post' />
                            </Form.Group>

                            <Form.Input error={this.state.formError.includes('description') ? (true) : (false)} value={description} name="description" onChange={this.handleFormChange} id='form-textarea-control-description' required control={TextArea} label='Description' placeholder='A rich description' />  
                        </Form>
                        <div className="homeFormRequired">*These fields are required.</div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={this.submitModal} />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
