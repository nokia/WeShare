/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import { notification, Form,  Popconfirm, Modal, Button, Row, Col } from 'antd';
import {Redirect} from 'react-router-dom';
import '../css/ModalItem.css';
import dataLibrary from '../dataLibrary';
import userLibrary from '../userLibrary';
import FaStar from 'react-icons/lib/fa/star';
import FaStarO from 'react-icons/lib/fa/star-o';
import FaStarHalfEmpty from 'react-icons/lib/fa/star-half-empty';
import ModalForm from './ModalForm';
import ModalFormContact from './ModalFormContact';

class ModalItem extends Component {
    state = { typeModal: this.props.type, openModalEdit: false, openModalContact: false, openModal: true, owner: false, loaded: false};
    item;

    componentWillMount(){
        this.handleCall = this.handleCall.bind(this);
        this.upRatings = this.upRatings.bind(this);
        this.handleMail = this.handleMail.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.hideModalEdit = this.hideModalEdit.bind(this);
        this.hideModalContact = this.hideModalContact.bind(this);
        this.refresh = this.refresh.bind(this);
        
        if(this.props.itemModal){
            dataLibrary.getById(this.props.itemModal).then((item) =>{
                this.item = item;
                this.setState({loaded: true});
                var userQuery = userLibrary.getCurrentUser();
                var self = this;
                console.log('this item', this.item);
                userQuery.then((user) => {
                    if(!self.item){
                        return;
                    }
                    if(self.item.User.ID === user.ID){
                        self.setState({owner: true});
                    }
                });
            });
            
        }
        this.closeModal = this.closeModal.bind(this);
        
    }

    handleCall(){
        this.upRatings();
        document.location.href = "tel:" + this.item.User.Number;
    }
    handleMail(){
        this.setState( {openModalContact: true} );
    }
    handleEdit(){
        this.setState( {openModalEdit: true} );
    }
    hideModalEdit(){
        this.setState( {openModalEdit: false} );
    }
    hideModalContact(){
        this.setState( {openModalContact: false} );
    }
    handleRemove(){
        dataLibrary.remove(this.item);
        let notifTitle = "Success";
        let notifMessage = "Your post has been successully removed";
        this.props.modalFormMessage('success', notifTitle, notifMessage); 
        this.closeModal();
    }
    refresh(){
        this.forceUpdate();
        this.props.refresh();
    }
    closeModal(type){
        var self = this;
        this.setState( {openModal: false});
        setTimeout(function(){ self.props.modalFormHide(); }, 200);
        this.props.history.push('/index.aspx');
    }
    handleClose(){
        this.item.Closed = true;
        dataLibrary.update(this.item);
        this.forceUpdate();
    }
    handleOpen(){
        this.item.Closed = false;
        dataLibrary.update(this.item);
        this.forceUpdate();
    }
    upRatings(){
        if(this.item.Ratings < 5){
            this.item.Ratings = this.item.Ratings + 0.5;
            dataLibrary.update(this.item);
            this.forceUpdate();
        }
    }
    showMessage(type, title, text){
        notification[type]({
            message: title,
            description: text,
        });
    }
   
    
    render() {
        if(!this.state.loaded){
            return <div></div>;
        }

        if(!this.item){
            return <Redirect to={'/not-found'} />
        }
    
        let title = this.item.Category + " - " + this.item.Title
        if(this.item.Closed){
            title = "[Closed] " + title;
        }
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
        let footer = [];
        
        if(this.state.owner){
            if(!this.item.Closed){
                footer.push(
                    <Button icon="lock" className="btnClose" key="close" type="primary" onClick={this.handleClose}>
                        Close item
                    </Button>
                );
            }else{
                footer.push(
                    <Button icon="unlock" className="btnOpen" key="open" type="primary" onClick={this.handleOpen}>
                        Open item
                    </Button>
                );
            }
            footer.push(
                <Button icon="edit" className="btnEdit" key="edit" type="primary" onClick={this.handleEdit}>
                    Edit item
                </Button>,
                <Popconfirm key="remove" class="removeConfirm" title="Do you want to delete this item?" onConfirm={this.handleRemove} okText="Yes" cancelText="No">
                    <Button className="btnRemove" icon="delete" key="remove" type="primary">
                        Remove item
                    </Button>
                </Popconfirm>
            );
        }else{
            
            if(!this.item.Closed){
                if(this.item.User.Number){
                    footer.push(
                    <Button key="call" icon="phone" className="btnCall" type="primary" onClick={this.handleCall}>Call</Button>
                    );
                }
                footer.push(
                    <Button key="mail" icon="mail" className="btnMail" type="primary" onClick={this.handleMail}>
                        Send Email
                    </Button>
                );
            }
        }
        let duration;
        if(this.item.Duration && Number.isInteger(parseInt(this.item.Duration, 10))){
            duration = <span>{this.item.Duration} minutes</span>
        }else if(this.item.Duration && !Number.isInteger(parseInt(this.item.Duration, 10))){
            duration = <span>Indeterminate duration</span>
        }          

        let author;
        console.log('this item bellow', this.item);
        if(this.item.User.Lastname && this.item.User.Name){
            author = this.item.User.Lastname + " " + this.item.User.Name;
        }else{
            author = "Unknown";
        }
        
        return (
            <div>
                {this.state.openModalEdit && this.item.Type === "request" ? (
                    <ModalForm refresh={this.refresh} modalFormMessage={this.showMessage} item={this.item} modalFormHide={this.hideModalEdit} type="request" />
                ) : null}
                {this.state.openModalEdit && this.item.Type === "share" ? (
                    <ModalForm refresh={this.refresh} modalFormMessage={this.showMessage} item={this.item} modalFormHide={this.hideModalEdit} type="share" />
                ) : null}
                {this.state.openModalContact ? (
                    <ModalFormContact modalFormMessage={this.showMessage} item={this.item} modalFormHide={this.hideModalContact}/>
                ) : null}
                <Modal
                title={title}
                width={900}
                wrapClassName="vertical-center-modal"
                visible={this.state.openModal}
                onCancel={this.closeModal} 
                maskClosable={false}
                className="modalItem"
                
                footer={footer}
                >
                    <Row>
                        <Col span={8} className="ratings">
                            {stars}
                            {halfStars}
                            {emptyStars}
                        </Col>
                        <Col span={8} offset={8} className="date">
                            Published {new Date(this.item.Date).toLocaleString()}
                        </Col>
                    </Row>
                    <div className="modalH">Description</div>
                    <div className="description">{this.item.Description}</div>
                    {this.item.Duration ? (
                        <span><div className="modalH">Duration</div>
                        <div className="duration">{duration}</div></span>
                        
                    ) : null}
                    <div className="modalH">Author</div>
                    <div className="description">{author}</div>
                    
                    
                </Modal>
            </div>
        );
    }
}
export default Form.create()(ModalItem)