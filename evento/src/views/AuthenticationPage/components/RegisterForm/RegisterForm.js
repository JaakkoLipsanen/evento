import React from 'react';
import ReactDOM from 'react-dom';
import RegisterForm from './';

import api from '../../api';
import { mount, mocks, createSinonSandbox } from '../../test-helpers';

describe('RegisterForm', () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true });

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<RegisterForm />, div);
	});

	it('has an error message', async () => {
		const registerForm = await mount(<RegisterForm />);
		registerForm.setState({ errorMessages: ['test error'] });

		expect(registerForm.find('.ErrorMessage').node).not.toBeUndefined();
	});

	it('has a link to sign in page', async () => {
		const history = { push: sinon.spy() };
		const registerForm = await mount(<RegisterForm history={history} />);

		expect(registerForm.find('.Link').node).not.toBeUndefined();
		registerForm.find('.Link').simulate('click');
		expect(history.push.calledWith('/signin')).toBe(true);
	});

	describe('form', () => {
		it('calls callback onSubmit', async () => {
			const registerForm = await mount(<RegisterForm />);
			const callback = sinon.spy(registerForm.instance(), 'handleSubmit');
			registerForm.find('form').simulate('submit');

			expect(callback.calledOnce).toBe(true);
		});

		it('changes name state onChange', async () => {
			const registerForm = await mount(<RegisterForm/>);
			registerForm.find('input').at(0).simulate('change', { target: { value: 'Antti' } });

			expect(registerForm.state('name')).toBe('Antti');
		});

		it('changes email state onChange', async () => {
			const registerForm = await mount(<RegisterForm />);
			registerForm.find('input').at(1).simulate('change', { target: { value: 'name@example.com' } });

			expect(registerForm.state('email')).toBe('name@example.com');
		});

		it('changes password state onChange', async () => {
			const registerForm = await mount(<RegisterForm />);
			registerForm.find('input').at(2).simulate('change', { target: { value: 'secretpassword123' } });

			expect(registerForm.state('password')).toBe('secretpassword123');
		});

		it('changes password confirmation state onChange', async () => {
			const registerForm = await mount(<RegisterForm />);
			registerForm.find('input').at(3).simulate('change', { target: { value: 'secretpasswordConf123' } });

			expect(registerForm.state('passwordConf')).toBe('secretpasswordConf123');
		});
	});

	describe('handleSubmit', () => {
		it('changes errorMessages if password and passwordConf do not match', async () => {
			const registerForm = await mount(<RegisterForm />);
			registerForm.find('input').at(2).simulate('change', { target: { value: 'secretpassword123' } });
			registerForm.find('input').at(3).simulate('change', { target: { value: 'somethingelse' } });
			registerForm.find('form').simulate('submit');

			expect(registerForm.state('errorMessages')).toContain('Passwords do not match');
		});

		it('calls preventDefault on event', async () => {
			const event = { preventDefault: sinon.spy() };
			const registerForm = await mount(<RegisterForm />);
			registerForm.instance().handleSubmit(event);

			expect(event.preventDefault.calledOnce).toBe(true);
		});

		const register = async (name, email, password, passwordConf, history) => {
			const registerForm = await mount(<RegisterForm history={history} />);

			// Type all fields and submit
			registerForm.find('input').at(0).simulate('change', { target: { value: name } });
			registerForm.find('input').at(1).simulate('change', { target: { value: email } });
			registerForm.find('input').at(2).simulate('change', { target: { value: password } });
			registerForm.find('input').at(3).simulate('change', { target: { value: passwordConf } });
			registerForm.find('form').simulate('submit');
			await registerForm.wait();

			return registerForm;
		};

		it('redirects to sign in page after successful registering', async () => {
			const history = { push: sinon.spy() };
			sinon.stub(api, "register")
				.callsFake(() => mocks.api.responses.DefaultSuccess);

			const registerForm = await register(mocks.user.name, mocks.user.email,
				'validpassword123', 'validpassword123', history);

			expect(history.push.calledOnce).toBe(true);
			expect(history.push.calledWith('/signin')).toBe(true);
		});

		it('does not redirect on failed registering', async () => {
			const history = { push: sinon.spy() };
			sinon.stub(api, "register")
				.callsFake(() => mocks.api.responses.DefaultError);

			const registerForm = await register('Antti', 'bad', 'nope', 'nope', history);
			expect(history.push.called).toBe(false);
		});

		it('sets error messages on failed register', async () => {
			sinon.stub(api, "register")
				.callsFake(() => mocks.api.responses.createError({
					messages: [
						"email is invalid", "email can't be blank",
						"name is too short", "name can't be blank"
					]
				}));

			const registerForm = await register('', '', '', '');
			expect(registerForm.state('errorMessages').length).toBeGreaterThan(0);
			expect(registerForm.state('errorMessages')).toContain("email is invalid");
		});
	});
});
