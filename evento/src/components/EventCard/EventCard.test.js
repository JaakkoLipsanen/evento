import React from 'react';
import ReactDOM from 'react-dom';
import EventCard from './';


it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<EventCard event={Mock.generateEvent()} />, div);
});
