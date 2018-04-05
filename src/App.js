/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
 */
import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Config} from './config.js';
import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import ReactGA from 'react-ga';
import 'core-js/fn/number/is-nan';
import './css/App.css';
import Home from './components/Home';
// import Item from './components/Item';
import NotFound from './components/NotFound';
import SH from './sharePoint';
import dataLibrary from './dataLibrary';
// import old from './lib/oldItems.js';
// import oldUsers from './lib/oldUsers.js';

import 'antd/dist/antd.css';
import { createBrowserHistory } from 'history';

export default class App extends Component {

  state = { loaded:false };
  
  componentWillMount(){
    SH.init('https://nokia.sharepoint.com/sites/learn/weshare');
    dataLibrary.init().then( () => this.setState({ loaded:true} ));
    if(!Config.local){
      ReactGA.initialize('UA-92171479-1');
      ReactGA.pageview('home');
    }

    // oldUsers.forEach(old => {
    //  SH.createListItem('Users', old).then((results) => {
    //      console.log('create', results);
    //    });
    //  });
  //  old.forEach(o => {
  //    SH.createListItem('Items', o).then((results) => {
  //        console.log('create', results);
  //      });
  //    });
  }

  render() {

    if (!this.state.loaded) return null;
    const basename = Config.Source.slice(1);
    return (
      <Router basename={basename}>
        <Switch>
          <Route exact path='/' render={(props) => (<Home {...props}/>)} />
          <Route exact path='/index.aspx' render={(props) => (<Home {...props} />)}/>
          <Route exact  path='/index.aspx/item/:id' render={(props) => (<Home {...props} />)}/>
          <Route exact  path='/index.aspx/category/:id' render={(props) => (<Home {...props} />)}/>
          {/* <Route exact path='/index.aspx/item/:id' component={Item} /> */}
          <Route exact path='*' render={() => (<NotFound />)} />
        </Switch>
      </Router>  
    );
  }
}