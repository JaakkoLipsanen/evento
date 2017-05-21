import React from 'react';
import ReactDOM from 'react-dom';
import EventPopup from './';

import api from '../../api';
import { mount, mocks, cookies, createSinonSandbox, renderToDOM } from '../../test-helpers';

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
			renderToDOM(<EventPopup />, div);
		});

		it('displays error message if getAttendees returns error', async () => {
			mockGetEventSuccess(mocks.event.id);
			mockGetAttendeesFailure(mocks.event.id);

			const eventPage = await mount(<EventPopup />)
			eventPage.instance().show(mocks.event)
			await eventPage.wait();

			expect(eventPage.text()).toContain(api.DEFAULT_ERROR_MESSAGE);
		});

		it('renders AttendButton', async () => {
			mockGetEventSuccess(mocks.event.id);
			mockGetAttendeesSuccess(mocks.event.id);

			cookies.set({ user: mocks.user, auth_token: "valid" });
			const eventPage = await mount(<EventPopup />);
			eventPage.instance().show(mocks.event)
			await eventPage.wait();

			expect(eventPage.find('AttendButton').length).toBe(1);
		});
	});

	it('sets event and attendees', async () => {
		mockGetEventSuccess(mocks.event.id);
		mockGetAttendeesSuccess(mocks.event.id);

		const eventPage = await mount(<EventPopup />)
		eventPage.instance().show(mocks.event)
		await eventPage.wait();

		expect(eventPage.state('event')).toEqual(mocks.event);
		expect(eventPage.state('attendees')).toEqual(mocks.attendees);
	});

	describe('isUserAttending', () => {
		it('returns true when user is attending the event', async () => {
			const eventPage = await mount(<EventPopup />)

			eventPage.setState({ attendees: mocks.attendees });
			cookies.set({ user:  mocks.attendees[mocks.attendees.length - 1] });

			expect(eventPage.instance().isUserAttending()).toBe(true);
		});

		it('returns false when user is not attending the event', async () => {
			const eventPage = await mount(<EventPopup />)
			eventPage.setState({ attendees: mocks.attendees });
			cookies.set({ user: mocks.user, auth_token: "valid" }); // Non attending user

			expect(eventPage.instance().isUserAttending()).toBe(false);
		});

		it('returns false when user cookie is missing', async () => {
			const eventPage = await mount(<EventPopup />)
			eventPage.setState({ attendees: mocks.attendees });

			expect(eventPage.instance().isUserAttending()).toBe(false);
		});
	});

	describe('updateIsAttending', () => {
		beforeEach(() => {
			mockGetEventSuccess(mocks.event.id);
			mockGetAttendeesSuccess(mocks.event.id);

			sinon.stub(api, "updateIsAttending")
				.withArgs(mocks.event.id, sinon.match.any)
				.callsFake(() => mocks.api.responses.DefaultSuccess);

			cookies.set({ user: mocks.generate.user(), auth_token: "ABCD123" });
		});

		it('is called with true value when AttendButton is clicked when not attending', async () => {
			const eventPage = await mount(<EventPopup />);
			const updateIsAttending = sinon.spy(eventPage.instance(), 'updateIsAttending');

			eventPage.instance().show(mocks.event)
			await eventPage.wait();

			eventPage.find('button').simulate('click');

			expect(updateIsAttending.calledOnce).toBe(true);
			expect(updateIsAttending.calledWith(true)).toBe(true);
		});

		it('is called with true value when AttendButton is clicked when attending', async () => {
			cookies.set({ user: mocks.attendees[0], auth_token: "valid" });
			const eventPage = await mount(<EventPopup />);
			const updateIsAttending = sinon.spy(eventPage.instance(), 'updateIsAttending');

			eventPage.instance().show(mocks.event)
			await eventPage.wait();

			eventPage.find('button').simulate('click');

			expect(updateIsAttending.calledOnce).toBe(true);
			expect(updateIsAttending.calledWith(false)).toBe(true);
		});

		it('fetches attendees again after succesful update', async () => {
			cookies.set({ user: mocks.attendees[0], auth_token: "valid" });

			const eventPage = await mount(<EventPopup />);
			const fetchAttendees = sinon.spy(eventPage.instance(), "fetchAttendees");

			eventPage.instance().show(mocks.event)
			await eventPage.wait();

			eventPage.find('button').simulate('click');

			expect(fetchAttendees.called).toBe(true);
		});

		it('adds error message on unsuccessful request', async () => {
			sinon.restore();

			mockGetEventSuccess(mocks.event.id);
			mockGetAttendeesSuccess(mocks.event.id);

			sinon.stub(api, "updateIsAttending")
				.withArgs(mocks.event.id, sinon.match.any)
				.callsFake(() => mocks.api.responses.DefaultError);

			const eventPage = await mount(<EventPopup />);
			eventPage.instance().show(mocks.event)
			await eventPage.wait();

			eventPage.find('button').simulate('click');
			await eventPage.wait();

			expect(eventPage.state('errorMessage')).toEqual(api.DEFAULT_ERROR_MESSAGE);
		});
	});
});
