import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import SearchBar from '../../components/SearchBar';
import TabContainer from '../../components/TabContainer';
import Explore from '../Explore';
import MyEvents from '../MyEvents';
import './MainPage.css';

// hard coded tabs!
const tabs = [
	{ title: "Explore", path: "/" },
	{ title: "My Events", path: "/events" }
];

class MainPage extends Component {
	onPathChange(path) {
		this.props.history.push(path)
	}

	render() {
		return (
			<div className="MainPage">
				<SearchBar />
				<TabContainer
					tabs={tabs}
					path={this.props.location.pathname}
					onPathChange={(path) => this.onPathChange(path)}/>

				<Switch>
					<Route exact path='/' component={Explore} />
					<Route exact path='/events' component={MyEvents} />
				</Switch>
			</div>
		);
	}
}

export default MainPage;
