import React, { Component } from 'react';

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

	async handleSubmit(evt) {
		evt.preventDefault();

		const result = await api.signin(this.state.email, this.state.password);
		if(result.success) {
			this.props.onSignIn();
		}
		else {
			this.setState({ errorMessage: result.error.message })
		}
	}

	render() {
		return (
			<div className='SignInForm'>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<p className="ErrorMessage">{this.state.errorMessage}</p>
					<label>
						Email:<br/>
						<input type="text" value={this.state.email} onChange={(evt) => this.setState({email: evt.target.value})} />
						<br/>Password:<br/>
						<input type="password" value={this.state.password} onChange={(evt) => this.setState({password: evt.target.value})} />
					</label><br/>
				<input type="submit" value="Sign in" />
				</form>
			</div>
		);
	}
}

export default SignInForm;
