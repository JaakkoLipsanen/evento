import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import Cookie from 'js-cookie';
import SignInPage from './';


describe('SignInPage', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<SignInPage />, div);
	});

	it('has an error message', () => {
		const signInPage = mount(<SignInPage/>);
		expect(signInPage.find('.ErrorMessage').node).not.toBeUndefined();
	});

	it('has a link to register page', () => {
		const history = {push: sinon.spy()};
		const signInPage = mount(<SignInPage history={history}/>);

		expect(signInPage.find('.Link').node).not.toBeUndefined();
		signInPage.find('.Link').simulate('click');
		expect(history.push.calledWith('/register')).toBe(true);
	});

	describe('form', () => {
		it('calls callback onSubmit', async () => {
			const signInPage = mount(<SignInPage/>);
			const callback = sinon.spy(signInPage.instance(), 'handleSubmit');
			signInPage.find('form').simulate('submit');

			expect(callback.calledOnce).toBe(true);
		});

		it('changes email state onChange', async () => {
			const signInPage = mount(<SignInPage/>);
			signInPage.find('input').at(0).simulate('change', {target: {value: 'name@example.com'}});

			expect(signInPage.state('email')).toBe('name@example.com');
		});

		it('changes password state onChange', async () => {
			const signInPage = mount(<SignInPage/>);
			signInPage.find('input').at(1).simulate('change', {target: {value: 'secretpassword123'}});

			expect(signInPage.state('password')).toBe('secretpassword123');
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => {
			Object.keys(Cookie.get()).forEach(function(cookie) {
				Cookie.remove(cookie);
			});
			fetchMock.restore();
		});

		const signIn = async (email, password, history) => {
			const signInPage = mount(<SignInPage history={history}/>);

			// Type credentials and submit
			signInPage.find('input').at(0).simulate('change', {target: {value: email}});
			signInPage.find('input').at(1).simulate('change', {target: {value: password}});
			signInPage.find('form').simulate('submit');
			await waitForFetches();

			return signInPage;
		};

		const successifulSignIn = async (history) => {
			const AUTH_TOKEN = '12345678';
			const USER = {id: 123, name: 'Antti', email: 'antt@gmail.com'};

			fetchMock.post('/authenticate', {
				status: 200,
				body: {auth_token: AUTH_TOKEN, user: USER}
			});

			const signInPage = await signIn(USER.email, 'secretpassword123', history);
			return [signInPage, AUTH_TOKEN, USER];
		};

		const failedSignIn = async (history) => {
			fetchMock.post('/authenticate', { status: 401, body: '{ }' });
			return await signIn('wrong@email.com', 'secretpassword123', history);
		};

		it('calls preventDefault on event', async () => {
			const event = { preventDefault: sinon.spy() };
			const signInPage = mount(<SignInPage/>);
			signInPage.instance().handleSubmit(event);

			expect(event.preventDefault.calledOnce).toBe(true);
		});

		it('sets auth_token and userId cookies on successiful fetch', async () => {
			const [signInPage, AUTH_TOKEN, USER] = await successifulSignIn();

			expect(Cookie.get('auth_token')).toEqual(AUTH_TOKEN)
			expect(JSON.parse(Cookie.get('user')).id).toEqual(USER.id); // Cookies are stored as strings
		});

		it('sets error message on failed fetch', async () => {
			const signInPage = await failedSignIn();

			expect(signInPage.state('errorMessage')).toBe('Invalid credentials');
			expect(Cookie.get('auth_token')).toBeUndefined();
			expect(Cookie.get('user')).toBeUndefined();
		});

		it('redirects to front page after successiful sign in', async () => {
			const history = { push: sinon.spy() };
			const [signInPage, AUTH_TOKEN, USER] = await successifulSignIn(history);

			expect(history.push.calledOnce).toBe(true);
			expect(history.push.calledWith('/')).toBe(true);
		});
	});
});
