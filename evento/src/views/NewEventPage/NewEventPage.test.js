import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import NewEventPage from './';
import moment from 'moment';

const time = moment();

describe('NewEventPage', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<NewEventPage />, div);
	});

	it('has an error message', () => {
		const wrapper = mount(<NewEventPage/>);
		wrapper.setState({ errorMessages: ['test error'] });
		expect(wrapper.find('.ErrorMessage').node).not.toBeUndefined();
	});

	describe('form', () => {
		it('calls callback onSubmit');
		it('changes title state onChange');
		it('changes description state onChange');
		it('changes location state onChange');
		it('changes category state onChange');
		it('changes startTime state onChange');
		it('changes endTime state onChange');
		it('shows startTime on end time input placeholder if endTime is not defined');
	});

	describe('handleSubmit', () => {
		beforeEach(() => 	fetchMock.restore());

		it('calls preventDefault on event', async () => {
			const event = { preventDefault: sinon.spy() };
			const wrapper = mount(<NewEventPage/>);
			wrapper.instance().handleSubmit(event);

			expect(event.preventDefault.calledOnce).toBe(true);
		});

		const createEvent = async (title, description, category, startTime, history) => {
			const wrapper = mount(<NewEventPage history={history}/>);

			// Type all fields and submit
			wrapper.find('input').at(0).simulate('change', {target: {value: title}});
			wrapper.find('input').at(1).simulate('change', {target: {value: description}});
			wrapper.find('input').at(2).simulate('change', {target: {value: category}});
			wrapper.find('input').at(3).simulate('change', {target: {value: startTime}});
			wrapper.find('form').simulate('submit');
			await waitForFetches();

			return wrapper;
		};

		it('redirects to MyEvents page after successiful registering', async () => {
			const history = { push: sinon.spy() };
			fetchMock.post('/events', { status: 201 });

			const event = Mock.generateEvent();
			const wrapper = await createEvent(event.title, event.description, 
				event.category, time, history);

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
