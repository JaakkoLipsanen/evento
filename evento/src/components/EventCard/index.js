import React, { Component } from 'react';
import './EventCard.css'

class EventCard extends Component {
	render() {
		const event = this.props.event;
		return (
			<div className="EventCard" onClick={this.props.onClick}>
				<div className="wrapper">
					<h4 className="category">{ event.category.name } </h4>
					<h4 className="title">{ event.title } </h4>
					<h4 className="location"> Kumpula /* TODO */ </h4>

					<div className="bottom-block">
						<h4 className="time"> Tomorrow /* TODO */ </h4>
						<h4 className="creator">{ event.creator.name } </h4>
					</div>
				</div>
			</div>
		);
	}
}

export default EventCard;
