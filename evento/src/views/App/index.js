import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import MainPage from '../MainPage';
import EventPage from '../EventPage';
import NewEventPage from '../NewEventPage';
import SignInPage from '../SignInPage';
import RegisterPage from '../RegisterPage';
import PathNotFound from './components/PathNotFound';
import './App.css';

import api from '../../api';
import session from '../../session';

const AuthStatus = {
	Authenticating: 0,
	Authenticated: 1,
	NotAuthenticated: 2,
};

class App extends Component {
	constructor() {
		super();
		this.state = {
			authenticating: true,
			errorMessage: null,
		};
	}

	async componentDidMount() {
		this.authenticate();
	}

	render() {
		return (
			<div className="App">
				<Router basename="/evento">
					{this.getContent()}
				</Router>
			</div>
		);
	}

	getContent() {
		if(this.state.errorMessage) {
			return <h4>{ this.state.errorMessage }</h4>;
		}

		const authStatus = this.getAuthStatus();
		if(authStatus === AuthStatus.Authenticating) {
			return <h4>loading...</h4>;
		}
		else if(authStatus === AuthStatus.NotAuthenticated) {
			return <Route component={SignInPage} />;
		}

		return (
			<Switch>
				<Route exact path='/' component={MainPage} />
				<Route exact path='/events' component={MainPage} />
				<Route exact path='/signin' component={SignInPage} />
				<Route exact path='/register' component={RegisterPage} />
				<Route exact path='/event/new' component={NewEventPage} />
				<Route exact path='/event/:eventId' component={EventPage} />
				<Route path='*' component={PathNotFound} />
			</Switch>
		);
	}

	getAuthStatus() {
		if(this.state.authenticating) return AuthStatus.Authenticating;
		return session.isLoggedIn() ? AuthStatus.Authenticated : AuthStatus.NotAuthenticated;
	}

	authenticate() {
		this.setState({ authenticating: true });

		const result = await api.getAuthenticationStatus();
		if(result.success) {
			/* api.getAuthenticationStatus changes cookies so session.isLoggedIn
			/* get updated accordingly and thus getAuthStatus() changes */
		}
		else {
			this.setState({ errorMessage: result.error.message });
		}

		this.setState({ authenticating: false });
	}
}

export default App;
