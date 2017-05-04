import React, { Component } from 'react';
import api from '../../api';
import session from '../../session';

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

	async updateIsAttending(isAttending) {
		const eventId = this.props.match.params.eventId;
		const result = await api.updateIsAttending(eventId, isAttending);
		if(result.success) {
			// If successful attending, then re-fetch attendees
			this.fetchAttendees(eventId);
		}
		else {
			this.setState({ errorMessage: result.error.message });
		}
	}

	isUserAttending() {
		const user = session.getUser();
		if(!user) {
			return false;
		}

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
