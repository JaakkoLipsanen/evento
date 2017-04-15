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

const createEventFilterer = (filterQuery) => {
	return (events) => {
		const toString = event => [
			event.title, event.description, event.category.name,
			event.creator.name, event.location]
			.join('|')
			.toLowerCase();

		return events.filter(event => toString(event).includes(filterQuery.toLowerCase()));
	}
};

class MainPage extends Component {
	constructor() {
		super();

		// matches all events by default
		this.state = { filterer: (events) => events };
	}

	updateFilter(filterQuery) {
		this.setState({ filterer: createEventFilterer(filterQuery) });
	}

	render() {
		return (
			<div className="MainPage">
				<SearchBar onQueryChange={(query) => this.updateFilter(query)}/>
				<TabContainer
					tabs={tabs}
					path={this.props.location.pathname}
					onSelectedTabChange={(tab) => this.props.history.push(tab.path)}/>

				<Switch>
					<Route exact path='/' render={() => (
						<Explore
							filterEvents={this.state.filterer}
							history={this.props.history}
						/>)}
					/>
					<Route exact path='/events' component={MyEvents} />
				</Switch>
			</div>
		);
	}
}

export default MainPage;
