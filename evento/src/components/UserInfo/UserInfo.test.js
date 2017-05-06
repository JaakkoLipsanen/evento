import React from 'react';
import ReactDOM from 'react-dom';

import UserInfo from './';
import { mocks } from '../../test-helpers';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<UserInfo user={mocks.user} />, div);
});
