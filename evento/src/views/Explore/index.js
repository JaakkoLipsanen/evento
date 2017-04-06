import React, { Component } from 'react';

import EventCard from '../../components/EventCard';
import './Explore.css';

class Explore extends Component {
	constructor(props) {
		super(props);
		this.state = { events: [] };
	}

	componentDidMount() {
		fetch('/events')
		.then(response => response.json())
		.then(events => {
			this.setState({ events: events });
		});
	}

	get filteredEvents() {
		return this.props.filterEvents(this.state.events);
	}

	render() {
		return (
			<div className="Explore">
				<div className="event-card-list">
					{ this.filteredEvents.map(event => <EventCard key={event.id} event={event} />) }
				</div>
			</div>
		);
	}
}

export default Explore;
