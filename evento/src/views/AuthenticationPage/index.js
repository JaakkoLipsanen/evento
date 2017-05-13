import React, { Component } from 'react';

import RegisterForm from './components/RegisterForm';
import SignInForm from './components/SignInForm'
import './AuthenticationPage.css';

class AuthenticationPage extends Component {
	constructor() {
		super();
		this.state = { showRegister: false };
	}

	render() {
		return (
			<div className="AuthenticationPage">
				{ this.getView() }

				<a onClick={() => this.setState({ showRegister: !this.state.showRegister })}>
					{ this.getChangeLinkText() }
				</a>
			</div>
		);
	}

	getView() {
		if(this.state.showRegister) {
			return <RegisterForm {...this.props} />
		}

		return <SignInForm {...this.props} />
	}

	getChangeLinkText() {
		if(this.state.showRegister) {
			return "Already registered? Sign in here";
		}

		return "Not yet registered? Register here";
	}
}

export default AuthenticationPage;
