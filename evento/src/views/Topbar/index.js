import React, { Component } from 'react';

import ProfileMenu from './components/ProfileMenu';
import SearchBar from '../../components/SearchBar';
import TabContainer from '../../components/TabContainer';
import './Topbar.css';

// hard coded tabs!
const tabs = [
	{ title: "Explore", path: "/" },
	{ title: "My Events", path: "/events" }
];

class Topbar extends Component {
	constructor() {
		super();
		this.state = { };
	}

	render() {
		return (
			<div className="Topbar">
				<div className="topbar-content">
					<div className="searchbar-and-menu-container">
						<SearchBar onQueryChange={this.props.onSearchBarChange} />
						<ProfileMenu />
					</div>

					<TabContainer
						tabs={tabs}
						path={this.props.location.pathname}
						onSelectedTabChange={(tab) => this.props.history.push(tab.path)}/>
				</div>
			</div>
		);
	}
}

export default Topbar;
