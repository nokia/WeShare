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
import './css/App.css';
import Home from './components/Home';
import Item from './components/Item';
import NotFound from './components/NotFound';
import SH from './sharePoint.js';


export default class App extends Component {
  componentWillMount(){
    SH.init('https://nokia.sharepoint.com/sites/learn/weshare');
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