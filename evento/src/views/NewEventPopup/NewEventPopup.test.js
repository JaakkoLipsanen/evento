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

	it('has an error message')
	// , async () => {
	// 	const wrapper = await mount(<NewEventPopup />);
	// 	wrapper.setState({ errorMessages: ['test error'] });
	// 	expect(wrapper.find('.ErrorMessage').node).not.toBeUndefined();
	// });

	it('sets error messages when getCategories fails')
	// , async () => {
	// 	api.getCategories.restore();
	// 	sinon.stub(api, "getCategories")
	// 		.callsFake(() => mocks.api.responses.createError({ message: "Random error" }));
	//
	// 	const wrapper = await mount(<NewEventPopup />);
	//
	// 	expect(wrapper.state('errorMessages')).not.toBeFalsy();
	// 	expect(wrapper.state('errorMessages').length).toBe(1);
	// 	expect(wrapper.state('errorMessages')).toContain("Random error");
	// });

	describe('form', async () => {
		it('calls callback onSubmit')
		// , async () => {
		// 	const wrapper = await mount(<NewEventPopup/>);
		// 	const callback = sinon.spy(wrapper.instance(), 'handleSubmit');
		// 	wrapper.find('form').simulate('submit');
		//
		// 	expect(callback.calledOnce).toBe(true);
		// });

		it('changes title state onChange')
		// , async () => {
		// 	const wrapper = await mount(<NewEventPopup />);
		// 	wrapper.find('.title-input')
		// 		.simulate('change', {target: {value: 'Party'}});
		//
		// 	expect(wrapper.state('title')).toBe('Party');
		// });

		it('changes description state onChange')
		// , async () => {
		// 	const wrapper = await mount(<NewEventPopup/>);
		// 	wrapper.find('.description-input')
		// 		.simulate('change', {target: {value: 'Biggest baddest party!'}});
		//
		// 	expect(wrapper.state('description')).toBe('Biggest baddest party!');
		// });

		it('changes location state onChange')
		// , async () => {
		// 	const wrapper = await mount(<NewEventPopup/>);
		// 	wrapper.find('.location-input')
		// 		.simulate('change', {target: {value: 'My house'}});
		//
		// 	expect(wrapper.state('location')).toBe('My house');
		// });

		it('changes category state onChange')
		// , async () => {
		// 	const wrapper = await mount(<NewEventPopup/>);
		// 	wrapper.find('.category-input')
		// 		.simulate('change', {target: {value: 'Other'}});
		//
		// 	expect(wrapper.state('category')).toBe('Other');
		// });

		it('changes startTime state onChange')
		// , async () => {
		// 	const value = moment().add(10, 'days');
		// 	const wrapper = await mount(<NewEventPopup/>);
		//
		// 	wrapper.find('.start-time-picker-container input').at(0)
		// 		.simulate('change', { target: { value: value } });
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

	describe('handleSubmit', () => {
		it('calls preventDefault on event')
		// , async () => {
		// 	const event = { preventDefault: sinon.spy() };
		// 	const wrapper = await mount(<NewEventPopup/>);
		// 	wrapper.instance().handleSubmit(event);
		//
		// 	expect(event.preventDefault.calledOnce).toBe(true);
		// });

		const createEvent = async (title, description, category, startTime, history) => {
			cookies.set({ user: mocks.user, auth_token: "valid" });
			const wrapper = await mount(<NewEventPopup history={history} />);
			wrapper.setState({ categories: [category] });

			// Type all fields and submit
			wrapper.find('input').at(0).simulate('change', { target: { value: title } });
			wrapper.find('input').at(1).simulate('change', { target: { value: description } });
			wrapper.find('input').at(2).simulate('change', { target: { value: category.name } });
			wrapper.find('input').at(3).simulate('change', { target: { value: startTime } });
			wrapper.find('form').simulate('submit');
			await wrapper.wait();

			return wrapper;
		};

		it('redirects to MyEvents page after successful registering')
		// , async () => {
		// 	const history = { push: sinon.spy() };
		// 	const wrapper = await createEvent(mocks.event.title, mocks.event.description,
		// 		mocks.categories[0], DEFAULT_TIME, history);
		//
		// 	expect(history.push.calledOnce).toBe(true);
		// 	expect(history.push.calledWith('/events')).toBe(true);
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
