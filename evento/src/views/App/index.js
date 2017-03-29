import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import MainPage from '../MainPage';
import PathNotFound from './components/PathNotFound';
import './App.css';

class App extends Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route path='/' component={MainPage} />
						<Route path='*' component={PathNotFound} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
