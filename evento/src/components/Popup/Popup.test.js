import React from 'react';

import Popup from './';
import { mocks, renderToDOM } from '../../test-helpers';

it('renders without crashing', () => {
	const div = document.createElement('div');
	renderToDOM(<Popup />, div);
});
