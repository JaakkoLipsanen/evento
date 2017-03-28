import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './TabContainer.css';

const Tab = (props) => {
	return (
		<div>
			<h4>
				<Link to={props.path}> {props.title} </Link>
			</h4>
		</div>
	);
};

class TabContainer extends Component {
	render() {
		return (
			<div className="TabContainer">
				{this.props.tabs.map(tab => <Tab key={tab.title} title={tab.title} path={tab.path} /> )}
			</div>
		);
	}
}

export default TabContainer;
