import React from 'react';
import AuthenticationPage from './';

import { renderToDOM } from '../../test-helpers';

it('renders without crashing', () => {
	const div = document.createElement('div');
	renderToDOM(<AuthenticationPage />, div);
});
