import React, { Component } from 'react';
import api from '../../api';
import session from '../../session';

import Paper from 'material-ui/Paper';
import {CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import './EventPopup.css';

const AttendeesList = ({ event, attendees = [] }) => (
	<div>
		<h4 style={{ fontSize: "16px", fontWeight: "500", opacity: "0.9", marginBottom: "4px" }}>
			Attendees

			<span style={{ fontSize: "12px", fontWeight: "400", position: "relative", bottom: "1px" }}>
				{` (${event.attendee_count})`}
			</span>
		</h4>

		<ul style={{ paddingLeft: "4px", marginTop: "4px", maxHeight: "124px", overflowY: "auto" }}>
			{ attendees.map(attendee => (
				<li key={attendee.id} style={{ listStyleType: "none" }}>
					<p style={{ marginTop: "2px", marginBottom: "2px", fontSize: "14px" }}>
						{ attendee.name }
					</p>
				</li>
			))}
		</ul>
	</div>
);

const Map = ({ event, size = { width: 400, height: 250 } }) => {
	const eventLocation = event.location.replace(' ', '+');

	// google maps api key. I realize that it's not wise to put this in here,
	// but what can you do :D we could do this in back end as well but not really
	// feeling it :P
	const API_KEY = "AIzaSyAEYDif6SXl8ruGqVAUaJasxV9jarDKMk0";
	const query = `
		center=${eventLocation}&
		zoom=11&
		size=${size.width}x${size.height}&
		markers=${eventLocation}&
		key=${API_KEY}`;

	const imagePath = `https://maps.googleapis.com/maps/api/staticmap?${query}`;
	return (
		<a target="_blank" href={`http://maps.google.com/?q=${eventLocation}`}>
			<img
				src={imagePath}
				alt=""
				style={{ width: size.width.toString(), height: size.height.toString() }}
			/>
		</a>
	);
}


class AttendButton extends Component {
	constructor(props) {
		super(props);
		this.state = { hovering: false };
	}

	render() {
		const { onChange, isAttending } = this.props;
		const { hovering } = this.state;

		const showPrimaryColorByDefault = (!isAttending && hovering) || (isAttending && !hovering);
		return (
			<RaisedButton
				className='Attend'
				onClick={() => onChange(!isAttending) }
				primary={showPrimaryColorByDefault}
				secondary={!showPrimaryColorByDefault}
				fullWidth={true}
				onMouseOver={() => this.setState({ hovering: true }) }
				onMouseLeave={() => this.setState({ hovering: false }) }
				overlayStyle={{ backgroundColor: "transparent" }}
				label={
					isAttending ?
						(hovering ? "Unattend" : "Attending") :
						(hovering ? "Attend" : "Not attending")
				}
			/>
		);
	}
}

const EventImage = ({ src }) => (
	<div style={{
		backgroundImage: `url(${src})`,
		paddingTop: "50%",
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
			event: this.props.event || null,
			attendees: [],
			errorMessage: null,

			open: false
		};
	}

	get eventId() {
		return (this.state.event) ? this.state.event.id : this.props.match.params.eventId;
	}

	reset() {
		// this doesn't atm reset start date/time or end time, since they are saved
		// to the state-ly component DateTimePicker. TODO: fix it?
		this.setState({
			/* TODO */
			attendees: [],
			event: event,
			errorMessage: null,

			open: false
		});
	}

	show(event = null) {
		this.reset();
		this.setState({ open: true, event: event });

		this.fetchAttendees();
	}

	close() {
		this.setState({ open: false })
	}

	async componentDidMount() {
	}

	async fetchEvent() {
		const result = await api.getEvent(this.eventId);
		if(!result.success) {
			this.setState({ errorMessage: result.error.message });
			return false;
		}

		this.setState({ event: result.payload.event });
		return true;
	}

	async fetchAttendees() {
		const result = await api.getAttendees(this.eventId);
		if(!result.success) {
			this.setState({ errorMessage: result.error.message });
			return false;
		}

		this.setState({ attendees: result.payload.attendees });
		return true;
	}

	async updateIsAttending(isAttending) {
		const result = await api.updateIsAttending(this.eventId, isAttending);
		if(result.success) {
			// If successful attending, then re-fetch attendees
			this.fetchAttendees();
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
		const parentDivStyle = {
			visibility: this.state.open ? "visible" : "hidden",
			opacity: this.state.open ? 1 : 0
		 };

		// fade the position to the center from above
		const popupDivStyle = { marginTop: this.state.open ? "50vh" : "35vh" };
		return (
			<div className="EventPopup" style={parentDivStyle} onClick={() => this.close()}>
				<h4>{ this.state.errorMessage } </h4>
				<Paper
					className="popup-container"
					zDepth={5}
					style={popupDivStyle}
				>
					{ this.getContent() }
				</Paper>
			</div>
		);
	}

	getContent() {
		const { event, attendees } = this.state;
		if(!event) {
			return <p>loading...</p>
		}

		const timeAndLocation = `${this.formatTime(event.time)} @ ${event.location}`;
		return (
			<div>
				<EventImage src={event.image} />
				<div className="content-container">
					<div className="left-bar">
						<CardTitle title={event.title} subtitle={timeAndLocation} style={{ textAlign: "left", padding: "0px" }} />
						<p>{event.description}</p>
					</div>
					<div className="right-bar">
						<Map event={event} size={ { width: 256, height: 164 }} />
						<AttendButton onChange={(attending) => this.updateIsAttending(attending) } isAttending={this.isUserAttending()} />
						<AttendeesList event={event} attendees={attendees} />
					</div>
				</div>
			</div>
		);
	}

	formatTime(rawEventTime) {
		if (!rawEventTime) {
			return 'Unspecified time';
		}

		const eventTime = moment(rawEventTime)
		const day = this.getRelativeDay(eventTime);
		const time = eventTime.format('HH:mm');

		return `${day} at ${time}`;
	}

	getRelativeDay(date) {
		const currentDay = moment();
		const timeDifference = date.diff(currentDay, 'days');
		if(timeDifference === 0) {
			return "Today";
		}
		else if(timeDifference === 1) {
			return "Tomorrow";
		}
		else if(timeDifference < 7) {
			return date.format('dddd'); // "Friday"
		}
		else {
			return date.format('MMM DD'); // "May 13"
		}
	}
}

export default EventPopup;
