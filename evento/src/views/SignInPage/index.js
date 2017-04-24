import React, { Component } from 'react';
import Cookie from 'js-cookie';
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

	handleSubmit(evt) {
		evt.preventDefault();

		fetch('/authenticate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
			})
		})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				return Promise.reject('Invalid credentials');
			}
		})
		.then(json => {
			Cookie.set('auth_token', json.auth_token);
			Cookie.set('user', JSON.stringify(json.user))

			// Move to front page after successiful sign in
			this.props.history.push('/')
		})
		.catch(error => this.setState({ errorMessage: error}));
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
