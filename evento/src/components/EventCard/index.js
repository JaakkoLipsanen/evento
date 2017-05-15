import React, { Component } from 'react';
import moment from 'moment';
import './EventCard.css'

class EventCard extends Component {
	render() {
		const event = this.props.event;
		const time = this.getTimeString(event.time);
		return (
			<div className="EventCard" onClick={this.props.onClick}>
				<div className="wrapper">
					<h4 className="category">{ event.category.name } </h4>
					<h4 className="title">{ event.title } </h4>
					<h4 className="location"> { event.location } </h4>

					<div className="bottom-block">
						<h4 className="time"> { time } </h4>
						<h4 className="creator">{ event.creator.name } </h4>
					</div>
				</div>
			</div>
		);
	}

	getTimeString(rawEventTime) {
		if (!rawEventTime) {
			return 'Unspecified';
		}

		const eventTime = moment(rawEventTime)
		const currentTime = moment();
		const timeDifference = eventTime.diff(currentTime, 'days');

		const time =  eventTime.format('HH:mm');
		if (timeDifference === 0) {
			return 'Today at ' + eventTime.format('HH:mm');
		} else if (timeDifference === 1) {
			return 'Tomorrow at ' + eventTime.format('HH:mm');
		} else if (timeDifference < 7) {
			const day = eventTime.format('dddd');
			return `${day} at ${time}`;
		} else {
			const date = eventTime.format('MMM DD');
			return `${date} at ${time}`;
		}
	}
}

export default EventCard;
