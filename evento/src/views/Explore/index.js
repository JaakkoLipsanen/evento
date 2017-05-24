import React, { Component } from 'react';

import api from '../../api';
import EventCard from '../../components/EventCard';
import './Explore.css';

class Explore extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
			errorMessage: null
		};
	}

	get filteredEvents() {
		return this.props.filterEvents(this.state.events);
	}

	async componentDidMount() {
		const result = await api.getEvents();
		if(result.success) {
			const upcomingEvents = result.payload.events
				.filter(e => Date.parse(e.time) > Date.now());
			this.setState({ events: upcomingEvents });
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
			<div className="Explore">
				<div className="event-card-list">
					{ this.filteredEvents.map(event =>
						<EventCard
							key={event.id}
							event={event}
							onClick={() => this.props.onEventSelected(event) }
						/>
					)}
				</div>
			</div>
		);
	}
}

export default Explore;
