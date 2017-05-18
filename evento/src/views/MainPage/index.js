import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';

import Topbar from '../Topbar';
import Explore from '../Explore';
import MyEvents from '../MyEvents';

import NewEventPopup from '../NewEventPopup';
import EventPopup from '../EventPopup';

import './MainPage.css';

// returns filtering function for the given filter query
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

	showEvent(event) {
		this.eventPopup.show(event);
	}

	onNewEventCreated(event) {
		// when new event is creted, we want to re-load/mount the Explore/MyEvents.
		// ofc better would be just to inform it but w/e :P anyways, when key changes,
		// the component is re created so lets just change the key
		this.key = Math.random();
		this.forceUpdate();

		// show the event popup with small delay
		setTimeout(() => this.showEvent(event), 600);
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
							onEventSelected={(event) => this.showEvent(event) }
							filterEvents={this.state.filterer}
							key={this.key}
						/>
					)} />
					<Route exact path='/events' render={() => (
						<MyEvents
							onEventSelected={(event) => this.showEvent(event) }
							filterEvents={this.state.filterer}
							key={this.key}
						/>
					)} />
				</Switch>

				<FloatingActionButton className="new-event-button" onClick={() => this.newEventPopup.show()}>
					<ContentAddIcon />
				</FloatingActionButton>

				<EventPopup ref={(eventPopup) => this.eventPopup = eventPopup } />
				<NewEventPopup
					onCreated={(event) => this.onNewEventCreated(event) }
					ref={(popup) => this.newEventPopup = popup }
				 />
			</div>
		);
	}
}

export default MainPage;
