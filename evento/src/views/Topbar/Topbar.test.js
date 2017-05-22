import React from 'react';
import ReactDOM from 'react-dom';
import Topbar from './';

import { renderToDOM } from '../../test-helpers';

it('renders without crashing', () => {
	const div = document.createElement('div');
	renderToDOM(<Topbar />, div);
});
