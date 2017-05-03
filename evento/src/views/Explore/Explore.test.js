import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import Explore from './';

import api from '../../api';

const eventMocks = Mock.generateEvents(5);
const eventFilterer = (events) => events;

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<Explore filterEvents={eventFilterer} />, div);
});

it('fetches events', async () => {
	fetchMock.get('/events', eventMocks);

	const explore = mount(<Explore filterEvents={eventFilterer} />)
	await waitForFetches();

	expect(explore.state('events')).toEqual(eventMocks);
});

it('calls callback on click', async () => {
	fetchMock.get('/events', eventMocks);

	const history = { push: sinon.spy() };
	const explore = mount(<Explore filterEvents={eventFilterer} history={history} />)
	await waitForFetches();

	explore.find('EventCard').at(1).simulate('click');

	expect(history.push.calledWith(`/event/${eventMocks[1].id}`)).toBe(true);
});

it('filters events', async () => {
	fetchMock.get('/events', eventMocks);
	const customFilterer = (events) => events.filter(e => e === events[1]);

	const explore = mount(<Explore filterEvents={customFilterer} />)
	await waitForFetches();
	const eventCards = explore.instance().filteredEvents;

	expect(eventCards).toEqual([eventMocks[1]]);
});

it('shows error when getting events fails', async () => {
	sinon.stub(api, "getEvents").callsFake(async (eventId) => {
		 return { success: false, error: { message: "Error!" } };
	});

	const explore = mount(<Explore filterEvents={eventFilterer} />)
	await waitForFetches();

	expect(explore.text()).toContain("Error!");
});
