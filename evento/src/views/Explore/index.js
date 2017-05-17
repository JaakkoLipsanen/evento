import React, { Component } from 'react';

import api from '../../api';
import EventCard from '../../components/EventCard';
import EventPopup from '../EventPopup';
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
			this.setState({ events: result.payload.events });
		}
		else {
			this.setState({ errorMessage: result.error.message });
		}
	}

	showEvent(event) {
		this.eventPopup.show(event);
		// this.props.history.push(`/events/${event.id}`)
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
							onClick={() => this.showEvent(event) }
						/>
					)}
				</div>

				<EventPopup ref={(eventPopup) => this.eventPopup = eventPopup } />
			</div>
		);
	}
}

export default Explore;
