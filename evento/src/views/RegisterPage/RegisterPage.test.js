import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import RegisterPage from './';


describe('RegisterPage', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<RegisterPage />, div);
	});

	it('has an error message', () => {
		const registerPage = mount(<RegisterPage/>);
		registerPage.setState({ errorMessages: ['test error'] });
		expect(registerPage.find('.ErrorMessage').node).not.toBeUndefined();
	});

	it('has a link to sign in page', () => {
		const history = {push: sinon.spy()};
		const registerPage = mount(<RegisterPage history={history}/>);

		expect(registerPage.find('.Link').node).not.toBeUndefined();
		registerPage.find('.Link').simulate('click');
		expect(history.push.calledWith('/signin')).toBe(true);
	});

	describe('form', () => {
		it('calls callback onSubmit', async () => {
			const registerPage = mount(<RegisterPage/>);
			const callback = sinon.spy(registerPage.instance(), 'handleSubmit');
			registerPage.find('form').simulate('submit');

			expect(callback.calledOnce).toBe(true);
		});

		it('changes name state onChange', async () => {
			const registerPage = mount(<RegisterPage/>);
			registerPage.find('input').at(0).simulate('change', {target: {value: 'Antti'}});

			expect(registerPage.state('name')).toBe('Antti');
		});

		it('changes email state onChange', async () => {
			const registerPage = mount(<RegisterPage/>);
			registerPage.find('input').at(1).simulate('change', {target: {value: 'name@example.com'}});

			expect(registerPage.state('email')).toBe('name@example.com');
		});

		it('changes password state onChange', async () => {
			const registerPage = mount(<RegisterPage/>);
			registerPage.find('input').at(2).simulate('change', {target: {value: 'secretpassword123'}});

			expect(registerPage.state('password')).toBe('secretpassword123');
		});

		it('changes password confirmation state onChange', async () => {
			const registerPage = mount(<RegisterPage/>);
			registerPage.find('input').at(3).simulate('change', {target: {value: 'secretpasswordConf123'}});

			expect(registerPage.state('passwordConf')).toBe('secretpasswordConf123');
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => 	fetchMock.restore());

		it('changes errorMessages if password and passwordConf do not match', async () => {
			const registerPage = mount(<RegisterPage/>);
			registerPage.find('input').at(2).simulate('change', {target: {value: 'secretpassword123'}});
			registerPage.find('input').at(3).simulate('change', {target: {value: 'somethingelse'}});
			registerPage.find('form').simulate('submit');

			expect(registerPage.state('errorMessages')).toContain('Passwords do not match');
		});

		it('calls preventDefault on event', async () => {
			const event = { preventDefault: sinon.spy() };
			const registerPage = mount(<RegisterPage/>);
			registerPage.instance().handleSubmit(event);

			expect(event.preventDefault.calledOnce).toBe(true);
		});

		const register = async (name, email, password, passwordConf, history) => {
			const registerPage = mount(<RegisterPage history={history}/>);

			// Type all fields and submit
			registerPage.find('input').at(0).simulate('change', {target: {value: name}});
			registerPage.find('input').at(1).simulate('change', {target: {value: email}});
			registerPage.find('input').at(2).simulate('change', {target: {value: password}});
			registerPage.find('input').at(3).simulate('change', {target: {value: passwordConf}});
			registerPage.find('form').simulate('submit');
			await waitForFetches();

			return registerPage;
		};

		it('redirects to sign in page after successiful registering', async () => {
			const history = { push: sinon.spy() };
			fetchMock.post('/users', { status: 201 });

			const user = Mock.generateUser();
			const registerPage = await register(user.name, user.email,
				'validpassword123', 'validpassword123', history);

			expect(history.push.calledOnce).toBe(true);
			expect(history.push.calledWith('/signin')).toBe(true);
		});

		it('does not redirect on failed registering', async () => {
			const history = { push: sinon.spy() };
			fetchMock.post('/users', { status: 422 });

			const user = Mock.generateUser();
			const registerPage = await register('Antti', 'bad', 'nope', 'nope', history);

			expect(history.push.called).toBe(false);
		});

		it('sets error messages on failed fetch', async () => {
			const body = `{"email": ["is invalid", "can't be blank"],
				"name": ["can't be blank","is too short (minimum is 3 characters)"],
				"password": ["can't be blank"]}`
			fetchMock.post('/users', { status: 422, body: body });

			const user = Mock.generateUser();
			const registerPage = await register('', '', '', '');

			expect(registerPage.state('errorMessages').length).toBeGreaterThan(0);
		});
	});
});
