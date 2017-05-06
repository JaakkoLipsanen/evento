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

		const result = await api.register(this.state.name, this.state.email, this.state.password);
		if(result.success) {
			// After successful register, redirect to sign in page
			this.props.history.push('/signin')
		}
		else {
			this.setState({ errorMessages: result.error.messages });
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
				<p className="Link" onClick={() => this.props.history.push('/signin')}>Not yet registered?</p>
			</div>
		);
	}
}

export default RegisterPage;
