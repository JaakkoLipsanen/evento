import React from 'react';
import ReactDOM from 'react-dom';
import EventPopup from './';

import api from '../../api';
import { mount, mocks, cookies, createSinonSandbox, renderToDOM } from '../../test-helpers';

const matchMocks = {
	valid: { eventId: mocks.event.id, params: { eventId: mocks.event.id } },
	invalid: { eventId: 99999, params: { eventId: 99999 } }
};

describe('EventPopup', () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true });
	afterEach(() => { cookies.reset(); });

	const mockGetEventSuccess = (eventId) => {
		sinon.stub(api, "getEvent")
			.withArgs(eventId)
			.callsFake(() => mocks.api.responses.create({ event: mocks.event }));
	};

	const mockGetAttendeesSuccess = (eventId) => {
		sinon.stub(api, "getAttendees")
			.withArgs(eventId)
			.callsFake(() => mocks.api.responses.create({ attendees: mocks.attendees }));
	};

	const mockGetEventFailure = (eventId) => {
		sinon.stub(api, "getEvent")
			.withArgs(eventId)
			.callsFake(() => mocks.api.responses.DefaultError);
	};

	const mockGetAttendeesFailure = (eventId) => {
		sinon.stub(api, "getAttendees")
			.withArgs(eventId)
			.callsFake(() => mocks.api.responses.DefaultError);
	};

	describe('render', () => {
		it('renders without crashing', async () => {
			const div = document.createElement('div');
			renderToDOM(<EventPopup match={matchMocks.valid} />, div);
		});

		it('displays error message if event not found', async () => {
			mockGetEventFailure(matchMocks.invalid.eventId);

			const eventPage = await mount(<EventPopup match={matchMocks.invalid} />);
			expect(eventPage.text()).toContain(api.DEFAULT_ERROR_MESSAGE);
		});

		it('displays error message if getAttendees returns error', async () => {
			mockGetEventSuccess(matchMocks.invalid.eventId);
			mockGetAttendeesFailure(matchMocks.invalid.eventId);

			const eventPage = await mount(<EventPopup match={matchMocks.invalid} />)
			expect(eventPage.text()).toContain(api.DEFAULT_ERROR_MESSAGE);
		});

		it('renders a AttendButton when user is not attending event', async () => {
			mockGetEventSuccess(matchMocks.valid.eventId);
			mockGetAttendeesSuccess(matchMocks.valid.eventId);

			cookies.set({ user: mocks.user, auth_token: "valid" });
			const eventPage = await mount(<EventPopup match={matchMocks.valid} />);

			expect(eventPage.find('.Attend').length).toBe(1);
			expect(eventPage.find('.DoNotAttend').length).toBe(0);
		});

		it('renders a DoNotAttendButton when user is attending event', async () => {
			mockGetEventSuccess(matchMocks.valid.eventId);
			mockGetAttendeesSuccess(matchMocks.valid.eventId);

			cookies.set({ user: mocks.attendees[0], auth_token: "valid" });
			const eventPage = await mount(<EventPopup match={matchMocks.valid} />)

			expect(eventPage.find('.Attend').length).toBe(0);
			expect(eventPage.find('.DoNotAttend').length).toBe(1);
		});
	});

	it('sets event and attendees', async () => {
		mockGetEventSuccess(matchMocks.valid.eventId);
		mockGetAttendeesSuccess(matchMocks.valid.eventId);

		const eventPage = await mount(<EventPopup match={matchMocks.valid} />)
		expect(eventPage.state('event')).toEqual(mocks.event);
		expect(eventPage.state('attendees')).toEqual(mocks.attendees);
	});

	describe('isUserAttending', () => {
		it('returns true when user is attending the event', async () => {
			const eventPage = await mount(<EventPopup match={matchMocks.valid} />)

			eventPage.setState({ attendees: mocks.attendees });
			cookies.set({ user:  mocks.attendees[mocks.attendees.length - 1] });

			expect(eventPage.instance().isUserAttending()).toBe(true);
		});

		it('returns false when user is not attending the event', async () => {
			const eventPage = await mount(<EventPopup match={matchMocks.valid} />)
			eventPage.setState({ attendees: mocks.attendees });
			cookies.set({ user: mocks.user, auth_token: "valid" }); // Non attending user

			expect(eventPage.instance().isUserAttending()).toBe(false);
		});

		it('returns false when user cookie is missing', async () => {
			const eventPage = await mount(<EventPopup match={matchMocks.valid} />)
			eventPage.setState({ attendees: mocks.attendees });

			expect(eventPage.instance().isUserAttending()).toBe(false);
		});
	});

	describe('updateIsAttending', () => {
		beforeEach(() => {
			mockGetEventSuccess(matchMocks.valid.eventId);
			mockGetAttendeesSuccess(matchMocks.valid.eventId);

			sinon.stub(api, "updateIsAttending")
				.withArgs(matchMocks.valid.eventId, sinon.match.any)
				.callsFake(() => mocks.api.responses.DefaultSuccess);

			cookies.set({ user: mocks.generate.user(), auth_token: "ABCD123" });
		});

		it('is called with true value when AttendButton is clicked', async () => {
			const eventPage = await mount(<EventPopup match={matchMocks.valid} />);
			const updateIsAttending = sinon.spy(eventPage.instance(), 'updateIsAttending');

			eventPage.find('.Attend').simulate('click');
			expect(updateIsAttending.calledOnce).toBe(true);
			expect(updateIsAttending.calledWith(true)).toBe(true);
		});

		it('is called with true value when DoNotAttendButon is clicked', async () => {
			cookies.set({ user: mocks.attendees[0], auth_token: "valid" });

			const eventPage = await mount(<EventPopup match={matchMocks.valid} />);
			const updateIsAttending = sinon.spy(eventPage.instance(), 'updateIsAttending');

			eventPage.find('.DoNotAttend').simulate('click');

			expect(updateIsAttending.calledOnce).toBe(true);
			expect(updateIsAttending.calledWith(false)).toBe(true);
		});

		it('fetches attendees again after succesful update', async () => {
			cookies.set({ user: mocks.attendees[0], auth_token: "valid" });

			const eventPage = await mount(<EventPopup match={matchMocks.valid} />);
			const fetchAttendees = sinon.spy(eventPage.instance(), "fetchAttendees");

			eventPage.find('.DoNotAttend').simulate('click');
			await eventPage.wait();

			expect(fetchAttendees.called).toBe(true);
			expect(fetchAttendees.calledWith(matchMocks.valid.eventId)).toBe(true);
		});

		it('sends a post request to /events/:id/attendees when user not attending', async () => {
			const eventPage = await mount(<EventPopup match={matchMocks.valid} />);

			sinon.restore(); // restore updateIsAttending mock
			const updateIsAttending = sinon.spy(api, "updateIsAttending");
			eventPage.find('.Attend').simulate('click');

			expect(updateIsAttending.calledWith(matchMocks.valid.eventId)).toBe(true);
		});

		it('sends a delete request to /events/:id/attendees when user is attending', async () => {
			cookies.set({ user: mocks.attendees[0], auth_token: "valid" });
			const eventPage = await mount(<EventPopup match={matchMocks.valid} />);

			sinon.restore(); // restore updateIsAttending mock
			const updateIsAttending = sinon.spy(api, "updateIsAttending");
			eventPage.find('.DoNotAttend').simulate('click');

			expect(updateIsAttending.calledWith(mocks.event.id)).toBe(true);
		});

		it('adds error message on unsuccessful request', async () => {
			sinon.restore();

			mockGetEventSuccess(matchMocks.valid.eventId);
			mockGetAttendeesSuccess(matchMocks.valid.eventId);

			sinon.stub(api, "updateIsAttending")
				.withArgs(matchMocks.valid.eventId, sinon.match.any)
				.callsFake(() => mocks.api.responses.DefaultError);

			const eventPage = await mount(<EventPopup match={matchMocks.valid} />);
			eventPage.find('.Attend').simulate('click');
			await eventPage.wait();

			expect(eventPage.state('errorMessage')).toEqual(api.DEFAULT_ERROR_MESSAGE);
		});
	});
});
