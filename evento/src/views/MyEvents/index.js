import React, { Component } from 'react';
import Cookie from 'js-cookie';
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
	
	fetchEvents() {
		let user = Cookie.get('user');
		const authToken = Cookie.get('auth_token');

		// If userId or authToken is not found do try to fetch events
		if (!user || !authToken) {
			this.setState({ errorMessage: "You are not logged in. Please login again"});
			return;
		}

		user = JSON.parse(user); // Parse user to usable form

		fetch(`/users/${user.id}/events`, { headers: { 'Authorization': authToken }})
		.then(response => response.json())
		.then(events => this.setState({ events: events }))
		.catch(() => this.setState({ errorMessage: "Something went wrong" }));
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
