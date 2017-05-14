import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import api from '../../../../api';;
import './SignInForm.css'

class SignInForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		 	errorMessage: ''
		};
	}

	async signin() {
		const result = await api.signin(this.state.email, this.state.password);
		if(result.success) {
			this.props.onSignIn();
		}
		else {
			this.setState({ errorMessage: result.error.message })
		}
	}

	render() {
		const textFieldStyle = { height: "62px" };
		const floatingLabelStyle = { top: "28px" };

		return (
			<div className='SignInForm'>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<TextField
						type="text"
						floatingLabelText="e-mail"
						value={this.state.email}
						onChange={(evt) => this.setState({ email: evt.target.value })} />

					<br/>
					<TextField
						type="password"
						floatingLabelText="password"
						errorText={this.state.errorMessage}
						value={this.state.password}

						onKeyPress={e => e.key === "Enter" && this.signin()}
						onChange={(evt) => this.setState({ password: evt.target.value })}

						style={textFieldStyle}
						floatingLabelStyle={floatingLabelStyle} />
					<br/>

					<RaisedButton
						label="Sign in"
						primary={true}
						fullWidth={true}
						onClick={() => this.signin()} />
				</form>
			</div>
		);
	}
}

export default SignInForm;
