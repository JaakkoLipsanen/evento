import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, browserHistory } from 'react-router-dom';

import api from '../../api';
import MainPage from '../MainPage';
import EventPage from '../EventPage';
import NewEventPage from '../NewEventPage';
import AuthenticationPage from '../AuthenticationPage';
import PathNotFound from './components/PathNotFound';
import './App.css';

const AuthStatus = {
	Authenticating: 0,
	Authenticated: 1,
	NotAuthenticated: 2,
};

class App extends Component {
	constructor() {
		super();
		this.state = {
			authenticated: false,
			checkingAuthentication: true,
		}
	}

	componentDidMount() {
		this.checkAuthenticationStatus();
	}

	render() {
		if (this.state.checkingAuthentication) {
			return <h3>'Loading...'</h3>
		} else if (!this.state.authenticated) {
			return <AuthenticationPage onSignIn={ () => this.onSignin() } />
		}

		return (
			<div className="App">
				<Router basename="/evento" history={browserHistory}>
					<Switch>
						<Route exact path='/' component={ MainPage } />
						<Route exact path='/events' component={ MainPage } />
						<Route exact path='/event/new' component={ NewEventPage } />
						<Route exact path='/event/:eventId' component={ EventPage } />
						<Route path='*' component={ PathNotFound } />
					</Switch>
				</Router>
			</div>
		);
	}

	async checkAuthenticationStatus() {
		this.setState({ checkAuthenticationStatus: true })

		const result = await api.getAuthenticationStatus();
		const isAuthenticated = result.success && result.payload.isAuthenticated;
		await this.setState({ authenticated: isAuthenticated, checkingAuthentication: false });
	}

	onSignin() {
		this.setState({ authenticated: true });
		this.forceUpdate(); // re-render App
	}
}

export default App;
