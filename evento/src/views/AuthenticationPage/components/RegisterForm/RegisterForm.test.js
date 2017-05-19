import React from 'react';
import ReactDOM from 'react-dom';
import RegisterForm from './';

import api from '../../../../api';
import { mount, mocks, createSinonSandbox, renderToDOM } from '../../../../test-helpers';

describe('RegisterForm', () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true });

	it('renders without crashing', () => {
		const div = document.createElement('div');
		renderToDOM(<RegisterForm />, div);
	});

	it('has an error message', async () => {
		const wrapper = await mount(<RegisterForm />);
		wrapper.setState({errorMessage: 'test error'})

		expect(wrapper.find('.error-message').text()).toBe('test error');
	});

	describe('form', () => {
		it('calls register() on submit button click', async () => {
			const wrapper = await mount(<RegisterForm />);
			const callback = sinon.spy(wrapper.instance(), 'register');

			const registerButton = wrapper.find('EnhancedButton');
			registerButton.simulate('click');

			expect(callback.calledOnce).toBe(true);
		});

		it('calls register() on enter key press', async () => {
			const wrapper = await mount(<RegisterForm />);
			const callback = sinon.spy(wrapper.instance(), 'register');

			wrapper.find('input').at(3).simulate('keyPress', { key: 'Enter' });

			expect(callback.calledOnce).toBe(true);
		});

		it('changes name state onChange', async () => {
			const wrapper = await mount(<RegisterForm />);
			wrapper.find('input').at(0).simulate('change', { target: { value: 'Antti' } });

			expect(wrapper.state('name')).toBe('Antti');
		});

		it('changes email state onChange', async () => {
			const wrapper = await mount(<RegisterForm />);
			wrapper.find('input').at(1).simulate('change', { target: { value: 'name@example.com' } });

			expect(wrapper.state('email')).toBe('name@example.com');
		});

		it('changes password state onChange', async () => {
			const wrapper = await mount(<RegisterForm />);
			wrapper.find('input').at(2).simulate('change', { target: { value: 'secretpassword123' } });

			expect(wrapper.state('password')).toBe('secretpassword123');
		});

		it('changes password confirmation state onChange', async () => {
			const wrapper = await mount(<RegisterForm />);
			wrapper.find('input').at(3).simulate('change', { target: { value: 'secretpasswordConf123' } });

			expect(wrapper.state('passwordConf')).toBe('secretpasswordConf123');
		});
	});

	describe('register', () => {
		it('changes errorMessages if password and passwordConf do not match', async () => {
			const wrapper = await mount(<RegisterForm />);
			wrapper.find('input').at(2).simulate('change', { target: { value: 'secretpassword123' } });
			wrapper.find('input').at(3).simulate('change', { target: { value: 'somethingelse' } });

			const registerButton = wrapper.find('EnhancedButton');
			registerButton.simulate('click');

			expect(wrapper.state('fieldErrors').passwordConf).toContain("Passwords do not match")
		});

		const register = async (name='', email='', password='', passwordConf='', onSignIn) => {
			const wrapper = await mount(<RegisterForm onSignIn={onSignIn} />);

			// Type all fields and submit
			wrapper.find('input').at(0).simulate('change', { target: { value: name } });
			wrapper.find('input').at(1).simulate('change', { target: { value: email } });
			wrapper.find('input').at(2).simulate('change', { target: { value: password } });
			wrapper.find('input').at(3).simulate('change', { target: { value: passwordConf } });

			wrapper.find('EnhancedButton').simulate('click');
			await wrapper.wait();

			return wrapper;
		};

		it('calls register api function after on successiful register', async () => {
			const stub = sinon.stub(api, "register")
				.callsFake(() => mocks.api.responses.DefaultSuccess);

			const wrapper = await register(mocks.user.name, mocks.user.email,
				'validpassword123', 'validpassword123');

			expect(stub.calledOnce).toBe(true);
		});

		it('signs in after successiful registering', async () => {
			sinon.stub(api, "register")
				.callsFake(() => mocks.api.responses.DefaultSuccess);

			const stub = sinon.stub(api, "signin")
				.callsFake(() => mocks.api.responses.DefaultSuccess);

			const onSignInSpy = sinon.spy();

			const wrapper = await register(mocks.user.name, mocks.user.email,
				'validpassword123', 'validpassword123', onSignInSpy);

			expect(stub.calledOnce).toBe(true);
			expect(onSignInSpy.calledOnce).toBe(true);
		});

		const createError = (messages) => {
			return { success: false, error: { type: "unknown", messages: getErrorMessages(messages) } };
		}

		const getErrorMessages = (error) => {
			const errorMessages = Object.keys(error).map(key => error[key].map(value => `${key} ${value}`));
			const flattened = [].concat.apply([], errorMessages);

			flattened.raw = error;
			return flattened;
		};

		it('sets error messages on failed register', async () => {
			const errorMessage = {
				"password":["can't be blank"],
				"name":["can't be blank"],
				"email":["is invalid"],
				"password_digest":["can't be blank"]
			};

			sinon.stub(api, "register")
				.callsFake(() => createError(errorMessage));

			const wrapper = await register();

			expect(wrapper.state('fieldErrors').name).toBe("can't be blank");
			expect(wrapper.state('fieldErrors').password).toBe("can't be blank");
			expect(wrapper.state('fieldErrors').email).toBe("is invalid");
		});

		it('sets error messages on failed signin', async () => {
			const errorMessage = {"error":{"authentication":["Wrong credentials"]}};

			sinon.stub(api, "register")
				.callsFake(() => mocks.api.responses.DefaultSuccess);
			sinon.stub(api, "signin")
				.callsFake(() => mocks.api.responses.createError({ message: api.INVALID_CREDENTIALS_MESSAGE }));

			const wrapper = await register();

			expect(wrapper.state('errorMessage')).toBe(api.INVALID_CREDENTIALS_MESSAGE);
		});
	});
});
