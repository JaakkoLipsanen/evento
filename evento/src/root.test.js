import React from 'react';
import ReactDOM from 'react-dom';
import fetchMock from 'fetch-mock';

import api from './api';
import session from './session';
import config from './config';
import { mocks, test, cookies } from './test-helper';

const INVALID_ID = 999999;

const EMPTY_VALID_RESPONSE = { status: 200, body: { } };
const NOT_FOUND_RESPONSE = { status: 404, body: { } };

test('/src root files', (sinon) => {
	describe('api.js', () => {
		
		describe('getEvent', () => {
			it('returns correct result with correct parameters', async () => {
				fetchMock.get(`/events/${mocks.event.id}`, mocks.event);

				const result = await api.getEvent(mocks.event.id);
				expect(result.success).toBe(true);
				expect(result.payload.event).toEqual(mocks.event);
			});

			it('returns error with incorrect parameters', async () => {
				fetchMock.get(`/events/${INVALID_ID}`, NOT_FOUND_RESPONSE);

				const result = await api.getEvent(INVALID_ID);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("Something went wrong");
			});
		});

		describe('getEvents', () => {
			it('returns correct result with correct parameters', async () => {
				fetchMock.get(`/events`, mocks.events);

				const result = await api.getEvents();
				expect(result.success).toBe(true);
				expect(result.payload.events).toEqual(mocks.events);
			});

			it('returns error with incorrect parameters', async () => {
				fetchMock.get(`/events`, NOT_FOUND_RESPONSE);

				const result = await api.getEvents();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("Something went wrong");
			});
		});

		describe('getAttendees', () => {
			it('returns correct result with correct parameters', async () => {
				fetchMock.get(`/events/${mocks.event.id}/attendees`, mocks.users);

				const result = await api.getAttendees(mocks.event.id);
				expect(result.success).toBe(true);
				expect(result.payload.attendees).toEqual(mocks.users);
			});

			it('returns error with incorrect parameters', async () => {
				fetchMock.get(`/events/${INVALID_ID}/attendees`, NOT_FOUND_RESPONSE);

				const result = await api.getAttendees(INVALID_ID);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("Something went wrong");
			});
		});

		describe('getUserEvents', () => {
			it('returns events if user is logged in', async () => {
				Mock.setCookies({ user: mocks.user, auth_token: "valid" });
				fetchMock.get(`/users/${mocks.user.id}/events`, mocks.events);

				const result = await api.getUserEvents();
				expect(result.success).toBe(true);
				expect(result.payload.events).toEqual(mocks.events);
			});

			it('returns error if user is not logged in', async () => {
				fetchMock.get(`/users/${mocks.user.id}/events`, NOT_FOUND_RESPONSE);

				const result = await api.getUserEvents();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("You must be logged in");
			});

			it('returns error if the client logged in status differs from servers logged in status', async () => {
				Mock.setCookies({ user: mocks.user, auth_token: "valid" });
				fetchMock.get(`/users/${mocks.user.id}/events`, NOT_FOUND_RESPONSE);

				const result = await api.getUserEvents();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("Something went wrong");
			});
		});

		describe('updateIsAttending', () => {
			it('updates to "is attending" if user is logged in', async () => {
				Mock.setCookies({ user: mocks.user, auth_token: "valid" });
				fetchMock.post(`/events/${mocks.event.id}/attendees`, EMPTY_VALID_RESPONSE);

				const result = await api.updateIsAttending(mocks.event.id, true);
				expect(result.success).toBe(true);
			});

			it('updates to "not attending" if user is logged in', async () => {
				Mock.setCookies({ user: mocks.user, auth_token: "valid" });
				fetchMock.delete(`/events/${mocks.event.id}/attendees`, EMPTY_VALID_RESPONSE);

				const result = await api.updateIsAttending(mocks.event.id, false);
				expect(result.success).toBe(true);
			});

			it('returns error if user is not logged in', async () => {
				fetchMock.delete(`/events/${mocks.event.id}/attendees`, EMPTY_VALID_RESPONSE);

				const result = await api.updateIsAttending(mocks.event.id, false);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("You must be logged in");
			});

			it('returns error if the client logged in status differs from servers logged in status', async () => {
				Mock.setCookies({ user: mocks.user, auth_token: "valid" });
				fetchMock.post(`/events/${mocks.event.id}/attendees`, NOT_FOUND_RESPONSE);

				const result = await api.updateIsAttending(mocks.event.id, true);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("Something went wrong");
			});
		});
	});

	// TODO: tests for api.register
	// TODO: tests for api.signin

	describe('session.js', () => {
		it('returns auth header if user is logged in', async () => {
			const cookies = { user: mocks.user, auth_token: "valid" };
			Mock.setCookies(cookies);

			expect(session.getAuthHeader().Authorization).toEqual(cookies.auth_token);
		});

		it('does not return auth header if user is not logged in', async () => {
			expect(session.getAuthHeader().Authorization).toBe(undefined);
		});

		it('returns user and auth_token if user is logged in', async () => {
			const cookies = { user: mocks.user, auth_token: "valid" };
			Mock.setCookies(cookies);

			expect(session.getUser()).toEqual(cookies.user);
			expect(session.getAuthToken()).toEqual(cookies.auth_token);
		});

		it('does not return user or auth_token if user is not logged in', async () => {
			expect(session.getUser()).toBeFalsy();
			expect(session.getAuthToken()).toBeFalsy();
		});

		it('returns isLoggedIn correctly', async () => {
			expect(session.isLoggedIn()).toBe(false);
			Mock.setCookies({ user: mocks.user, auth_token: "valid" });
			expect(session.isLoggedIn()).toBe(true);
		});
	});

	describe('config.js', () => {
		const originalFetch = fetch;
		afterEach(() => fetch = originalFetch);

		it("overrides fetch", async () => {
			const old = fetch;
			config.apply();

			expect(old === fetch).toBe(false);
		});

		it("sets base url", async () => {
			fetchMock.get(`${config.BaseURL}/test`, { });

			config.apply();
			const response = await fetch('/test');
			expect(response.ok).toBe(true);
		});

		it("sets default headers", async () => {
			fetchMock.get(`${config.BaseURL}/test`, (url, opts) =>
				JSON.stringify(
					opts.headers &&
					opts.headers["Content-Type"] === 'application/json' &&
					opts.headers["Access-Control-Allow-Origin"] === '*')
			);

			config.apply();
			const response = await fetch('/test');
			const result = await response.json();
			expect(result).toBe(true);
		});

		it("sets auth headers", async () => {
			const cookies = { user: mocks.user, auth_token: "plaa" };
			Mock.setCookies(cookies);

			fetchMock.get(`${config.BaseURL}/test`, (url, opts) =>
				JSON.stringify(
					opts.headers &&
					opts.headers["Authorization"] === cookies.auth_token)
			);

			config.apply();
			const response = await fetch('/test');
			const result = await response.json();
			expect(result).toBe(true);
		});
	});
});
