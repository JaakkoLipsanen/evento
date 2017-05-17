import React from 'react';
import ReactDOM from 'react-dom';
import SignInForm from './';

import api from '../../../../api';
import session from '../../../../session';
import { mount, createSinonSandbox, cookies, mocks, renderToDOM } from '../../../../test-helpers';

describe('SignInForm', () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true });

	it('renders without crashing', () => {
		const div = document.createElement('div');
		renderToDOM( <SignInForm />, div);
	});

	it('renders an error message', async () => {
		const wrapper = await mount(<SignInForm />);
		wrapper.setState({errorMessage: 'invalid credentials'})
		const passwordField = wrapper.find('TextField').at(1);

		expect(passwordField.prop('errorText')).toBe('invalid credentials');
	});

	describe('form', () => {
		it('calls signin() on submit button click', async () => {
			const wrapper = await mount(<SignInForm />);
			const callback = sinon.spy(wrapper.instance(), 'signin');

			const signInButton = wrapper.find('EnhancedButton');
			signInButton.simulate('click');

			expect(callback.calledOnce).toBe(true);
		});

		it('calls signin() on enter key press', async () => {
			const wrapper = await mount(<SignInForm />);
			const callback = sinon.spy(wrapper.instance(), 'signin');

			const passwordField = wrapper.find('TextField').at(1)
			wrapper.find('input').at(1).simulate('keyPress', { key: 'Enter' });

			expect(callback.calledOnce).toBe(true);
		});

		it('changes email state onChange', async () => {
			const wrapper = await mount(<SignInForm />);
			wrapper.find('input').at(0).simulate('change', { target: { value: 'name@example.com' } });

			expect(wrapper.state('email')).toBe('name@example.com');
		});

		it('changes password state onChange', async () => {
			const wrapper = await mount(<SignInForm/>);
			wrapper.find('input').at(1).simulate('change', { target: { value: 'secretpassword123' } });

			expect(wrapper.state('password')).toBe('secretpassword123');
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => { cookies.reset(); });

		// ====== These are no longer used but may be used in future ======

		// const AUTH_TOKEN = '12345678';
		// const USER = mocks.user;
		// const PASSWORD = "secretpassword123";
		//
		// const signIn = async (email, password, history) => {
		// 	const wrapper = await mount(<SignInForm history={history} />);
		//
		// 	// Type credentials and submit
		// 	wrapper.find('input').at(0).simulate('change', { target: { value: email } });
		// 	wrapper.find('input').at(1).simulate('change', { target: { value: password } });
		// 	wrapper.find('form').simulate('submit');
		// 	await wrapper.wait();
		//
		// 	return wrapper;
		// };
		//
		// const successfulSignIn = async (history) => {
		// 	sinon.stub(api, "signin")
		// 		.withArgs(USER.email, PASSWORD)
		// 		.callsFake(() => mocks.api.responses.create({ user: USER, auth_token: AUTH_TOKEN }));
		//
		// 	const wrapper = await signIn(USER.email, PASSWORD, history);
		// 	return { wrapper, auth_token: AUTH_TOKEN, user: USER };
		// };
		//
		// const failedSignIn = async (history) => {
		// 	sinon.stub(api, "signin")
		// 		.withArgs(USER.email, PASSWORD)
		// 		.callsFake(() => mocks.api.responses.createError({ message: api.INVALID_CREDENTIALS_MESSAGE }));
		//
		// 	return await signIn(USER.email, PASSWORD, history);
		// };


	// 	/* this should be in api.js
	// 	it('sets auth_token and userId cookies on successful fetch', async () => {
	// 		const { auth_token, user } = await successfulSignIn();
	//
	// 		expect(session.getAuthToken()).toEqual(auth_token)
	// 		expect(session.getUser()).toEqual(user);
	// 	}); */

		it('calls onSignIn on successiful sign in', async () => {
			sinon.stub(api, "signin")
				.callsFake(() => mocks.api.responses.DefaultSuccess);

			const mockOnClick = sinon.spy();
			const wrapper = await mount(<SignInForm onSignIn={mockOnClick} />);

			const signInButton = wrapper.find('EnhancedButton');
			signInButton.simulate('click');
			await wrapper.wait();

			expect(mockOnClick.calledOnce).toBe(true);
		});

		it('sets error message on failed sign in', async () => {
			sinon.stub(api, "signin")
				.callsFake(() => mocks.api.responses.createError({ message: api.INVALID_CREDENTIALS_MESSAGE }));

			const wrapper = await mount(<SignInForm />);

			const signInButton = wrapper.find('EnhancedButton');
			signInButton.simulate('click');
			await wrapper.wait();

			expect(wrapper.state('errorMessage')).toBe(api.INVALID_CREDENTIALS_MESSAGE);
			expect(session.getAuthToken()).toBeFalsy();
			expect(session.getUser()).toBeFalsy();
		});
	});
});
