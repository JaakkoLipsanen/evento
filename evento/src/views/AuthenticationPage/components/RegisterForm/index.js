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

			fieldErrors: {}, // contains error messages for name, email, password etc
			errorMessage: null // contains the non-field specific error message
		};
	}

	async register() {
		if (this.state.password !== this.state.passwordConf) {
			this.setState({ fieldErrors: { passwordConf: "Passwords do not match" }});
			return;
		}

		const registerResult = await api.register(this.state.name, this.state.email, this.state.password);
		if(registerResult.success) {
			// After succsesful register, sign in
			const signInResult = await api.signin(this.state.email, this.state.password);
			if(signInResult.success) {
				this.props.onSignIn();
			}
		}
		else {
			this.setErrors(registerResult.error);
		}
	}

	setErrors(error) {
		// singular error, if the problem is "Server not responding" for example
		this.setState({ errorMessage: error.message });

		// errors with the submitted fields
		if(error.messages && error.messages.raw) {
			const raw = error.messages.raw;
			const getErr = (field) => field ? field[0] : undefined;

			console.log(this.nameField);
			this.setState({
				fieldErrors: {
					name: getErr(raw.name),
					email: getErr(raw.email),
					password: getErr(raw.password)
				}
			});
		}
	}

	render () {
		const styles = {
			style: { height: "62px" },
			inputStyle: { "margin-top": "7px" },
			floatingLabelStyle: { top: "28px" }
		};

		return (
			<div className="RegisterForm">
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<p className="ErrorMessage">{ this.state.errorMessage }</p>

					<TextField
						floatingLabelText="name"
						errorText={this.state.fieldErrors.name}
						value={this.state.name}

						onChange={(evt) => this.setState({ name: evt.target.value })}
						{...styles} />

					<br/>
					<TextField
						floatingLabelText="e-mail"
						errorText={this.state.fieldErrors.email}
						value={this.state.email}

						onChange={(evt) => this.setState({ email: evt.target.value })}
						{...styles} />

					<br/>
					<TextField
						type="password"
						floatingLabelText="password"
						errorText={this.state.fieldErrors.password}
						value={this.state.password}

						onChange={(evt) => this.setState({ password: evt.target.value })}
						{...styles} />

					<br/>
					<TextField
						type="password"
						floatingLabelText="password confirmation"
						errorText={this.state.fieldErrors.passwordConf}
						value={this.state.passwordConf}

						onKeyPress={e => e.key === "Enter" && this.register()}
						onChange={(evt) => this.setState({ passwordConf: evt.target.value })}
						{...styles} />

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
