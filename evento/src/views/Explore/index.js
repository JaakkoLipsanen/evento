import React, { Component } from 'react';

import EventCard from '../../components/EventCard';
import './Explore.css';

class Explore extends Component {
	componentWillMount() {
		this.setState({ events: [] });

		fetch('/events')
		.then(response => response.json())
		.then(events => {
			this.setState({ events: events });
		});
	}

	render() {
		return (
			<div className="Explore">
				<div className="event-card-list">
					{this.state.events.map(event => <EventCard key={event.id} event={event} /> )}
				</div>
			</div>
		);
	}
}

export default Explore;
