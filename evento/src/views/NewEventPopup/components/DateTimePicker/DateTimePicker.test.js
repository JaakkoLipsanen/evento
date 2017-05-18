import React from 'react';
import ReactDOM from 'react-dom';
import DateTimePicker from './';

describe('DateTimePicker', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<NewEventPopup />, div);
	});
});
