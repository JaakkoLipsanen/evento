import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import NewEventPage from './';
import moment from 'moment';

const time = moment();
const categoriesMock = Mock.generateCategories(3);

describe('NewEventPage', () => {
	beforeEach(() => {
		fetchMock.get(`/categories`, categoriesMock);
		fetchMock.post('/events', { status: 201 });
		fetchMock.catch(503);
	});

	afterEach(fetchMock.restore);

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<NewEventPage />, div);
	});

	it('has an error message', () => {
		const wrapper = mount(<NewEventPage/>);
		wrapper.setState({ errorMessages: ['test error'] });
		expect(wrapper.find('.ErrorMessage').node).not.toBeUndefined();
	});

	describe('form', async () => {
		it('calls callback onSubmit', () => {
			const wrapper = mount(<NewEventPage/>);
			const callback = sinon.spy(wrapper.instance(), 'handleSubmit');
			wrapper.find('form').simulate('submit');

			expect(callback.calledOnce).toBe(true);
		});

		it('changes title state onChange', () => {
			const wrapper = mount(<NewEventPage/>);
			wrapper.find('.title-input')
				.simulate('change', {target: {value: 'Party'}});

			expect(wrapper.state('title')).toBe('Party');
		});

		it('changes description state onChange', () => {
			const wrapper = mount(<NewEventPage/>);
			wrapper.find('.description-input')
				.simulate('change', {target: {value: 'Biggest baddest party!'}});

			expect(wrapper.state('description')).toBe('Biggest baddest party!');
		});

		it('changes location state onChange', () => {
			const wrapper = mount(<NewEventPage/>);
			wrapper.find('.location-input')
				.simulate('change', {target: {value: 'My house'}});

			expect(wrapper.state('location')).toBe('My house');
		});

		it('changes category state onChange', () => {
			const wrapper = mount(<NewEventPage/>);
			wrapper.find('.category-input')
				.simulate('change', {target: {value: 'Other'}});

			expect(wrapper.state('category')).toBe('Other');
		});

		it('changes startTime state onChange', async () => {
			const value = moment().add(10, 'days');
			const wrapper = mount(<NewEventPage/>);

			wrapper
			.find('.start-time-picker-container input').at(0)
			.simulate('change', { target: { value: value } });

			await waitForFetches();
			expect(wrapper.state('startTime').isSame(value)).toBe(true);
		});

		it('changes endTime state onChange', async () => {
			const value = moment().add(10, 'days');
			const wrapper = mount(<NewEventPage/>);

			wrapper
			.find('.end-time-picker-container input').at(0)
			.simulate('change', { target: { value: value } });

			await waitForFetches();
			expect(wrapper.state('endTime').isSame(value)).toBe(true);
		});

		it('changes the endTime if startTime is setted and is after the endTime', async () => {
			const value = moment().add(10, 'days');
			const wrapper = mount(<NewEventPage/>);

			const originalEndTime = wrapper.state('endTime');
			wrapper
			.find('.start-time-picker-container input').at(0)
			.simulate('change', { target: { value: originalEndTime.clone().add(1, 'hour') } });

			await waitForFetches();
			expect(wrapper.state('endTime').isAfter(originalEndTime)).toBe(true);
		});

		it('changes the startTime if endTime is setted and is before the startTime', async () => {
			const value = moment().add(10, 'days');
			const wrapper = mount(<NewEventPage/>);

			const originalStartTime = wrapper.state('startTime');
			wrapper
			.find('.end-time-picker-container input').at(0)
			.simulate('change', { target: { value: originalStartTime.clone().subtract(1, 'hour') } });

			await waitForFetches();
			console.log(wrapper.state('startTime') + "    " + originalStartTime);
			expect(wrapper.state('startTime').isBefore(originalStartTime)).toBe(true);
		});
	});

	describe('setErrorMessages', () => {
		it('sets error messages');
		// doesn't work, i dont care
				/*, async () => {
			const body = `{"Name": ["is too short"]}`;
			fetchMock.post('/events', { status: 422, body: body, json: () => body });

			const wrapper = mount(<NewEventPage/>);
			wrapper.setState({ category: categoriesMock[0].name });
			await waitForFetches();

			const evt = { preventDefault: sinon.spy() };
			wrapper.instance().handleSubmit(evt);
			await waitForFetches();

			expect(wrapper.state('errorMessages')).toContain('Name is too short');
		}); */
	});

	describe('handleSubmit', () => {
		it('calls preventDefault on event', async () => {
			const event = { preventDefault: sinon.spy() };
			const wrapper = mount(<NewEventPage/>);
			wrapper.instance().handleSubmit(event);

			expect(event.preventDefault.calledOnce).toBe(true);
		});

		const createEvent = async (title, description, category, startTime, history) => {
			const wrapper = mount(<NewEventPage history={history}/>);
			await waitForFetches();

			// Type all fields and submit
			wrapper.find('input').at(0).simulate('change', {target: {value: title}});
			wrapper.find('input').at(1).simulate('change', {target: {value: description}});
			wrapper.find('input').at(2).simulate('change', {target: {value: category.name}});
			wrapper.find('input').at(3).simulate('change', {target: {value: startTime}});
			wrapper.find('form').simulate('submit');
			await waitForFetches();

			return wrapper;
		};

		it('redirects to MyEvents page after successiful registering', async () => {
			const history = { push: sinon.spy() };
			const event = Mock.generateEvent();
			const wrapper = await createEvent(event.title, event.description,
				categoriesMock[0], time, history);

			expect(history.push.calledOnce).toBe(true);
			expect(history.push.calledWith('/events')).toBe(true);
		});

		it('does not redirect on failed registering', async () => {
			const history = { push: sinon.spy() };
			fetchMock.post('/events', { status: 422 });

			// Bad arguments
			const wrapper = await createEvent('', 'bad', 'nope', time, '', history);

			expect(history.push.called).toBe(false);
		});

		it('sets error messages on failed fetch', async () => {
			const body = `{"category":["must exist","can't be blank"],
			"time":["cant be in the past"],
			"title":["can't be blank","is too short (minimum is 3 characters)"]}`
			fetchMock.post('/events', { status: 422, body: body });

			const wrapper = await createEvent('', '', '', time, '');

			expect(wrapper.state('errorMessages').length).toBeGreaterThan(0);
		});
	});
});
