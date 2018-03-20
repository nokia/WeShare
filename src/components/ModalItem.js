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

class ModalItem extends Component {
    state = { typeModal: this.props.type, openModal: true};
    

    componentWillMount(){
        console.log(this.props);
        if(this.props.itemModal){
            true;
        }
        this.closeModal = this.closeModal.bind(this);
        
    }


    
    closeModal(type){
        var self = this;
        this.setState( {openModal: false});
        
        setTimeout(function(){ self.props.modalFormHide(); }, 200);
        
    }

   

    render() {
        let tit = "sel";
        return (
            <div>
                
                <Modal
                title={tit}
                width={900}
                wrapClassName="vertical-center-modal"
                visible={this.state.openModal}
                onCancel={this.closeModal} 
                okText="Submit"
                maskClosable={false}
                className="modalForm"
                >
                    <Form>
                        
                    </Form>
                </Modal>
               
                
            </div>
        );
    }
}
export default Form.create()(ModalItem)