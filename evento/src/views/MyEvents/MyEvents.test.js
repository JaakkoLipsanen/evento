import React from 'react';
import ReactDOM from 'react-dom';;
import MyEvents from './';

import session from '../../session';
import api from '../../api';
import { mount, mocks, cookies, createSinonSandbox } from '../../test-helpers';

const VALID_COOKIES = { user: mocks.user, auth_token: "valid" };
const INVALID_COOKIES = { user: mocks.user, auth_token: "invalid" };

describe("MyEvents", () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true });

	beforeEach(() => {
		cookies.reset();

		// mocks getUserEvents, checks if cookies/session is correct
		sinon.stub(api, "getUserEvents")
			.callsFake(() => {
				// logged in, but wrong user/auth_token
				if(!session.isLoggedIn()) {
					return mocks.api.responses.createError({ type: "auth", message: api.NOT_LOGGED_IN_MESSAGE });
				}

				const valid =
					session.getUser().id === VALID_COOKIES.user.id &&
				   session.getAuthToken() === VALID_COOKIES.auth_token;

				if(valid) {
					return mocks.api.responses.create({ events: mocks.events });
				}

				return mocks.api.responses.createError({ type: "auth", message: api.DEFAULT_ERROR_MESSAGE });
		});
	});

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<MyEvents />, div);
	});

	it('shows error if user is not logged in', async () => {
		const myEventsPage = await mount(<MyEvents />);
		expect(myEventsPage.text()).toEqual(api.NOT_LOGGED_IN_MESSAGE);
	});

	it('shows error if given incorrect parameters', async () => {
		cookies.set(INVALID_COOKIES);

		const myEventsPage = await mount(<MyEvents />);
		expect(myEventsPage.text()).toEqual(api.DEFAULT_ERROR_MESSAGE);
	});

	describe("user is logged in", () => {
		beforeEach(() => cookies.set(VALID_COOKIES));

		it('shows events if user is logged in', async () => {
			const myEventsPage = await mount(<MyEvents />);

			expect(myEventsPage.state('events')).toEqual(mocks.events);
			expect(myEventsPage.find('EventCard').length).toEqual(mocks.events.length);
		});

		it('updates history when event is clicked', async () => {
			const history = { push: sinon.spy() };
			const myEventsPage = await mount(<MyEvents history={history} />);

			myEventsPage.find('EventCard').at(1).simulate('click');
			expect(history.push.calledWith(`/event/${mocks.events[1].id}`)).toBe(true);
		});
	})
})
