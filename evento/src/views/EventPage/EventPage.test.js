import React from 'react';
import ReactDOM from 'react-dom';
import Cookie from 'js-cookie';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import EventPage from './';

const event = Mock.generateEvent();
const attendees = Mock.generateUsers(3);

const matchMock = { params: { eventId: event.id } };

describe('EventPage', () => {
	// Clear cookies and restore mocks
	afterEach(() => {
		Object.keys(Cookie.get()).forEach(function(cookie) {
			Cookie.remove(cookie);
		});
		fetchMock.restore();
	});

	describe('render', () => {
			it('renders without crashing', async () => {
			const div = document.createElement('div');
			ReactDOM.render(<EventPage match={matchMock} />, div);
		});

		it('displays error message if event not found', async () => {
			const INVALID_ID = 5;
			const invalidMatchMock = { params: { eventId: INVALID_ID } };
			fetchMock.get(`begin:/events/`, 404);

			const eventPage = mount(<EventPage match={invalidMatchMock} />)
			await waitForFetches();

			expect(eventPage.text()).toContain("Something went wrong");
		});

		it('renders a AttendButton when user is not attending event', async () => {
			fetchMock.get(`/events/${event.id}`, event);
			fetchMock.get(`/events/${event.id}/attendees`, attendees);
			Cookie.set("user", Mock.generateUser()); // Random user

			const eventPage = mount(<EventPage match={matchMock} />);
			await waitForFetches();

			expect(eventPage.find('.Attend').length).toBe(1);
			expect(eventPage.find('.DoNotAttend').length).toBe(0);
		});

		it('renders a DoNotAttendButton when user is attending event', async () => {
			fetchMock.get(`/events/${event.id}`, event);
			fetchMock.get(`/events/${event.id}/attendees`, attendees);
			Cookie.set("user", attendees[0]);

			const eventPage = mount(<EventPage match={matchMock} />)
			await waitForFetches();

			expect(eventPage.find('.Attend').length).toBe(0);
			expect(eventPage.find('.DoNotAttend').length).toBe(1);
		});
	});

	it('fetches event and attendees', async () => {
		fetchMock.get(`/events/${event.id}`, event);
		fetchMock.get(`/events/${event.id}/attendees`, attendees);

		const eventPage = mount(<EventPage match={matchMock} />)
		await waitForFetches();

		expect(eventPage.state('event')).toEqual(event);
		expect(eventPage.state('attendees')).toEqual(attendees);
	});

	describe('isUserAttending', () => {
		it('returns true when user is attending the event', async () => {
			const eventPage = mount(<EventPage match={matchMock} />)
			eventPage.setState({ attendees: attendees });
			Cookie.set("user", attendees[attendees.length - 1]);
			await waitForFetches();

			expect(eventPage.instance().isUserAttending()).toBe(true);
		});

		it('returns false when user is not attending the event', async () => {
			const eventPage = mount(<EventPage match={matchMock} />)
			eventPage.setState({ attendees: attendees });
			Cookie.set("user", Mock.generateUser()); // Random user
			await waitForFetches();

			expect(eventPage.instance().isUserAttending()).toBe(false);
		});

		it('returns false when user cookie is missing', async () => {
			const eventPage = mount(<EventPage match={matchMock} />)
			eventPage.setState({ attendees: attendees });
			await waitForFetches();

			expect(eventPage.instance().isUserAttending()).toBe(false);
		});
	});

	describe('onAttendButtonClick', () => {
		it('sends a post to request to /event/:id/attendees when user not attending', async () => {
			fetchMock.get(`/events/${event.id}`, event);
			fetchMock.get(`/events/${event.id}/attendees`, attendees);
			Cookie.set("user", Mock.generateUser());
			Cookie.set("auth_token", "ABCD123");

			const eventPage = mount(<EventPage match={matchMock} />);
			await waitForFetches();

			fetchMock.restore();
			fetchMock.post(`/events/${event.id}/attendees`, {
				status: 200,
				body: {attendees}
			});

			eventPage.find('.Attend').simulate('click');
			await waitForFetches();

			expect(fetchMock.called(`/events/${event.id}/attendees`)).toBe(true);
		});

		it('adds error message on unsuccessiful request', async () => {
			fetchMock.get(`/events/${event.id}`, event);
			fetchMock.get(`/events/${event.id}/attendees`, attendees);
			fetchMock.post(`/events/${event.id}/attendees`, 401);
			Cookie.set("user", Mock.generateUser());
			Cookie.set("auth_token", "ABCD123");

			const eventPage = mount(<EventPage match={matchMock} />);
			await waitForFetches();

			eventPage.find('.Attend').simulate('click');
			await waitForFetches();

			expect(eventPage.state('errorMessage')).toEqual("Something went wrong");
		});
	});

	describe('onDoNotAttendButtonClick', () => {
		it('sends a delete to request to /event/:id/attendees when user is attending');
	});
});
