/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import React, { Component } from 'react';
import { Menu, Dropdown, Icon, notification, Button, Radio, Input, Row, Col, Pagination } from 'antd';
import '../css/Browse.css';
import Line from './Line';
import dataLibrary from '../dataLibrary';
import {Config} from '../config.js';
import ReactGA from 'react-ga';
import MdClear from 'react-icons/lib/md/clear';
import userLibrary from '../userLibrary';
import ModalItem from './ModalItem';

import ScrollableAnchor, { goToAnchor } from 'react-scrollable-anchor';
const Search = Input.Search;
const SubMenu = Menu.SubMenu;

export default class Browse extends Component {
    state = { openModal: false, page: 1, pageSize: 20, itemModal: '', dropDownDisabled: true, isLoading:true, countCategories: [], sortActive: 'All', data:[], dataPagined: [], searchValue: "", filterCategory: "All topics" }
    firstLoad = false;
    componentWillMount(){
        this.searchClear = this.searchClear.bind(this);
        this.initDropdown = this.initDropdown.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.refresh = this.refresh.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.showTotal = this.showTotal.bind(this);
        this.handleCategoryClick = this.handleCategoryClick.bind(this);
        let data = dataLibrary.get();
        data.then((result) =>{
            result = result.map( item => item);
            this.setState({data: result, displayedData: result, isLoading:false});
            this.props.onLoaded(true);
            let countQuery = dataLibrary.countCategories();
            countQuery.then((result) =>{
                this.setState({countCategories: result});
                this.initDropdown(this.state.filterCategory);
            });
        });
        
    }

    componentWillReceiveProps(newProps){
        let data = dataLibrary.get();
        let page;
        if(window.location.href.indexOf("item") > -1) {
            page = "item";
        }else if(window.location.href.indexOf("category") > -1) {
            page = "category";
        }

        if(page === "item"){
            let id = window.location.href.split('/');
            id = id[id.length - 1];
            id = id.replace('#browse','');
            if(Number.isInteger(parseInt(id, 10))){
                data.then((dataF) =>{
                    if(!this.firstLoad){
                        this.setState({data: dataF, displayedData: dataF});
                    }
                    dataF = dataF.map( item => item);
                    this.setState({isLoading:false});
                    this.showModal(id);                
                });
            }
            return;
        }
        
        data.then((result) =>{
            
            result = result.map( item => item);
            let countQuery = dataLibrary.countCategories();
            countQuery.then((result2) =>{
                this.setState({countCategories: result2});
                this.initDropdown(this.state.filterCategory);
                this.setState({isLoading:false});
            });
            if(this.state.data.length !== result.length){                
                this.setState({data: result, displayedData: result});
                this.firstLoad = false;
            }
            if(page === "category"){
                if(!this.firstLoad){
                    let id = window.location.href.split('/');
                    id = id[id.length - 1];
                    id = id.replace('#browse','');
                    id = decodeURI(id);
                    this.handleCategoryClick({key: id});
                    this.firstLoad = true;
                }
                return;
            }
        });
    }
    refresh(){
        this.forceUpdate();
    }

    dropDownOptions = <Menu><Menu.Item key="loading">Loading...</Menu.Item></Menu>;
    initDropdown(act){
        this.dropDownOptions =  [
            <Menu.Item className={act === "All topics" ? "act" : null} key="All topics">All topics ({this.state.countCategories['all']})</Menu.Item>,
            <Menu.Item className={act === "My topics" ? "act" : null} key="My topics">My topics ({this.state.countCategories['my']})</Menu.Item>,
            <Menu.Item className={act === "Unclassified" ? "act" : null} key="Unclassified">Unclassified ({this.state.countCategories['unclassified']})</Menu.Item>
        ];
        dataLibrary.Categories.forEach( category => {
            let count = 0;
            // let countSubTotal = 0;
            if(Array.isArray(category)){
                let subCategories = [];
                category[1].forEach( subCategory => {
                    count = this.state.countCategories[subCategory];
                    // countSubTotal += count;
                    subCategories.push(
                        <Menu.Item className={act === subCategory ? "act" : null} key={subCategory}>{subCategory} ({count})</Menu.Item>
                    );
                });
                // let subText = category[0] + " (" + countSubTotal.toString() + ")";
                this.dropDownOptions.push(
                    <SubMenu title="sub menu">
                        {subCategories}
                    </SubMenu>
                );
            }else{
                
                count = this.state.countCategories[category];
                this.dropDownOptions.push(
                    <Menu.Item className={act === category ? "act" : null} key={category}>{category} ({count})</Menu.Item>
                );
            }
        });
        this.dropDownOptions = <Menu onClick={this.handleCategoryClick}>{this.dropDownOptions}</Menu>
        this.setState({dropDownDisabled: false});
    }
    searchClear(){
        this.search("");
        let self = this;
        setTimeout(function(){ self.setState({page: 1}); }, 100);
    }

