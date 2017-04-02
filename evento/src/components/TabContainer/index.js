import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './TabContainer.css';

const Tab = (props) => {
	return (
		<div className="Tab">
			<h4>
				<Link to={props.path} onClick={() => props.onClick(props.id)}> {props.title} </Link>
			</h4>
		</div>
	);
};

class TabContainer extends Component {
	constructor() {
		super();
		this.state = { selectedId: 1 };
	}

	onTabChange(tabId) {
		this.setState({ selectedId: tabId });
	}

	render() {
		return (
			<div className="TabContainer">
				{this.props.tabs.map(tab =>
					<Tab
						key={tab.title}
						title={tab.title}
						path={tab.path}
						id={tab.id}
						status={tab.id === this.state.selectedId ? 'selected' : 'not-selected'}
						onClick={(e) => this.onTabChange(e)} 
					/> )}
			</div>
		);
	}
}

export default TabContainer;
