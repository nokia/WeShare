/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import {Grid} from 'semantic-ui-react';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import { Message, Loader } from 'semantic-ui-react';

import '../css/Home.css';
import userLibrary from '../userLibrary';
import HeaderBanner from './Header';
import Browse from './Browse';
import ModalForm from './ModalForm';
import FaShareAlt from 'react-icons/lib/fa/share-alt';
import FaExclamation from 'react-icons/lib/fa/exclamation';
import FaThList from 'react-icons/lib/fa/th-list';



export default class Home extends Component {

    state = { openModal: false, typeModal: "", message: [], loaded: false};

    
    componentWillMount(){
        configureAnchors({scrollUrlHashUpdate:false});
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.onLoaded = this.onLoaded.bind(this);
        this.refresh = this.refresh.bind(this);
        
        // this.user = userLibrary.get();
    }


    showModal(type){
        console.log('show modal');
        this.setState( {openModal: true, typeModal: type});
    }
    hideModal(){
        this.setState( {openModal: false});
    }

    refresh(){
        // console.log('refresh');

        this.forceUpdate();
    }
    
    showMessage(color, text){
        this.setState({message: [color, text]});
        setTimeout( () => { 
            this.setState({message: []});
        }, 3000);

    }
    
    onLoaded(bool){
        this.setState({loaded: true});
    }

    render() {
        
        return (
            <div className="home">
                <HeaderBanner />
                <div className="wrapper">
                    {this.state.message.length > 0 ? (<Message color={this.state.message[0]}>{this.state.message[1]}</Message>) : null}

                    <Grid verticalAlign='middle' columns={3} stackable container divided>
                        <Grid.Row className="presentations">
                            <Grid.Column>
                                <div className="presentation" onClick={this.showModal.bind(this,'share')}>
                                    <FaShareAlt size={45} className="icon" color='#474747'/>
                                    <h2>Share knowledge</h2>
                                </div>
                            </Grid.Column>
                            {this.state.loaded ? (
                                <Grid.Column>
                                    <a href='#browse' className="presentation">
                                        <FaThList size={45} className="icon" color='#474747' />
                                        <h2>Browse topics</h2>
                                    </a>
                                </Grid.Column>
                            ) : (
                                <Grid.Column>
                                    <a className="presentationNotLoaded">

                                        <Loader active />
                                        <FaThList size={45} className="icon" color='#d8d8d8' />
                                        <h2>Browse topics</h2>
                                    </a>
                                </Grid.Column>
                            )}
                            <Grid.Column>
                                <div className="presentation" onClick={this.showModal.bind(this,'request')}>
                                    <FaExclamation size={45} className="icon" color='#474747' />
                                    <h2>Post a request</h2>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <ScrollableAnchor id={'browse'}>
                    <Browse onLoaded={this.onLoaded} />
                </ScrollableAnchor>
                
                {this.state.openModal && this.state.typeModal === "share" ? (
                    <ModalForm refresh={this.refresh} modalFormMessage={this.showMessage} modalFormHide={this.hideModal} type="share" />
                ) : null}
                {this.state.openModal && this.state.typeModal === "request" ? (
                    <ModalForm refresh={this.refresh} modalFormMessage={this.showMessage}  modalFormHide={this.hideModal} type="request" />
                ) : null}
            </div>
        );
    }
}
