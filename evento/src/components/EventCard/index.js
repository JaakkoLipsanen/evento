import React, { Component } from 'react';

import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import GroupIcon from 'material-ui/svg-icons/social/group';

import moment from 'moment';
import './EventCard.css'

const EventImage = ({ src }) => (
	<div style={{
		backgroundImage: `url(${src})`,
		height: "260px",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center"
	}} />
);

const AttendeesCountIcon = ({ count }) => (
	<div style={{ position: "absolute", right: "12px", height: "36px", opacity: "0.75", display: "inline-block" }}>
		<span>{ count }</span>
		<GroupIcon style={{ marginLeft: "3px", position: "relative", top: "50%", transform: "translateY(-50%)" }} />
	</div>
);

class EventCard extends Component {
	render() {
		const event = this.props.event;
		const timeAndLocation = `${this.formatTime(event.time)} @ ${event.location}`;

		const descriptionStyle= {
			padding: "8px 16px",
			height: "58px",
			overflow: "hidden"
		};

		return (
			<Card className="EventCard" zDepth={2} style={{ width: "400px" }}>
				<CardMedia>
					<EventImage src={event.image} />
				</CardMedia>

				<CardTitle title={event.title} subtitle={timeAndLocation} style={{ padding: "8px" }} />
				<CardText className="card-description" style={descriptionStyle}>
					{event.description}
				</CardText>

				<CardActions>
					<FlatButton label="More Info" onClick={() => this.props.onClick(event) } />
					<AttendeesCountIcon count={event.attendee_count} />
				</CardActions>
			</Card>
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

export default EventCard;
