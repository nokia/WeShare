/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
 */
import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Config} from './config.js';

import './css/App.css';
import Home from './components/Home';
import Item from './components/Item';
import NotFound from './components/NotFound';

export default class App extends Component {

  render() {
    let basename = Config.Source.slice(1);
    return (
      <Router basename={basename}>
        <Switch>
          <Route exact path='/' render={() => (<Home />)} />
          <Route exact path='/index.aspx' render={() => (<Home />)} />
          <Route exact path='/item/:id' component={Item} />
          <Route exact path='*' render={() => (<NotFound />)} />
        </Switch>
      </Router>  
    );
  }
}