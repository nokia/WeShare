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
// import Item from './components/Item';
import NotFound from './components/NotFound';
import SH from './sharePoint';
import dataLibrary from './dataLibrary';

import 'antd/dist/antd.css';
export default class App extends Component {

  state = { loaded:false };
  
  componentWillMount(){
    SH.init('https://nokia.sharepoint.com/sites/learn/weshare');
    dataLibrary.init().then( () => this.setState({ loaded:true} ));
    console.log('app props', this.props);
  }

  render() {

    if (!this.state.loaded) return null;
    const basename = Config.Source.slice(1);
    return (
      <Router basename={basename}>
        <Switch>
          <Route exact path='/' render={() => (<Home />)} />
          <Route exact path='/index.aspx' render={({history}) => (<Home history={history} />)} />
          <Route exact  path='/index.aspx/item/:id' render={({history}) => (<Home history={history}/>)} />
          {/* <Route exact path='/index.aspx/item/:id' component={Item} /> */}
          <Route exact path='*' render={() => (<NotFound />)} />
        </Switch>
      </Router>  
    );
  }
}