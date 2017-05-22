import React, { Component } from 'react';
import { CardTitle } from 'material-ui/Card';

import Popup from '../../components/Popup';
import Map from './components/Map';
import AttendeeList from './components/AttendeeList';
import AttendButton from './components/AttendButton';

import { getRelativeDateTime } from '../../helper'
import api from '../../api';
import session from '../../session';
import './EventPopup.css';

const EventImage = ({ src }) => (
	<div style={{
		backgroundImage: `url(${src})`,
		paddingTop: "49%",
		maxHeight: "400px",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center"
	}} />
);

class EventPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			event: null,
			attendees: [],
			errorMessage: null
		};
	}

	reset() {
		this.setState({
			event: null,
			attendees: [],
			errorMessage: null
		});
	}

	show(event) {
		this.reset();
		this.setState(
			{ event: event },
			() => this.fetchAttendees()
		);

		this.popup.show();
	}

	close() {
		this.popup.close();
	}

	// is user attending this current event
	isUserAttending() {
		const user = session.getUser();
		if(!user || !this.state.attendees) {
			return false;
		}

		return this.state.attendees.some(attendee => attendee.id === user.id);
	}

	async fetchAttendees() {
		const result = await api.getAttendees(this.state.event.id);
		if(!result.success) {
			this.setState({ errorMessage: result.error.message });
			return;
		}

		this.setState({ attendees: result.payload.attendees });
	}

	async updateIsAttending(isAttending) {
		const result = await api.updateIsAttending(this.state.event.id, isAttending);
		if(result.success) {
			// If successful attending, then re-fetch attendees
			this.fetchAttendees();

			// so, we are too lazy to re-fetch it so lets just manually change the counter :P
			const event = this.state.event;
			event.attendee_count += isAttending ? 1 : -1;
			this.setState({ event: event });
		}
		else {
			this.setState({ errorMessage: result.error.message });
		}
	}

	render() {
		return (
			<div className="EventPopup">
				<Popup
					ref={(popup) => this.popup = popup}
					closeOnOutsideClick={true}
				>
					<span>{ this.state.errorMessage }</span>
					{ this.getContent() }
				</Popup>
			</div>
		);
	}

	getContent() {
		const { event, attendees } = this.state;
		if(!event) {
			return <p>loading...</p>
		}

		const titleStyle = { textAlign: "left", padding: "0px" };
		const timeAndLocation = `${getRelativeDateTime(event.time)} @ ${event.location}`;

		return (
			<div>
				<EventImage src={event.image} />

				<div className="content-container">
					<div className="left-bar">
						<CardTitle title={event.title} subtitle={timeAndLocation} style={titleStyle} />
						<p>{ event.description }</p>
					</div>
					<div className="right-bar">
						<Map event={event} size={{ width: 256, height: 164 }} />
						<AttendButton
							onChange={(attending) => this.updateIsAttending(attending) }
							isAttending={this.isUserAttending()}
						/>

						<AttendeeList event={event} attendees={attendees} />
					</div>
				</div>
			</div>
		);
	}
}

export default EventPopup;
