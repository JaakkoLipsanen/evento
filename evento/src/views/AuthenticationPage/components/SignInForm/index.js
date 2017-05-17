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
		 	errorMessage: '',

			isSigningIn: false,
		};
	}

	async signin() {
		this.setState({ isSigningIn: true });

		const result = await api.signin(this.state.email, this.state.password);
		if(result.success && this.props.onSignIn) {
			this.props.onSignIn();
		}
		else {
			this.setState({ errorMessage: result.error.message })
		}

		// if result is success, then don't set "isSigningIn" back to false again
		// also, add some delay so that it looks a bit better (doesnt pop in/out instantly)
		setTimeout(() => 	this.setState({ isSigningIn: result.success }), 300);

	}

	render() {
		const styles = {
			style: { height: "62px" },
			inputStyle: { "margin-top": "7px" },
			floatingLabelStyle: { top: "28px" },
			errorStyle: { bottom: "12px" }
		};

		return (
			<div className='SignInForm'>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<TextField
						type="text"
						floatingLabelText="e-mail"
						value={this.state.email}
						onChange={(evt) => this.setState({ email: evt.target.value })}
						{...styles}
						style={{ ...styles.style, transform: "translateY(8px)" }}/>

					<br/>
					<TextField
						type="password"
						floatingLabelText="password"
						errorText={this.state.errorMessage}
						value={this.state.password}

						onKeyPress={e => e.key === "Enter" && this.signin()}
						onChange={(evt) => this.setState({ password: evt.target.value })}
						{...styles} />
					<br/>

					<RaisedButton
						label="Sign in"
						primary={true}
						fullWidth={true}
						disabled={this.state.isSigningIn}
						onClick={() => this.signin()} />
				</form>
			</div>
		);
	}
}

export default SignInForm;
