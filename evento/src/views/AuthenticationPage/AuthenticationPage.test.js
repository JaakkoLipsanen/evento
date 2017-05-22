import React from 'react';
import AuthenticationPage from './';

import { mount, renderToDOM } from '../../test-helpers';

describe('render', async () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		renderToDOM(<AuthenticationPage />, div);
	});

	it('renders signInForm by default', async () => {
		const wrapper = await mount(<AuthenticationPage />);
		expect(wrapper.state('showRegister')).toBe(false);
		expect(wrapper.find('SignInForm').length).toEqual(1);
		expect(wrapper.find('a').text()).toBe("Not yet registered? Register here");
	});

	it('renders RegisterForm after clicking link', async () => {
		const wrapper = await mount(<AuthenticationPage />);
		wrapper.find('a').simulate('click');
		expect(wrapper.state('showRegister')).toBe(true);
		expect(wrapper.find('RegisterForm').length).toEqual(1);
		expect(wrapper.find('a').text()).toBe("Already registered? Sign in here");
	});
});
