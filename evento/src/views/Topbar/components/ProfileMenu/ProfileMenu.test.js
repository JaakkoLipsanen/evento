import React from 'react';
import ReactDOM from 'react-dom';
import ProfileMenu from './';

import { renderToDOM } from '../../../../test-helpers';

it('renders without crashing', () => {
	const div = document.createElement('div');
	renderToDOM(<ProfileMenu />, div);
});
