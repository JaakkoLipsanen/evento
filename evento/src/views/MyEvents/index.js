import React, { Component } from 'react';

import api from '../../api';
import EventCard from '../../components/EventCard';
import './MyEvents.css';

class MyEvents extends Component {
	constructor() {
		super();
		this.state = {
			events: [],
			pastEvents: [],
			errorMessage: null
		};
	}

	get filteredEvents() {
		return this.props.filterEvents(this.state.events);
	}

	componentDidMount() {
		this.fetchEvents();
	}

	async fetchEvents() {
		// gets the currently logged in user's events
		const result = await api.getUserEvents();
		if(result.success) {
			const upcomingEvents = result.payload.events
				.filter(e => Date.parse(e.time) > Date.now());
			const pastEvents = result.payload.events
				.filter(e => Date.parse(e.time) <= Date.now());

			this.setState({ events: upcomingEvents, pastEvents: pastEvents });
		}
		else {
			this.setState({ errorMessage: result.error.message });
		}
	}

	render() {
		if(this.state.errorMessage !== null) {
			return <h4>{this.state.errorMessage}</h4>
		}

		let upcomingHeader = "You are attending to the following events";
		if (this.state.events.length === 0) {
			upcomingHeader = "You have no upcoming events";
		} else if (this.filteredEvents.length === 0) {
			upcomingHeader = "None of your upcoming events matched the query";
		}

		const pastHeader = this.state.pastEvents.length > 0 ?
			"Your past events" : "";

		return (
			<div className="MyEvents">
				<h2>{ upcomingHeader }</h2>
				<div className="event-card-list">
					{ this.filteredEvents.map(event =>
						<EventCard
							key={event.id}
							event={event}
							onClick={() => this.props.onEventSelected(event) }
						/>)
					}
				</div>
				<h2>{ pastHeader }</h2>
				<div className="event-card-list">
					{ this.state.pastEvents.map(event =>
						<EventCard
							key={event.id}
							event={event}
							onClick={() => this.props.onEventSelected(event) }
						/>)
					}
				</div>
			</div>
		);
	}
}

export default MyEvents;
