import React from 'react';
import ReactDOM from 'react-dom';
import EventCard from './';

const event = {
	id: 1, title: "Piano",
	location: "Itäkeskus", time: "Tomorrow",
	category: { id: 1, name: "Music" },
	creator: { id: 1, name: "Jaakko" }
};

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<EventCard event={event} />, div);
});
