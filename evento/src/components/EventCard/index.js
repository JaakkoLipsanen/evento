import React, { Component } from 'react';

import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import GroupIcon from 'material-ui/svg-icons/social/group';

import { getRelativeDateTime } from '../../helper';
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
		const timeAndLocation = `${getRelativeDateTime(event.time)} @ ${event.location}`;

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
}

export default EventCard;
