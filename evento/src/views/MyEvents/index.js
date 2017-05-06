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
				<h1>My Events: </h1>
				<div className="event-card-list">
					{ this.state.events.map(event =>
						<EventCard
							key={event.id}
							event={event}
							onClick={() => this.props.history.push(`/event/${event.id}`)}
						/>)
					}
				</div>
			</div>
		);
	}
}

export default MyEvents;
