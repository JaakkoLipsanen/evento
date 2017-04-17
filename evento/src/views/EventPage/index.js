import React, { Component } from 'react';

import './EventPage.css';

const UserInfo = ({ name }) => (
	<div className="UserInfo">
		<h4>{ name }</h4>
	</div>
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

	render() {
		if (this.state.errorMessage !== null) {
			return <h4>{this.state.errorMessage}</h4>
		} else if (this.state.event === null) {
			return <h4>loading..</h4>
		}

		return (
			<div className="EventPage">
				<h4>{this.state.event.title}</h4>
				<p>{this.state.event.description}</p>
				<p>{this.state.event.location}</p>
				<p>{this.state.event.time}</p>

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
