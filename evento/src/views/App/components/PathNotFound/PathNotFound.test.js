import React from 'react';
import ReactDOM from 'react-dom';

import { renderToDOM } from '../../../../test-helpers';
import PathNotFound from './';

it('renders without crashing', () => {
	const div = document.createElement('div');
	renderToDOM(<PathNotFound />, div);
});
