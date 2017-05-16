import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import './TabContainer.css';

class TabContainer extends Component {
	constructor(props) {
		super(props);

		const selected = this.props.tabs.find(tab => tab.path === props.path);
		this.state = { selected: selected };
	}

	onTabClick(tab) {
		if (tab === this.state.selected) return;

		this.setState({ selected: tab });
		this.props.onSelectedTabChange(tab);
	}

	render() {
		return (
			<Tabs
				value={this.state.selected}
				onChange={(tab) => this.onTabClick(tab)}
				style={{ backgroundColor: "transparent" }}
				tabItemContainerStyle={{ backgroundColor: "transparent" }}
			>
				{ this.props.tabs.map(tab =>
					<Tab
						key={tab.title}
						label={tab.title}
						value={tab}
						style={{
							fontWeight: "500",
							fontSize: "18px",
							backgroundColor: "transparent",
						 	opacity: this.state.selected !== tab ? 0.75 : 1
						}}
					/>
				)}
			</Tabs>
		);
	}
}

export default TabContainer;
