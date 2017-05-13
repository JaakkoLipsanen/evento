import React from 'react';
import ReactDOM from 'react-dom';
import AuthenticationPage from './';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<AuthenticationPage />, div);
});
