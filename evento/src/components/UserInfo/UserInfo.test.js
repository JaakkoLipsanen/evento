import React from 'react';
import ReactDOM from 'react-dom';
import UserInfo from './';

const user = { name: "Jack", email: "jack@aol.com", id: 1 };
it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<UserInfo user={user} />, div);
});
