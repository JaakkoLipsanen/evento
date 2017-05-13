import React from 'react';

import api from '../../api';
import './RegisterPage.css';

class RegisterPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			passwordConf: '',
			errorMessages: []
		};
	}

	async handleSubmit(evt) {
		evt.preventDefault();

		if (this.state.password !== this.state.passwordConf) {
			this.setState({ errorMessages: ['Passwords do not match'] });
			return;
		}

		const registerResult = await api.register(this.state.name, this.state.email, this.state.password);
		if(registerResult.success) {
			// After succsesiful register, sign in
			const signInResult = await api.signIn(this.state.email, this.state.password);
			if(signInResult.success) {
				this.props.onSignIn();
			}
		}
		else {
			this.setState({ errorMessages: registerResult.error.messages });
		}
	}

	render () {
		return (
			<div className="RegisterPage">
				<form className='RegisterForm' onSubmit={(e) => this.handleSubmit(e)}>
					{this.state.errorMessages.map(error =>
						<p className="ErrorMessage" key={error}>{error}</p>
					)}
					<label>
						Name:<br/>
						<input type="text" value={this.state.name} onChange={(evt) => this.setState({name: evt.target.value})} />
						<br/>Email:<br/>
						<input type="text" value={this.state.email} onChange={(evt) => this.setState({email: evt.target.value})} />
						<br/>Password:<br/>
						<input type="password" value={this.state.password} onChange={(evt) => this.setState({password: evt.target.value})} />
						<br/>Retype password:<br/>
						<input type="password" value={this.state.passwordConf} onChange={(evt) => this.setState({passwordConf: evt.target.value})} />
					</label><br/>
					<input type="submit" value="Register" />
				</form>
			</div>
		);
	}
}

export default RegisterPage;
