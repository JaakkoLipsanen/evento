import React from 'react';
import ReactDOM from 'react-dom';
import SignInPage from './';

import api from '../../api';
import session from '../../session';
import { mount, createSinonSandbox, cookies, mocks } from '../../test-helpers';

describe('SignInPage', () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true });

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<SignInPage />, div);
	});

	it('has an error message', async () => {
		const signInPage = await mount(<SignInPage />);
		expect(signInPage.find('.ErrorMessage').node).not.toBeUndefined();
	});

	it('has a link to register page', async () => {
		const history = { push: sinon.spy() };
		const signInPage = await mount(<SignInPage history={history} />);

		expect(signInPage.find('.Link').node).not.toBeUndefined();
		signInPage.find('.Link').simulate('click');
		expect(history.push.calledWith('/register')).toBe(true);
	});

	describe('form', () => {
		it('calls callback onSubmit', async () => {
			const signInPage = await mount(<SignInPage />);
			const callback = sinon.spy(signInPage.instance(), 'handleSubmit');
			signInPage.find('form').simulate('submit');

			expect(callback.calledOnce).toBe(true);
		});

		it('changes email state onChange', async () => {
			const signInPage = await mount(<SignInPage />);
			signInPage.find('input').at(0).simulate('change', { target: { value: 'name@example.com' } });

			expect(signInPage.state('email')).toBe('name@example.com');
		});

		it('changes password state onChange', async () => {
			const signInPage = await mount(<SignInPage/>);
			signInPage.find('input').at(1).simulate('change', { target: { value: 'secretpassword123' } });

			expect(signInPage.state('password')).toBe('secretpassword123');
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => { cookies.reset(); });

		const AUTH_TOKEN = '12345678';
		const USER = mocks.user;
		const PASSWORD = "secretpassword123";

		const signIn = async (email, password, history) => {
			const signInPage = await mount(<SignInPage history={history} />);

			// Type credentials and submit
			signInPage.find('input').at(0).simulate('change', { target: { value: email } });
			signInPage.find('input').at(1).simulate('change', { target: { value: password } });
			signInPage.find('form').simulate('submit');
			await signInPage.wait();

			return signInPage;
		};

		const successfulSignIn = async (history) => {
			sinon.stub(api, "signin")
				.withArgs(USER.email, PASSWORD)
				.callsFake(() => mocks.api.responses.create({ user: USER, auth_token: AUTH_TOKEN }));

			const signInPage = await signIn(USER.email, PASSWORD, history);
			return { signInPage, auth_token: AUTH_TOKEN, user: USER };
		};

		const failedSignIn = async (history) => {
			sinon.stub(api, "signin")
				.withArgs(USER.email, PASSWORD)
				.callsFake(() => mocks.api.responses.createError({ message: api.INVALID_CREDENTIALS_MESSAGE }));

			return await signIn(USER.email, PASSWORD, history);
		};

		it('calls preventDefault on event', async () => {
			const event = { preventDefault: sinon.spy() };
			const signInPage = await mount(<SignInPage />);
			signInPage.instance().handleSubmit(event);

			expect(event.preventDefault.calledOnce).toBe(true);
		});

		/* this should be in api.js
		it('sets auth_token and userId cookies on successful fetch', async () => {
			const { auth_token, user } = await successfulSignIn();

			expect(session.getAuthToken()).toEqual(auth_token)
			expect(session.getUser()).toEqual(user);
		}); */

		it('sets error message on failed sign in', async () => {
			const signInPage = await failedSignIn();

			expect(signInPage.state('errorMessage')).toBe('Invalid credentials');
			expect(session.getAuthToken()).toBeFalsy();
			expect(session.getUser()).toBeFalsy();
		});

		it('redirects to front page after successful sign in', async () => {
			const history = { push: sinon.spy() };
			await successfulSignIn(history);

			expect(history.push.calledOnce).toBe(true);
			expect(history.push.calledWith('/')).toBe(true);
		});
	});
});
