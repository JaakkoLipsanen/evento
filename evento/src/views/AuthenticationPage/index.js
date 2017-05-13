import React, { Component } from 'react';

import RegisterPage from '../RegisterPage';
import SignInPage from '../SignInPage'
import './AuthenticationPage.css';

class AuthenticationPage extends Component {
	render() {
		return (
			<div className="AuthenticationPage">
				<div className="SignInPage">
					<SignInPage {...this.props} />
				</div>
				<div className="separator" />
				<div className="RegisterPage">
					<RegisterPage {...this.props} />
				</div>
			</div>
		);
	}
}

export default AuthenticationPage;
