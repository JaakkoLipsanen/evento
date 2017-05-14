import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import api from '../../../../api';
import './RegisterForm.css';

class RegisterForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			passwordConf: '',

			fieldErrors: {},
			errorMessages: []
		};
	}

	async register() {
		if (this.state.password !== this.state.passwordConf) {
			this.state.fieldErrors.passwordConf = "Passwords do not match";
			this.forceUpdate();
			return;
		}

		const registerResult = await api.register(this.state.name, this.state.email, this.state.password);
		if(registerResult.success) {
			// After succsesiful register, sign in
			const signInResult = await api.signin(this.state.email, this.state.password);
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
			<div className="RegisterForm">
				<form onSubmit={(e) => this.handleSubmit(e)}>
					{this.state.errorMessages.map(error =>
						<p className="ErrorMessage" key={error}>{error}</p>
					)}
					<TextField
						type="text"
						floatingLabelText="name"
						value={this.state.name}
						onChange={(evt) => this.setState({ name: evt.target.value })} />

					<br/>
					<TextField
						type="text"
						floatingLabelText="e-mail"
						value={this.state.email}
						onChange={(evt) => this.setState({ email: evt.target.value })} />

					<br/>
					<TextField
						type="password"
						floatingLabelText="password"
						value={this.state.password}
						onChange={(evt) => this.setState({ password: evt.target.value })} />

					<br/>
					<TextField
						type="password"
						floatingLabelText="password confirmation"
						errorText={this.state.fieldErrors.passwordConf}
						value={this.state.passwordConf}
						onChange={(evt) => this.setState({ passwordConf: evt.target.value })} />

					<br/>
					<RaisedButton
						label="Register"
						primary={true}
						fullWidth={true}
						onClick={() => this.register()} />
				</form>
			</div>
		);
	}
}

export default RegisterForm;
