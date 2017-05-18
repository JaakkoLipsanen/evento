import React, { Component } from 'react';

import api from '../../api';
import EventCard from '../../components/EventCard';
import './MyEvents.css';

class MyEvents extends Component {
	constructor() {
		super();
		this.state = {
			events: [],
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
			this.setState({ events: result.payload.events });
		}
		else {
			this.setState({ errorMessage: result.error.message });
		}
	}

	render() {
		if(this.state.errorMessage !== null) {
			return <h4>{this.state.errorMessage}</h4>
		}

		return (
			<div className="MyEvents">
				<h2>You are attending to the following events</h2>
				<div className="event-card-list">
					{ this.filteredEvents.map(event =>
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
