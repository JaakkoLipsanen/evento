import React, { Component } from 'react';
import UserInfo from './UserInfo.js';
import './App.css'

class App extends Component {
	componentWillMount() {
		this.setState({ users: [] });
		
		fetch('http://evento-api.herokuapp.com/users')
		.then(response => response.json())
		.then(users => {
			this.setState({ users: users });
		});
	}
	
	render() {
		return (
			<div className="App">
				<h1>Users: </h1>
				{this.state.users.map(user => <UserInfo key={user.id} user={user} /> )} 
			</div>
		);
	}	
}

export default App;