    showMessage(type, title, text){
        notification[type]({
            message: title,
            description: text,
        });
    }
    handlePagination(page, pageSize){
        goToAnchor('browse');
        let self = this;
        setTimeout(function(){ self.setState({page: page}); }, 100);
        
    }
    showTotal(total, range){
        if(total === 0){
            return 'No items';
        }
        return `${range[0]}-${range[1]} of ${total} items`;
    }
    handleCategoryClick(value){   
        let key = value.key;
        this.setState({ filterCategory: key, searchValue: "", sortActive: "All" });
        this.initDropdown(key);
        if(key === "All topics"){
            this.setState({ displayedData: this.state.data });
        }else if(key === "My topics"){
            let tmp = [];
            for (var i=0; i < this.state.data.length; i++) {
                if (this.state.data[i].User.ID === userLibrary.currentUser.ID) {
                    tmp.push(this.state.data[i]);
                }
            }
            this.setState({displayedData: tmp});
        }else{
            let tmp = [];
            for (var y=0; y < this.state.data.length; y++) {
                if (this.state.data[y].Category.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                    tmp.push(this.state.data[y]);
                }
            }
            this.setState({displayedData: tmp});
        }
        
        let self = this;
        if(key !== "All topics"){
            this.props.history.push('/index.aspx/category/' + encodeURI(key));
            if(!Config.local){
                ReactGA.pageview('/index.aspx/category/' + key);
            }
        }else{
            this.props.history.push('/index.aspx');
        }
        setTimeout(function(){ self.setState({page: 1}); }, 100);
    }

    handleSortClick = (e) => {
        let value = e.target.value;
        
        this.initDropdown("All topics");
        this.handleCategoryClick({key: "All topics"});
        this.setState({ sortActive: value, searchValue: "" });
        if(value === "All"){
            this.setState({ displayedData: this.state.data });
        }else{
            let tmp = [];
            this.state.data.forEach( item => {
                if(item.Type.toLowerCase() === value.toLowerCase()){
                    tmp.push(item);
                }
            });
            this.setState({displayedData: tmp});
        }
        
        let self = this;
        setTimeout(function(){ self.setState({page: 1}); }, 100);
    }

    search = (param) => {
        let val;
        if(param === ""){
            val = param;
        }else{
            val = param.target.value;
        }
        
        this.handleCategoryClick({key: "All topics"});
        this.setState({ searchValue: val, sortActive: "All" });
        let tmp = [];
        for (var i=0; i < this.state.data.length; i++) {
            if (this.state.data[i].Title.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
                tmp.push(this.state.data[i]);
            }
        }
        this.setState({displayedData: tmp});
        
        let self = this;
        setTimeout(function(){ self.setState({page: 1}); }, 100);
    }

    showModal(item){
        this.setState( {openModal: true, itemModal: item});
        if(!Config.local){
            ReactGA.pageview(window.location.href);
        }
    }
    hideModal(){
        this.setState( {openModal: false});
        this.handleCategoryClick({key: this.state.filterCategory})
        this.handlePagination(this.state.page, this.state.pageSize);
        
    }


    render() {
        if(this.state.isLoading) {
            return (
                <div className="items"></div>
            );
        }else{
            const { sortActive } = this.state;
            let lines;
            if(this.state.displayedData.length > 0){
                lines = this.state.displayedData.map( (line, index) => {
                    if(index > this.state.page * (this.state.pageSize)) return null;
                    if(index < this.state.page * (this.state.pageSize) - (this.state.pageSize)) return null;
                    return(
                        <div key={index}><Line data={line}/></div>
                    )
                });
            }else{
                lines = (
                    <div className="nothing">Nothing for the moment...</div>
                )
            }

            return (
                <div className="browse">
                
                    {this.state.openModal ? (
                        <ModalItem history={this.props.history} refresh={this.refresh} modalFormMessage={this.showMessage}  modalFormHide={this.hideModal} itemModal={this.state.itemModal} />
                    ) : null}
                    
                    <div className="banner">
                        <ScrollableAnchor id={'browse'}>
                            <div className="wrapper">
                                <div className="bannerTitle">
                                    Browse topics
                                </div>
                                <Search
                                    placeholder="Search..."
                                    onChange={value => this.search(value)}
                                    className="bannerSearch" 
                                    value={this.state.searchValue}
                                />
                                {this.state.searchValue ? ( 
                                    <span className="searchClear" onClick={this.searchClear}><MdClear /></span>
                                ) : null}
                            </div>
                        </ScrollableAnchor>
                    </div>
                    <div className="wrapper">
                        <Row className="menuSortFilter">
                            <Col span={8}>
                                <Dropdown trigger={['click']} disabled={this.state.dropDownDisabled} overlay={this.dropDownOptions}>
                                    <Button className="categoryButton">
                                        {this.state.filterCategory} <Icon type="down" />
                                    </Button>
                                </Dropdown>
                            </Col>
                            <Col span={8} offset={8}>
                                <Radio.Group className="menuSort" value={sortActive} onChange={this.handleSortClick}>
                                    <Radio.Button value="All">All</Radio.Button>
                                    <Radio.Button value="Request">Request</Radio.Button>
                                    <Radio.Button value="Share">Share</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                        {lines}
                    </div>

                    <Pagination
                    total={this.state.displayedData.length}
                    showTotal={this.showTotal}
                    pageSize={this.state.pageSize}
                    defaultCurrent={1}
                    current={this.state.page}
                    onChange={this.handlePagination}
                    />
                </div>                        
            );
        }
    }
}