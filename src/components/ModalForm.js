/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Modal, Form, Button, TextArea, Checkbox } from 'semantic-ui-react';

import '../css/ModalForm.css';
import dataLibrary from '../dataLibrary';
import userLibrary from '../userLibrary';
import Categories from '../lib/categories.js';


export default class ModalForm extends Component {
    state = { formError: [], typeModal: this.props.type, openModal: true,
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

        Categories.forEach(category => {
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
            this.setState({formError: [], title: '', category: '', duration: '', description: ''});
        }
    }
    
    closeModal(type){
        this.setState( {openModal: false});
        this.props.modalFormHide();
    }
    handleFormChange = (e, {name, value}) => {
        // console.log('change', name, value);
        this.setState({ [name]: value });
        // e.preventDefault();
        // e.stopPropagation();
    }

    getValue = (e) => {
        const select = e.target;
        return select.options[select.selectedIndex].value;
    }
    durationChange = (e) => this.setState({ duration: this.getValue(e) });    
    categoryChange = (e) => this.setState({ category: this.getValue(e) });
   
    submitModal(){
        const { title, category, duration, description } = this.state;

        const tmp = [];
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
            dataLibrary.update(this.editItem).then((result)=>{
                
            });
            textMessage = "Your post has been updated with success";
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
            textMessage = "Your post has been added with success";
            // console.log('add',item);
            dataLibrary.add(item).then((result)=>{
                this.props.refresh();
                if(this.state.checked){
                    dataLibrary.notify(result);
                }                
            });
        }
        this.closeModal();
        this.props.modalFormMessage('green', textMessage);        
    }

    durationControl() {
        return (
            <select onChange={this.durationChange} id='form-select-control-duration' required value={this.state.duration}>
                <option value="" disabled >The approximative duration of the session</option>
                {this.optionsDuration.map( (item, i) => <option key={i} value={item.value}>{item.text}</option>)}
            </select>
        );
    }

    categoryControl() {
        return (
            <select onChange={this.categoryChange} id='form-select-control-category' required value={this.state.category}>
                <option value="" disabled>Help people to find your post</option>
                {this.optionsCategory.map( (item, i) => <option key={i} value={item.value}>{item.text}</option> )}
            </select>
        )
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
                closeOnEscape={true}
                closeOnRootNodeClick={false}
                style={{marginTop:0}}
                >
                    <Modal.Header>
                        {
                            this.editItem ? (
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
                                <Form.Field error={this.state.formError.includes('duration') ? (true) : (false)} name="duration" id='form-select-control-duration' required label='Duration' control={this.durationControl.bind(this)} />
                                {/* <Form.Select error={this.state.formError.includes('duration') ? (true) : (false)} value={duration} name="duration" onChange={this.handleFormChange} id='form-select-control-duration' required label='Duration' options={this.optionsDuration} placeholder='The approximative duration of the session' /> */}
                                <Form.Field error={this.state.formError.includes('category') ? (true) : (false)} name="category" id='form-select-control-category' required label='Category' control={this.categoryControl.bind(this)} />
                                {/* <Form.Select error={this.state.formError.includes('category') ? (true) : (false)} value={category} name="category" onChange={this.handleFormChange} id='form-select-control-category' required label='Category' options={this.optionsCategory} placeholder='Help people to find your post' /> */}
                            </Form.Group>

                            <Form.Input error={this.state.formError.includes('description') ? (true) : (false)} value={description} name="description" onChange={this.handleFormChange} id='form-textarea-control-description' required control={TextArea} label='Description' placeholder='A rich description' />  
                        </Form>
                        <div className="homeFormRequired">*These fields are required.</div>
                    </Modal.Content>
                    <Modal.Actions>
                        {
                            !this.editItem ? (
                                <Checkbox className="modalCheck" onChange={this.toggle} checked={this.state.checked} label='Notify the community by email' />  
                            ) : null
                        }
                        <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={this.submitModal} />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
