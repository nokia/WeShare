/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
 */
import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Config} from './config.js';
import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';
// import './lib/gd-sprest.min.js'
import './css/App.css';
import Home from './components/Home';
import Item from './components/Item';
import NotFound from './components/NotFound';
import SH from './sharePoint.js';

import old from './lib/oldItems.js';
import oldUsers from './lib/oldUsers.js';
var lz = require('lz-string');

export default class App extends Component {
  componentWillMount(){
    SH.init('https://nokia.sharepoint.com/sites/learn/weshare');
    // oldUsers.forEach(old => {
    //   SH.createListItem('Users', old).then((results) => {
    //     console.log('create', results);
    //   });
    // });

    var s = SH.getListItems('Users');
    var users = [];
    s.then((result) => {
      result.forEach(r => {
        r.Data = lz.decompressFromBase64(r.Data);
        users.push(r);
      });
      console.log('users', users);
    });

    var i = SH.getListItems('Items');
    var items = [];
    i.then((result) => {
      result.forEach(r => {
        r.Data = lz.decompressFromBase64(r.Data);
        items.push(r);
      });
      console.log('items', items);
    });

    // old.forEach(o => {
    //   SH.createListItem('Items', o).then((results) => {
    //     console.log('create', results);
    //   });
    // });
  
    
  }

  render() {
    let basename = Config.Source.slice(1);
    return (
      <Router basename={basename}>
        <Switch>
          <Route exact path='/' render={() => (<Home />)} />
          <Route exact path='/index.aspx' render={() => (<Home />)} />
          <Route exact path='/index.aspx/item/:id' component={Item} />
          <Route exact path='*' render={() => (<NotFound />)} />
        </Switch>
      </Router>  
    );
  }
}