import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Topbar from '../Topbar';
import Explore from '../Explore';
import MyEvents from '../MyEvents';
import NewEventPopup from '../NewEventPopup';
import './MainPage.css';

const createEventFilterer = (filterQuery) => {
	return (events) => {
		const toString = event => [
			event.title, event.description, event.category.name,
			event.creator.name, event.location]
			.join('|') // so that every field is checked individually
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
				<Topbar
					{...this.props}
					onSearchBarChange={query => this.updateFilter(query)} />

				<Switch>
					<Route exact path='/' render={() => (
						<Explore
							filterEvents={this.state.filterer}
							history={this.props.history}
						/>)}
					/>
					<Route exact path='/events' component={MyEvents} />
				</Switch>

				<FloatingActionButton className="new-event-button" onClick={() => this.newEventPopup.show()}>
					<ContentAdd />
				</FloatingActionButton>

				<NewEventPopup ref={(popup) => this.newEventPopup = popup} />
			</div>
		);
	}
}

export default MainPage;
