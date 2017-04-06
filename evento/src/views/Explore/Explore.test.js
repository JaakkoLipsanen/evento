import React from 'react';
import ReactDOM from 'react-dom';
import Explore from './';

const eventFilterer = (events) => events;
it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<Explore filterEvents={eventFilterer} />, div);
});
