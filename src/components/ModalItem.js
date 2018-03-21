/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import { Checkbox, Form,  Popconfirm, Modal, Button, Select, Row, Col, Input } from 'antd';

import {Redirect} from 'react-router-dom';
import '../css/ModalItem.css';
import dataLibrary from '../dataLibrary';
import userLibrary from '../userLibrary';
import FaStar from 'react-icons/lib/fa/star';
import FaStarO from 'react-icons/lib/fa/star-o';
import FaStarHalfEmpty from 'react-icons/lib/fa/star-half-empty';

class ModalItem extends Component {
    state = { typeModal: this.props.type, openModal: true, owner: false};
    

    componentWillMount(){
        console.log('props item', this.props);
        this.handleCall = this.handleCall.bind(this);
        this.upRatings = this.upRatings.bind(this);
        this.handleMail = this.handleMail.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.item;
        if(this.props.itemModal){
            this.item = this.props.itemModal;
        }
        this.closeModal = this.closeModal.bind(this);

        // var userQuery = userLibrary.getCurrentUser();
        // dataLibrary.getById(this.props.match.params.id).then((result) => {
        //     this.item = result;
        //     userQuery.then((user) => {
        //         this.setState({loaded: true});
        //         if(this.item.User === user.ID){
        //             this.setState({owner: true});
        //         }
        //     });
        // });
        
    }

    handleCall(){
        this.upRatings();
        document.location.href = "tel:" + this.item.User.phone;
        /////////////////NOT GOOD///////////////////////////
    }
    handleMail(){
        console.log('mail')
    }
    handleEdit(){
        console.log('edit')
    }
    handleRemove(){
        dataLibrary.remove(this.item);
        let notifTitle = "Success";
        let notifMessage = "Your post has been successully removed";
        this.props.modalFormMessage('success', notifTitle, notifMessage); 
        this.closeModal();
    }
    
    closeModal(type){
        var self = this;
        this.setState( {openModal: false});
        setTimeout(function(){ self.props.modalFormHide(); }, 200);
        this.props.history.push('/index.aspx');
    }
    upRatings(){
        if(this.item.Ratings < 5){
            this.item.Ratings = this.item.Ratings + 0.5;
            dataLibrary.update(this.item);
            this.forceUpdate();
        }
    }
   
    
    render() {
        if(!this.item){
            return <Redirect to={'/not-found'} />
        }
    
        let title = this.item.Category + " - " + this.item.Title
        let starsNb = Math.trunc(this.item.Ratings);
        let halfStarsNb = (this.item.Ratings % 1 === 0) ? 0: 1;
        let emptyStarsNb = 5 - (starsNb + halfStarsNb);
        let stars = [], halfStars = [], emptyStars = [];
        for(var i = 0; i < starsNb; i++){
            stars.push(
                <FaStar color='#004D9A' />
            )
        };
        for(var y = 0; y < halfStarsNb; y++){
            halfStars.push(
                <FaStarHalfEmpty key={y} color='#004D9A' />
            )
        };
        for(var z = 0; z < emptyStarsNb; z++){
            emptyStars.push(
                <FaStarO key={z} color='#004D9A' />
            )
        };
        return (
            <div>
                
                <Modal
                title={title}
                width={900}
                wrapClassName="vertical-center-modal"
                visible={this.state.openModal}
                onCancel={this.closeModal} 
                // okText="Submit"
                maskClosable={false}
                className="modalItem"
                
                footer={[
                    <Button className="btnEdit" key="edit" type="primary" onClick={this.handleEdit}>
                    Edit item</Button>,
                    <Popconfirm class="removeConfirm" title="Do you want to delete this item?" onConfirm={this.handleRemove} okText="Yes" cancelText="No">
                        <Button className="btnRemove" key="remove" type="primary">
                            Remove item
                        </Button>
                    </Popconfirm>,
                    <Button key="call" className="btnCall" type="primary" onClick={this.handleCall}>Call</Button>,
                    <Button key="mail" className="btnMail" type="primary" onClick={this.handleMail}>
                    Send Email
                    </Button>,
                ]}
                >
                    <Row>
                        <Col span={8} className="ratings">
                            {stars}
                            {halfStars}
                            {emptyStars}
                        </Col>
                        <Col span={8} offset={8} className="date">
                            {new Date(this.item.Date).toLocaleString()}
                            {this.item.Duration ? (<span> - {this.item.Duration} minutes</span>) : null}
                        </Col>
                    </Row>
                    <div className="descriptionH">Description</div>
                    <div className="description">{this.item.Description}</div>
                    
                </Modal>
               
                
            </div>
        );
    }
}
export default Form.create()(ModalItem)