import React, { Component } from 'react';
import './TabContainer.css';

const Tab = ({title, onClick, isSelected}) => {
	const classname = isSelected ? "Tab selected" : 'Tab';
	return (
		<div className={classname} onClick={() => onClick()}>
			<h4> {title} </h4>
		</div>
	);
};

class TabContainer extends Component {
	constructor(props) {
		super(props);
		const selected = this.props.tabs.filter((e) => e.path === props.path)[0];
		this.state = { selected: selected };
	}

	onTabChange(tab) {
		this.setState({ selected: tab });
		this.props.onPathChange(tab.path);
	}

	render() {
		return (
			<div className="TabContainer">
				{this.props.tabs.map(tab =>
					<Tab
						key={tab.title}
						title={tab.title}
						isSelected={tab === this.state.selected}
						onClick={() => this.onTabChange(tab)}
					/> )}
			</div>
		);
	}
}

export default TabContainer;
