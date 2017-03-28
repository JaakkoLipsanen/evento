import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Explore from '../Explore';
import PathNotFound from './components/PathNotFound';

class App extends Component {

	render() {
		return (
      <Router>
        <Switch>
          <Route path='/explore' component={Explore} />
          <Route exact path='*' component={PathNotFound} />
        </Switch>
      </Router>
    );
	}
}

export default App;
