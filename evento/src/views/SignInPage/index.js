import React, { Component } from 'react';

import api from '../../api';
import './SignInPage.css'

class SignInPage extends Component {
	constructor() {
		super();
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
			// Move to front page after successful sign in
			this.props.history.push('/')
		}
		else {
			this.setState({ errorMessage: result.error.message })
		}
	}

	render() {
		return (
			<div className='SignInPage'>
				<form className='SignInForm' onSubmit={(e) => this.handleSubmit(e)}>
					<p className="ErrorMessage">{this.state.errorMessage}</p>
					<label>
						Email:<br/>
						<input type="text" value={this.state.email} onChange={(evt) => this.setState({email: evt.target.value})} />
						<br/>Password:<br/>
						<input type="password" value={this.state.password} onChange={(evt) => this.setState({password: evt.target.value})} />
					</label><br/>
				<input type="submit" value="Sign in" />
				</form>
				<p className="Link" onClick={() => this.props.history.push('/register')}>Not yet registered?</p>
			</div>
		);
	}
}

export default SignInPage;
