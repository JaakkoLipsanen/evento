import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { CardTitle } from 'material-ui/Card';
import { Scrollbars } from 'react-custom-scrollbars';

import { enableBodyScrolling, disableBodyScrolling, getRelativeDateTime } from '../../helper'
import api from '../../api';
import session from '../../session';
import './EventPopup.css';

const AttendeesList = ({ event, attendees = [] }) => (
	<div className="AttendeesList">
		<h4 className="header">
			Attendees

			<span className="attendee-count">
				{` (${event.attendee_count})`}
			</span>
		</h4>

		<Scrollbars className="attendee-container" autoHide>
			{ attendees.map(attendee => (
				<li key={attendee.id}>
					<p>{ attendee.name }</p>
				</li>
			))}
		</Scrollbars>
	</div>
);

/* static google maps centered on the event location */
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
				style={{ width: `${size.width}px`, height: `${size.height}px` }}
			/>
		</a>
	);
}

/* state-ly component because of the on hover behavior */
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
				label={
					isAttending ?
						(hovering ? "Unattend" : "Attending") :
						(hovering ? "Attend" : "Not attending")
				}

				onClick={() => onChange(!isAttending) }
				onMouseOver={() => this.setState({ hovering: true }) }
				onMouseLeave={() => this.setState({ hovering: false }) }

				primary={showPrimaryColorByDefault}
				secondary={!showPrimaryColorByDefault}

				fullWidth={true}
				overlayStyle={{ backgroundColor: "transparent" }}
			/>
		);
	}
}

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
			errorMessage: null,

			open: false
		};
	}

	reset() {
		this.setState({
			attendees: [],
			event: event,
			errorMessage: null,

			open: false
		});
	}

	show(event) {
		this.reset();
		this.setState(
			{ event: event, open: true },
			() => this.fetchAttendees()
		);

		/* disable body scrolling (aka scrolling on the main page)
		   and save the body scroll value to this.windowScroll */
		this.windowScroll = disableBodyScrolling();
	}

	close() {
		this.setState({ open: false })
		enableBodyScrolling(this.windowScroll); // re-enable body scrolling
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

	isUserAttending() {
		const user = session.getUser();
		if(!user || !this.state.attendees) {
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
				<Paper
					className="popup-container"
					zDepth={5}
					style={popupDivStyle}
					onClick={e => e.stopPropagation() }
				>
					<Scrollbars
						autoHide
						autoHeight
						autoHeightMin={100}
						autoHeightMax={"96.5vh"}
					>
						<span>{ this.state.errorMessage }</span>
						{ this.getContent() }
					</Scrollbars>
				</Paper>
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

						<AttendeesList event={event} attendees={attendees} />
					</div>
				</div>
			</div>
		);
	}
}

export default EventPopup;
