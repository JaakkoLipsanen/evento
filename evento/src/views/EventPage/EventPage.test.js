import React from 'react';
import ReactDOM from 'react-dom';
import Cookie from 'js-cookie';
import fetchMock from 'fetch-mock';
import EventPage from './';

import api from '../../api';
import testHelper from '../../test-helper';
const { test, mount, waitForFetches, mocks } = testHelper;

const matchMocks = {
	valid: { params: { eventId: mocks.event.id } },
	invalid: { params: { eventId: 99999 } }
};

// TODO: remove this after everything is changed to use matchMocks
const matchMock = matchMocks.valid;

test('EventPage', (sinon) => {

	describe('render', () => {
		it('renders without crashing', async () => {
			const div = document.createElement('div');
			ReactDOM.render(<EventPage match={matchMocks.valid} />, div);
		});

		it('displays error message if event not found', async () => {
			sinon.stub(api, "getEvent")
				.withArgs(matchMocks.invalid.params.eventId)
				.callsFake(mocks.api.responses.DefaultError);
				
			const eventPage = await mount(<EventPage match={matchMocks.invalid} />);
			expect(eventPage.text()).toContain(mocks.api.DefaultErrorMessage);
		});

		it('displays error message if getAttendees returns error', async () => {
			sinon.stub(api, "getEvent")
				.withArgs(matchMocks.invalid.params.eventId)
				.callsFake(() => mocks.api.responses.create({ event: mocks.event }));

			sinon.stub(api, "getAttendees")
				.withArgs(matchMocks.invalid.params.eventId)
				.callsFake(mocks.api.responses.DefaultError);

			const eventPage = await mount(<EventPage match={matchMocks.invalid} />)
			await waitForFetches();

			expect(eventPage.text()).toContain("Something went wrong");
		});

		it('renders a AttendButton when user is not attending event', async () => {
			fetchMock.get(`/events/${mocks.event.id}`, mocks.event);
			fetchMock.get(`/events/${mocks.event.id}/attendees`, mocks.attendees);
			Cookie.set("user", Mock.generateUser()); // Random user

			const eventPage = await mount(<EventPage match={matchMock} />);
			await waitForFetches();

			expect(eventPage.find('.Attend').length).toBe(1);
			expect(eventPage.find('.DoNotAttend').length).toBe(0);
		});

		it('renders a DoNotAttendButton when user is attending event', async () => {
			fetchMock.get(`/events/${mocks.event.id}`, mocks.event);
			fetchMock.get(`/events/${mocks.event.id}/attendees`, mocks.attendees);
			Cookie.set("user", mocks.attendees[0]);

			const eventPage = await mount(<EventPage match={matchMock} />)
			await waitForFetches();

			expect(eventPage.find('.Attend').length).toBe(0);
			expect(eventPage.find('.DoNotAttend').length).toBe(1);
		});
	});

	it('fetches event and mocks.attendees', async () => {
		fetchMock.get(`/events/${mocks.event.id}`, mocks.event);
		fetchMock.get(`/events/${mocks.event.id}/attendees`, mocks.attendees);

		const eventPage = await mount(<EventPage match={matchMock} />)
		await waitForFetches();

		expect(eventPage.state('event')).toEqual(mocks.event);
		expect(eventPage.state('attendees')).toEqual(mocks.attendees);
	});

	describe('isUserAttending', () => {
		it('returns true when user is attending the event', async () => {
			const eventPage = await mount(<EventPage match={matchMock} />)
			eventPage.setState({ attendees: mocks.attendees });
			Cookie.set("user", mocks.attendees[mocks.attendees.length - 1]);
			await waitForFetches();

			expect(eventPage.instance().isUserAttending()).toBe(true);
		});

		it('returns false when user is not attending the event', async () => {
			const eventPage = await mount(<EventPage match={matchMock} />)
			eventPage.setState({ attendees: mocks.attendees });
			Cookie.set("user", Mock.generateUser()); // Random user
			await waitForFetches();

			expect(eventPage.instance().isUserAttending()).toBe(false);
		});

		it('returns false when user cookie is missing', async () => {
			const eventPage = await mount(<EventPage match={matchMock} />)
			eventPage.setState({ attendees: mocks.attendees });
			await waitForFetches();

			expect(eventPage.instance().isUserAttending()).toBe(false);
		});
	});

	describe('updateIsAttending', () => {
		beforeEach(() => {
			fetchMock.get(`/events/${mocks.event.id}`, mocks.event);
			fetchMock.get(`/events/${mocks.event.id}/attendees`, mocks.attendees);
			fetchMock.post(`/events/${mocks.event.id}/attendees`, {
				status: 200,
				body: { attendees: mocks.attendees }
			});

			Cookie.set("user", Mock.generateUser());
			Cookie.set("auth_token", "ABCD123");
		});

		it('is called with true value when AttendButton is clicked', async () => {
			const eventPage = await mount(<EventPage match={matchMock} />);
			await waitForFetches();

			const updateIsAttending = sinon.spy(eventPage.instance(), 'updateIsAttending');

			eventPage.find('.Attend').simulate('click');
			await waitForFetches();

			expect(updateIsAttending.calledOnce).toBe(true);
			expect(updateIsAttending.calledWith(true)).toBe(true);
		});

		it('is called with true value when DoNotAttendButon is clicked', async () => {
			fetchMock.delete(`/events/${mocks.event.id}/attendees`, 200);
			Cookie.set("user", mocks.attendees[0]);

			const eventPage = await mount(<EventPage match={matchMock} />);
			await waitForFetches();

			const updateIsAttending = sinon.spy(eventPage.instance(), 'updateIsAttending');

			eventPage.find('.DoNotAttend').simulate('click');
			await waitForFetches();

			expect(updateIsAttending.calledOnce).toBe(true);
			expect(updateIsAttending.calledWith(false)).toBe(true);
		});

		it('sends a post request to /events/:id/attendees when user not attending', async () => {
			const eventPage = await mount(<EventPage match={matchMock} />);
			await waitForFetches();

			// Reset fetchMock to reset "called" counter
			fetchMock.reset();

			eventPage.find('.Attend').simulate('click');
			await waitForFetches();

			expect(fetchMock.called(`/events/${mocks.event.id}/attendees`)).toBe(true);
		});

		it('sends a delete request to /events/:id/attendees when user is attending', async () => {
			fetchMock.delete(`/events/${mocks.event.id}/attendees`, 200);
			Cookie.set("user", mocks.attendees[0]);

			const eventPage = await mount(<EventPage match={matchMock} />);
			await waitForFetches();

			// Reset fetchMock to reset "called" counter
			fetchMock.reset();

			eventPage.find('.DoNotAttend').simulate('click');
			await waitForFetches();

			expect(fetchMock.called(`/events/${mocks.event.id}/attendees`)).toBe(true);
		});

		it('adds error message on unsuccessiful request', async () => {
			fetchMock.restore();
			fetchMock.get(`/events/${mocks.event.id}`, mocks.event);
			fetchMock.get(`/events/${mocks.event.id}/attendees`, mocks.attendees);
			fetchMock.post(`/events/${mocks.event.id}/attendees`, { status: 401, body: '{ }' });

			const eventPage = await mount(<EventPage match={matchMock} />);
			await waitForFetches();

			eventPage.find('.Attend').simulate('click');
			await waitForFetches();

			expect(eventPage.state('errorMessage')).toEqual("Something went wrong");
		});
	});
});
