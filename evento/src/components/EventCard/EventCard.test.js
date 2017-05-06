import React from 'react';
import ReactDOM from 'react-dom';

import EventCard from './';
import { mocks } from '../../test-helpers';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<EventCard event={mocks.event} />, div);
});
