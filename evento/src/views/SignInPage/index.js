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
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
			this.setState({ errorMessage: 'Invalid credentials' });
		}).then(authKey => {
			Cookie.set('auth_token', authKey.auth_token);

			// User id needs to be fetched and saved to cookie
			fetch('/users')
			.then(response => response.json())
			.then(users => users.filter(user => user.email === this.state.email)[0])
			.then(user => Cookie.set('userId', user.id))

			// Move to front page after successiful sign in
			this.props.history.push('/')
		});
	}

	render() {
		return (
			<form className='SignInPage' onSubmit={(e) => this.handleSubmit(e)}>
				<p>{this.state.errorMessage}</p>
				<label>
					Email:<br/>
					<input type="text" value={this.state.email} onChange={(evt) => this.setState({email: evt.target.value})} />
					<br/>Password:<br/>
					<input type="password" value={this.state.password} onChange={(evt) => this.setState({password: evt.target.value})} />
				</label><br/>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}

export default SignInPage;
