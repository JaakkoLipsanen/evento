import React from 'react';

import EventCard from './';
import { mocks, renderToDOM } from '../../test-helpers';

it('renders without crashing', () => {
	const div = document.createElement('div');
	renderToDOM(<EventCard event={mocks.event} />, div);
});
