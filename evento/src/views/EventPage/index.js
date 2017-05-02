import React, { Component } from 'react';
import api from '../../api';

import './EventPage.css';

const UserInfo = ({ name }) => (
	<div className="UserInfo">
		<h4>{ name }</h4>
	</div>
);

const AttendButton = (props) => (
	<button className='Attend' onClick={props.onClick}>
		Attend
	</button>
);

const DoNotAttendButton = (props) => (
	<button className='DoNotAttend' onClick={props.onClick}>
		Do not attend
	</button>
);

class EventPage extends Component {
	constructor() {
		super();
		this.state = {
			event: null,
			attendees: [],
			errorMessage: null
		};
	}


	async componentDidMount() {
		const eventId = this.props.match.params.eventId;

		// get event
		if(!await this.fetchEvent(eventId)) {
			return;
		}

		// get event attendees
		if(!await this.fetchAttendees(eventId)) {
			return;
		}
	}

	async fetchEvent(eventId) {
		const result = await api.getEvent(eventId);
		if(!result.success) {
			this.setState({ errorMessage: result.error.message });
			return false;
		}

		this.setState({ event: result.payload.event });
		return true;
	}

	async fetchAttendees(eventId) {
		const result = await api.getAttendees(eventId);
		if(!result.success) {
			this.setState({ errorMessage: result.error.message });
			return false;
		}

		this.setState({ attendees: result.payload.attendees });
		return true;
	}

	updateIsAttending(isAttending) {
		const method = isAttending ? 'POST' : 'DELETE';
		const eventId = this.props.match.params.eventId;
		fetch(`/events/${eventId}/attendees`, {
			method: method,
			headers: { 'Authorization': Cookie.get('auth_token') }
		})
		.then(response => {
			if (!response.ok) return Promise.reject();
			// If successiful attending, re-fetch attendees
			this.fetchAttendees();
		})
		.catch(() => this.setState({ errorMessage: "Something went wrong" }));
	}

	isUserAttending() {
		const userCookie = Cookie.get('user');
		if (!userCookie) {
			 return false;
		}

		const user = JSON.parse(userCookie);
		return this.state.attendees.some(attendee => attendee.id === user.id);
	}

	render() {
		if (this.state.errorMessage !== null) {
			return <h4>{this.state.errorMessage}</h4>
		} else if (this.state.event === null) {
			return <h4>loading..</h4>
		}

		let attendButton = null;
		if (this.isUserAttending()) {
			attendButton = <DoNotAttendButton onClick={() => this.updateIsAttending(false)}/>
		} else {
			attendButton = <AttendButton onClick={() => this.updateIsAttending(true)}/>
		}
		return (
			<div className="EventPage">
				<h4>{this.state.event.title}</h4>
				<p>{this.state.event.description}</p>
				<p>{this.state.event.location}</p>
				<p>{this.state.event.time}</p>
				{ attendButton }
				<h4>Attendees</h4>
				<ul>
					{this.state.attendees.map(attendee => (
						<li key={attendee.id}><UserInfo name={attendee.name} /></li>
					))}
				</ul>
			</div>
		);
	}
}

export default EventPage;
