import React from 'react';
import ReactDOM from 'react-dom';
import DateTimePicker from './';

import { renderToDOM } from '../../../../test-helpers';

describe('DateTimePicker', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		renderToDOM(<DateTimePicker />, div);
	});
});
