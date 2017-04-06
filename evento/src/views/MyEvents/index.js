import React, { Component } from 'react';
import Cookie from 'js-cookie';
import EventCard from '../../components/EventCard';
import './MyEvents.css';

class MyEvents extends Component {
	constructor() {
		super();
		this.state = { events: [] };
	}

	componentDidMount() {
		const userId = Cookie.get('userId');
		const authToken = Cookie.get('auth_token');

		fetch(`/users/${userId}/events`, {
			headers: { 'Authorization': authToken }
		}).then(response => response.json())
		.then(events => {
			this.setState({ events: events });
		});
	}

	render() {
		return (
			<div className="MyEvents">
				<h1>My Events: </h1>
				<div className="event-card-list">
					{ this.state.events.map(event =>
						<EventCard
							key={event.id}
							event={event}
							onClick={() => this.props.history.push(`/event/${event.id}`)}/>)
					}
				</div>
			</div>
		);
	}
}

export default MyEvents;
