import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import './AttendeeList.css';

export default ({ event, attendees = [] }) => (
	<div className="AttendeeList">
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
