import React, { Component } from 'react';
import Cookie from 'js-cookie';
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

	componentDidMount() {
		this.fetchAttendees();
	}

	fetchAttendees() {
		const eventId = this.props.match.params.eventId;

		fetch(`/events/${eventId}`)
		.then(response => {
			if (response.ok) return response.json();
			return Promise.reject();
		})
		.then(event => this.setState({ event: event }))
		.catch(() => this.setState({ errorMessage: "Something went wrong" }));

		fetch(`/events/${eventId}/attendees`)
		.then(response => response.json())
		.then(attendees => {
			this.setState({ attendees: attendees });
		});
	}

	onAttendButtonClick() {
		const eventId = this.props.match.params.eventId;

		fetch(`/events/${eventId}/attendees`, {
			method: 'POST',
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
		return this.state.attendees.some(attendee => attendee.id == user.id);
	}

	render() {
		if (this.state.errorMessage !== null) {
			return <h4>{this.state.errorMessage}</h4>
		} else if (this.state.event === null) {
			return <h4>loading..</h4>
		}

		let attendButton = null;
		if (this.isUserAttending()) {
			attendButton = <DoNotAttendButton onClick={console.log}/>
		} else {
			attendButton = <AttendButton onClick={() => this.onAttendButtonClick()}/>
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
