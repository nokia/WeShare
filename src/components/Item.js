/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'
import {Grid, Button, Message, Confirm, Segment, Loader} from 'semantic-ui-react';
import FaShareAlt from 'react-icons/lib/fa/share-alt';
import FaExclamation from 'react-icons/lib/fa/exclamation';
import FaStar from 'react-icons/lib/fa/star';
import FaStarO from 'react-icons/lib/fa/star-o';
import FaStarHalfEmpty from 'react-icons/lib/fa/star-half-empty';
import MdMailOutline from 'react-icons/lib/md/mail-outline';
import MdCall from 'react-icons/lib/md/call';

import userLibrary from '../userLibrary';
import '../css/Item.css';
import Header from './Header';
import dataLibrary from '../dataLibrary';
import ModalForm from './ModalForm';
import ModalFormContact from './ModalFormContact';

export default class Item extends Component {
    item;
    state = {loaded: false, openConfirm: false, openContactModal: false, openModal: false, typeModal: "", owner: false, message: []};

    componentWillMount(){
        // console.log('prop', this.props);
        var userQuery = userLibrary.getCurrentUser();
        dataLibrary.getById(this.props.match.params.id).then((result) => {
            // console.log('res', result);
            this.item = result;

            if(!this.item){
                this.props.history.push('not-found');
                return;
            }
            this.showModal = this.showModal.bind(this);
            this.edit = this.edit.bind(this);
            this.hideModal = this.hideModal.bind(this);
            this.hideContactModal = this.hideContactModal.bind(this);
            this.showContactModal = this.showContactModal.bind(this);
            this.upRatings = this.upRatings.bind(this);
            this.showMessage = this.showMessage.bind(this);
            userQuery.then((user) => {
                console.log('next rest', user);
                this.setState({typeModal: this.item.Type, loaded: true});
                if(this.item.User === user.ID){
                    this.setState({owner: true});
                }
            });
        });
        
    }

    showContactModal(){
        this.setState( {openContactModal: true} );
    }
    hideContactModal(){
        this.setState( {openContactModal: false} );
    }
    upRatings(){
        if(this.item.Ratings < 5){
            this.item.Ratings = this.item.Ratings + 0.5;
            dataLibrary.update(this.item);
            this.forceUpdate();
        }
    }

    confirmShow = () => this.setState({ openConfirm: true });
    confirmConfirm = () => {
        this.remove();
    }
    confirmCancel = () => this.setState({ openConfirm: false });

    showModal(){
        this.setState( {openModal: true} );
    }
    hideModal(){
        this.setState( {openModal: false} );
    }
    
    showMessage(color, text){
        this.setState({message: [color, text]});
        setTimeout( () => { 
            this.setState({message: []});
        }, 3000);
    }

    edit(){
        this.showModal();
    }
    remove(){
        dataLibrary.remove(this.item);
        this.setState({ openConfirm: false });
        this.showMessage('green', 'Successully removed');
        setTimeout( () => { 
            this.props.history.push('/');
        }, 1000);
    }
    render() {
        if (!this.state.loaded) {
            return (
                <div className="item">
                    <Header />
                    <Segment basic>
                    <div className="wrapper loader">
                        <Loader active>Loading topic</Loader>
                    </div>
                    </Segment>
                </div>
            );
        }
        if(!this.item){
            return <Redirect to={'/not-found'} />
        }
        const requestIcon =  (
            <div>
                <div className="center">
                    <FaExclamation size={75} className="icon" color='#7a9eea' />
                </div>
                <div className="titleRequest">
                    {this.item.Category} - {this.item.Title}
                </div>
            </div>
        );
        const shareIcon =  (
            <div>
                <div className="center">
                    <FaShareAlt size={75} className="icon" color='#EAC67A' />
                </div>
                <div className="titleShare">
                    {this.item.Category} - {this.item.Title}
                </div>
            </div>
        );

        let displayItem;
        if(this.item.Type === "request"){
            displayItem = requestIcon;
        }else if(this.item.Type === "share"){
            displayItem = shareIcon;
        }

        let starsNb = Math.trunc(this.item.Ratings);
        let halfStarsNb = (this.item.Ratings % 1 === 0) ? 0: 1;
        let emptyStarsNb = 5 - (starsNb + halfStarsNb);
        let stars = [], halfStars = [], emptyStars = [];
        for(var i = 0; i < starsNb; i++){
            stars.push(
                <FaStar color='#984B43' />
            )
        };
        for(var y = 0; y < halfStarsNb; y++){
            halfStars.push(
                <FaStarHalfEmpty color='#984B43' />
            )
        };
        for(var z = 0; z < emptyStarsNb; z++){
            emptyStars.push(
                <FaStarO color='#984B43' />
            )
        };


        return (
            <div className="item">
                <Header />
                <div className="wrapper">
                    {this.state.message.length > 0 ? (<Message color={this.state.message[0]}>{this.state.message[1]}</Message>) : null}

                    {displayItem}
                    <div className="ratings">
                        {stars}
                        {halfStars}
                        {emptyStars}
                    </div>
                    <div className="date">
                        {this.item.Date.toLocaleString()}
                        {this.item.Duration ? (<span>- {this.item.Duration} minutes</span>) : null}
                    </div>

                    <br /><br />
                    {this.state.owner ? (
                        <Button.Group fluid size='medium'>
                            <Button onClick={this.edit}>Edit</Button>
                            <Button.Or />
                            <Button onClick={this.confirmShow}>Remove</Button>
                        </Button.Group>
                    ) : null }

                    <h2>Description</h2>
                    <div className="description">
                        {this.item.Description}
                    </div>

                    {!this.state.owner ? (
                        <Grid divided='vertically' container className="contact">
                            {this.item.User.phone ? (<Grid.Row>
                                <a onClick={this.upRatings} href={'tel:' + this.item.User.phone}>
                                    <MdCall color='#984B43' size={40} className="contactIcon" />
                                    Call the author
                                </a>
                            </Grid.Row>
                            ) : null }
                            <Grid.Row>
                                <div onClick={this.showContactModal}>
                                    <MdMailOutline color='#984B43' size={40} className="contactIcon" />
                                    Send an email to the author
                                </div>
                            </Grid.Row>
                        </Grid>
                    ) : null}
                    
                    
                </div>
                {this.state.openModal && this.state.typeModal === "share" ? (
                    <ModalForm modalFormMessage={this.showMessage} item={this.item} modalFormHide={this.hideModal} type="share" />
                ) : null}
                {this.state.openModal && this.state.typeModal === "request" ? (
                    <ModalForm modalFormMessage={this.showMessage} item={this.item} modalFormHide={this.hideModal} type="request" />
                ) : null}
                {this.state.openContactModal ? (
                    <ModalFormContact modalFormMessage={this.showMessage} item={this.item} modalFormHide={this.hideContactModal}/>
                ) : null}
                <Confirm
                    open={this.state.openConfirm}
                    onCancel={this.confirmCancel}
                    onConfirm={this.confirmConfirm}
                    content="Do you really want to delete this post?"
                />
            </div>
        );
    }
}
