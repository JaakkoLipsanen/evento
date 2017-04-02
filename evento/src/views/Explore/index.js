import React, { Component } from 'react';

import EventCard from '../../components/EventCard';
import './Explore.css';

class Explore extends Component {
	constructor(props) {
		super(props);
		this.state = { events: [] };
	}

	componentWillMount() {
		fetch('/events')
		.then(response => response.json())
		.then(events => {
			this.setState({ events: events });
		});
	}
	
	isVisible(event, filterQuery) {
		const includedProps = [event.title, event.description, event.category.name, 
			event.creator.name, event.location];

		const cleaned = includedProps
			.filter(prop => typeof prop === 'string')
			.map(prop => prop.toLowerCase());

		return cleaned.some((element) => element.includes(filterQuery.toLowerCase()));
	}

	render() {
		const events = this.state.events;
		const visibleEvents = events.filter(e => this.isVisible(e, this.props.filter));
		return (
			<div className="Explore">
				<div className="event-card-list">
					{ visibleEvents.map(event => <EventCard key={event.id} event={event} />) }
				</div>
			</div>
		);
	}
}

export default Explore;
