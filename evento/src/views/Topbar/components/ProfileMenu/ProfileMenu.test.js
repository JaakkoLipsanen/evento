import React from 'react';
import ReactDOM from 'react-dom';
import ProfileMenu from './';
import sinon from 'sinon';
import session from '../../../../session';

import { renderToDOM, mount, shallow } from '../../../../test-helpers';

describe('ProfileMenu', async () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		renderToDOM(<ProfileMenu />, div);
	});

	it('opens menu when clicking gear menu', async () => {
		const wrapper = await mount(<ProfileMenu />);
		expect(wrapper.state('open')).toBe(false);
		wrapper.find('IconMenu').node.props.onRequestChange();
		expect(wrapper.state('open')).toBe(true);

	});

	it('calls signOut() after clicking "Sign out"', async () => {
		const wrapper = await shallow(<ProfileMenu />);
		const signOutSpy = sinon.spy(wrapper.instance(), 'signOut');
		wrapper.find('MenuItem').at(3).simulate('click');
		expect(signOutSpy.calledOnce).toBe(true);
	});

	it('signOut() resets session', async () => {
		const wrapper = await shallow(<ProfileMenu />);
		const resetSpy = sinon.spy(session, 'reset');
		wrapper.find('MenuItem').at(3).simulate('click');
		expect(resetSpy.calledOnce).toBe(true);
	});

	it('signOut() redirects to /evento', async () => {
		const wrapper = await shallow(<ProfileMenu />);
		const windowSpy = sinon.spy(window.location, 'replace');
		wrapper.find('MenuItem').at(3).simulate('click');
		expect(windowSpy.calledOnce).toBe(true);
		expect(windowSpy.calledWith('/evento')).toBe(true);
	});
});
