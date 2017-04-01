import React, { Component } from 'react';

import UserInfo from '../../components/UserInfo';
import './Explore.css';

class Explore extends Component {
	componentWillMount() {
		this.setState({ users: [] });

		fetch('/users')
		.then(response => response.json())
		.then(users => {
			this.setState({ users: users });
		});
	}

	render() {
		return (
			<div className="Explore">
				<h1>Users: </h1>
				{this.state.users.map(user => <UserInfo key={user.id} user={user} /> )}
			</div>
		);
	}
}

export default Explore;
