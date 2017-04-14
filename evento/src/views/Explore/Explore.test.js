import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import Explore from './';

const eventMocks = [
	{
		id: 1,
		title: "Piano",
		description: "Piano lesson",
		time: '2017-04-11T15:17:49.882Z',
		category: { name: "Music" },
		creator: { name: "Jaakko" }
	},
	{
		id: 2,
		title: "Badminton",
		description: "Badminton lesson",
		time: '2017-05-11T15:17:49.882Z',
		category: { name: "Sports" },
		creator: { name: "Antti" }
	}
];

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
