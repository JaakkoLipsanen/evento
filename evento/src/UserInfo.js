import React, { Component } from 'react';
import './UserInfo.css'

class UserInfo extends Component {
	render() {
		return (
			<div className="UserInfo">
				<h4>{ this.props.user.name } </h4>
				<h4>{ this.props.user.email } </h4>
				<h4>{ this.props.user.id } </h4>
			</div>
		);
	}
}

export default UserInfo;
