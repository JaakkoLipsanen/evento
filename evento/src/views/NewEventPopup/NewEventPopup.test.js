import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import NewEventPopup from './';
import api from '../../api';
import { mount, createSinonSandbox, mocks, cookies, renderToDOM } from '../../test-helpers';

const DEFAULT_TIME = moment();

describe('NewEventPopup', () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true });
	beforeEach(() => cookies.reset());

	beforeEach(() => {
		sinon.stub(api, "getCategories")
			.callsFake(() => mocks.api.responses.create({ categories: mocks.categories }));

		sinon.stub(api, "createNewEvent")
			.callsFake(() => mocks.api.responses.create({ }))
	});

	it('renders without crashing', () => {
		const div = document.createElement('div');
		renderToDOM(<NewEventPopup />, div);
	});

	it('has an error message', async () => {
		const wrapper = await mount(<NewEventPopup />);
		wrapper.setState({ errorMessage: 'test error' });

		expect(wrapper.find('.error-message').text()).toBe('test error');
	});

	it('sets error messages when getCategories fails', async () => {
		api.getCategories.restore();
		sinon.stub(api, "getCategories")
			.callsFake(() => mocks.api.responses.createError({ message: "Random error" }));

		const wrapper = await mount(<NewEventPopup />);

		expect(wrapper.find('.error-message').text()).toBe('Random error');
		expect(wrapper.state('categories').length).toBe(0);
	});

	describe('form', async () => {
		const getTitleInput = (wrapper) => wrapper.find('TextField').at(0).find('input');
		const getLocationInput = (wrapper) => wrapper.find('TextField').at(1).find('input');
		const getDescriptionInput = (wrapper) => wrapper.find('TextField').at(2).find('textarea').at(1);
		// const getCategoryInput = (wrapper) => wrapper.find('SelectField').at(0).find('input');
		const getImageInput = (wrapper) => wrapper.find('TextField').at(4).find('input');
		const getCreateEventButton = (wrapper) => wrapper.find('RaisedButton').at(0).find('button');
		const getCancelButton = (wrapper) => wrapper.find('RaisedButton').at(1).find('button');

		it('calls createEvent on "create event" button click', async () => {
			const wrapper = await mount(<NewEventPopup/>);
			const callback = sinon.spy(wrapper.instance(), 'createEvent');
			getCreateEventButton(wrapper).simulate('click');

			expect(callback.calledOnce).toBe(true);
		});

		it('calls close() on cancel button click', async () => {
			const wrapper = await mount(<NewEventPopup/>);
			const callback = sinon.spy(wrapper.instance(), 'close');
			getCancelButton(wrapper).simulate('click');

			expect(callback.calledOnce).toBe(true);
		});

		it('changes title state onChange', async () => {
			const wrapper = await mount(<NewEventPopup />);
			getTitleInput(wrapper).simulate('change', {target: {value: 'Party'}});

			expect(wrapper.state('title')).toBe('Party');
		});

		it('changes description state onChange', async () => {
			const wrapper = await mount(<NewEventPopup/>);
			getDescriptionInput(wrapper)
				.simulate('change', {target: {value: 'Biggest baddest party!'}});

			expect(wrapper.state('description')).toBe('Biggest baddest party!');
		});

		it('changes location state onChange', async () => {
			const wrapper = await mount(<NewEventPopup/>);
			getLocationInput(wrapper)
				.simulate('change', {target: {value: 'My house'}});

			expect(wrapper.state('location')).toBe('My house');
		});

		it('changes category state onChange')
		// , async () => {
		// 	const wrapper = await mount(<NewEventPopup/>);
		// 	getCategoryInput(wrapper)
		// 		.simulate('change', {target: {value: 'Other'}});
		//
		// 	expect(wrapper.state('category')).toBe('Other');
		// });

		it('changes startTime state onChange')
		// , async () => {
		// 	const value = moment().add(10, 'days');
		// 	const wrapper = await mount(<NewEventPopup/>);
		//
		// 	wrapper.find('DateTimePicker').at(0).find('DatePicker')
		// 		.simulate('change', value);
		//
		// 	expect(wrapper.state('startTime').isSame(value)).toBe(true);
		// });

		it('changes endTime state onChange')
		// , async () => {
		// 	const value = moment().add(10, 'days');
		// 	const wrapper = await mount(<NewEventPopup/>);
		//
		// 	wrapper.find('.end-time-picker-container input').at(0)
		// 		.simulate('change', { target: { value: value } });
		//
		// 	expect(wrapper.state('endTime').isSame(value)).toBe(true);
		// });

		it('changes the endTime if startTime is setted and is after the endTime')
		// , async () => {
		// 	const value = moment().add(10, 'days');
		// 	const wrapper = await mount(<NewEventPopup/>);
		//
		// 	const originalEndTime = wrapper.state('endTime');
		// 	wrapper.find('.start-time-picker-container input').at(0)
		// 		.simulate('change', { target: { value: originalEndTime.clone().add(1, 'hour') } });
		//
		// 	expect(wrapper.state('endTime').isAfter(originalEndTime)).toBe(true);
		// });

		it('changes the startTime if endTime is setted and is before the startTime')
	// 	, async () => {
	// 		const value = moment().add(10, 'days');
	// 		const wrapper = await mount(<NewEventPopup/>);
	//
	// 		const originalStartTime = wrapper.state('startTime');
	// 		wrapper.find('.end-time-picker-container input').at(0)
	// 			.simulate('change', { target: { value: originalStartTime.clone().subtract(1, 'hour') } });
	//
	// 		expect(wrapper.state('startTime').isBefore(originalStartTime)).toBe(true);
	// 	});
	});

	describe('createEvent', () => {
		const createEvent = async (title, description, category, startTime, location, image) => {
			cookies.set({ user: mocks.user, auth_token: "valid" });
			const wrapper = await mount(<NewEventPopup history={history} />);
			wrapper.setState({ categories: [category] });

			// Type all fields and submit
			wrapper.find('TextField').at(0).find('input')
				.simulate('change', {target: {value: title}});
			wrapper.find('TextField').at(1).find('input')
				.simulate('change', {target: {value: location}});
			wrapper.find('TextField').at(2).find('textarea').at(1)
				.simulate('change', {target: {value: description}});
			// wrapper.find('SelectField').at(0).find('input')
			// 	.simulate('change', {target: {value: location}});
			wrapper.find('TextField').at(4).find('input')
				.simulate('change', {target: {value: image}});

			wrapper.find('RaisedButton').at(0).find('button').simulate('click');
			await wrapper.wait();

			return wrapper;
		};

		it('calls onCreated after successiful event creation')
		// , async () => {
		// 	const onCreated = sinon.spy();
		// 	const wrapper = await createEvent(mocks.event.title, mocks.event.description,
		// 		mocks.categories[0], DEFAULT_TIME, mocks.event.location, onCreated);
		//
		// 	expect(onCreated.calledOnce).toBe(true);
		// });

		it('does not redirect on failed registering')
		// , async () => {
		// 	const history = { push: sinon.spy() };
		//
		// 	api.createNewEvent.restore();
		// 	sinon.stub(api, "createNewEvent")
		// 		.callsFake(() => mocks.api.responses.DefaultError);
		//
		// 	// Bad arguments
		// 	const wrapper = await createEvent('', 'bad', 'nope', DEFAULT_TIME, '', history);
		// 	expect(history.push.called).toBe(false);
		// });

		it('sets error messages on failed event creation')
		// , async () => {
		// 	api.createNewEvent.restore();
		// 	sinon.stub(api, "createNewEvent")
		// 		.callsFake(() => mocks.api.responses.createError({ messages: [
		// 			"category must exist", "category can't be blank",
		// 			"time can't be in the past"
		// 		]}));
		//
		// 	const wrapper = await createEvent('plaa', 'ploo', 'asf', DEFAULT_TIME, 'sdgds');
		//
		// 	expect(wrapper.state('errorMessages')).not.toBeFalsy();
		// 	expect(wrapper.state('errorMessages').length).toBe(3);
		// 	expect(wrapper.state('errorMessages')).toContain("time can't be in the past");
		// });
	});
});
