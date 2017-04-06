import React from 'react';
import ReactDOM from 'react-dom';
import EventPage from './';

const matchMock = { params: { eventId: 1 } };
it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<EventPage match={matchMock} />, div);
});
