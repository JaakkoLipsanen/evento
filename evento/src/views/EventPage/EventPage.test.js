import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import EventPage from './';

const event = {
	id: 1,
	title: "Piano",
	description: "Piano lesson",
	time: "2017-04-11T15:17:49.873Z",
	category: { name: "Music" },
	creator: { name: "Jaakko" }
}

const attendees = [
	{
		id: 1,
		name: "Antti",
		email: "antti@gmail.com"
	}
];

const matchMock = { params: { eventId: event.id } };

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<EventPage match={matchMock} />, div);
});

it('fetches event and attendees', async () => {
	fetchMock.get(`/events/${event.id}`, event);
	fetchMock.get(`/events/${event.id}/attendees`, attendees);

	const eventPage = mount(<EventPage match={matchMock} />)
	await waitForFetches();

	expect(eventPage.state('event')).toEqual(event);
	expect(eventPage.state('attendees')).toEqual(attendees);
});

it('displays error message if event not found', async () => {
	const INVALID_ID = 5;
	const invalidMatchMock = { params: { eventId: INVALID_ID } };
	fetchMock.get(`^/events/`, 404);

	const eventPage = mount(<EventPage match={invalidMatchMock} />)
	await waitForFetches();

	expect(eventPage.text()).toContain("Something went wrong");
});
