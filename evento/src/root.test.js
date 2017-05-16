import React from 'react';
import ReactDOM from 'react-dom';
import fetchMock from 'fetch-mock';
import moment from 'moment';

import api from './api';
import session from './session';
import config from './config';
import { mocks, cookies, createSinonSandbox } from './test-helpers';

const EMPTY_VALID_RESPONSE = { status: 200, body: { } };
const NOT_FOUND_RESPONSE = { status: 404, body: { } };

const INVALID_ID = 999999;
const DEFAULT_COOKIES = { user: mocks.user, auth_token: "valid" };

describe('/src root files', () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true, throwIfApiNotMocked: false });
	beforeEach(() => fetchMock.catch(404));
	afterEach(() => { fetchMock.restore(); cookies.reset(); });

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
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns default error if fetch fails', async () => {
				fetchMock.get(`/events/${INVALID_ID}`, () => { throw new Error() });

				const result = await api.getEvent(INVALID_ID)
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
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
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns default error if fetch fails', async () => {
				fetchMock.get(`/events`, () => { throw new Error() });

				const result = await api.getEvents()
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
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
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns default error if fetch fails', async () => {
				fetchMock.get(`/events/${INVALID_ID}/attendees`, () => { throw new Error() });

				const result = await api.getAttendees(INVALID_ID)
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});
		});

		describe('getCategories', () => {
			it('returns correct result with correct parameters', async () => {
				fetchMock.get(`/categories`, mocks.categories);

				const result = await api.getCategories();
				expect(result.success).toBe(true);
				expect(result.payload.categories).toEqual(mocks.categories);
			});

			it('returns error with incorrect parameters', async () => {
				fetchMock.get(`/categories`, NOT_FOUND_RESPONSE);

				const result = await api.getCategories();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns specific error with incorrect parameters if error is specified', async () => {
				fetchMock.get(`/categories`, { status: 401, body: { message: "Specific error" } });

				const result = await api.getCategories();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("Specific error");
			});

			it('returns default error if fetch fails', async () => {
				fetchMock.get(`/categories`, () => { throw new Error() });

				const result = await api.getCategories()
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});
		});

		describe('getUserEvents', () => {
			it('returns events if user is logged in', async () => {
				cookies.set(DEFAULT_COOKIES);
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
				cookies.set(DEFAULT_COOKIES);
				fetchMock.get(`/users/${mocks.user.id}/events`, NOT_FOUND_RESPONSE);

				const result = await api.getUserEvents();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns default error if fetch fails', async () => {
				cookies.set(DEFAULT_COOKIES);
				fetchMock.get(`/users/${mocks.user.id}/events`, () => { throw new Error() });

				const result = await api.getUserEvents();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});
		});

		describe('updateIsAttending', () => {
			it('updates to "is attending" if user is logged in', async () => {
				cookies.set(DEFAULT_COOKIES)
				fetchMock.post(`/events/${mocks.event.id}/attendees`, EMPTY_VALID_RESPONSE);

				const result = await api.updateIsAttending(mocks.event.id, true);
				expect(result.success).toBe(true);
			});

			it('updates to "not attending" if user is logged in', async () => {
				cookies.set(DEFAULT_COOKIES);
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
				cookies.set(DEFAULT_COOKIES);
				fetchMock.post(`/events/${mocks.event.id}/attendees`, NOT_FOUND_RESPONSE);

				const result = await api.updateIsAttending(mocks.event.id, true);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns default error if fetch fails', async () => {
				cookies.set(DEFAULT_COOKIES);
				fetchMock.post(`/events/${mocks.event.id}/attendees`, () => { throw new Error() });

				const result = await api.updateIsAttending(mocks.event.id, true);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});
		});


		describe('createNewEvent', () => {
			const VALID_EVENT = { title: "Plaa", description: "Ploo", categoryId: 2, startTime: moment().format() };
			it('shows error if not logged in', async () => {
				const result = await api.createNewEvent(VALID_EVENT);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.NOT_LOGGED_IN_MESSAGE);
			});

			it('does not call fetch if not logged in', async () => {
				fetchMock.post(`/events`, EMPTY_VALID_RESPONSE, { name: "new-event-fetch" });

				const result = await api.createNewEvent(VALID_EVENT);
				expect(result.success).toBe(false);
				expect(fetchMock.called("new-event-fetch")).toBe(false);
			});

			it('calls fetch', async () => {
				cookies.set(DEFAULT_COOKIES);
				fetchMock.post(`/events`, EMPTY_VALID_RESPONSE, { name: "new-event-fetch" });

				const result = await api.createNewEvent(VALID_EVENT);
				expect(result.success).toBe(true);
				expect(fetchMock.called("new-event-fetch")).toBe(true);
			});

			it('returns default error message if fails and not specified', async () => {
				cookies.set(DEFAULT_COOKIES);
				fetchMock.post(`/events`, NOT_FOUND_RESPONSE);

				const result = await api.createNewEvent(VALID_EVENT);
				expect(result.success).toBe(false);
				expect(result.error.messages).toContain(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns specific error message if fails and is specified', async () => {
				cookies.set(DEFAULT_COOKIES);
				fetchMock.post(`/events`, () => { return { status: 401, body: { title: ["is too short"] } } });

				const result = await api.createNewEvent(VALID_EVENT);
				expect(result.success).toBe(false);
				expect(result.error.messages).toContain("title is too short");
			});

			it('returns default error if fetch fails', async () => {
				cookies.set(DEFAULT_COOKIES);
				fetchMock.post(`/events`, () => { throw new Error() });

				const result = await api.createNewEvent(VALID_EVENT);
				expect(result.success).toBe(false);
				expect(result.error.messages).toContain(api.DEFAULT_ERROR_MESSAGE);
			});
		});

		describe('register', () => {
			const valid = { name: "Jii Jaa", email: "some@thing.com", password: "password1234" };
			const invalid = { name: "Plaa", email: "ploo@plaa.com", password: "short" };

			// async register(name, email, password) {
			it('calls fetch', async () => {
				fetchMock.post(`/users`, EMPTY_VALID_RESPONSE, { name: "register-fetch" });

				const result = await api.register(valid.name, valid.email, valid.password);
				expect(result.success).toBe(true);
				expect(fetchMock.called("register-fetch")).toBe(true);
			});

			it('calls fetch with correct parameters', async () => {
				fetchMock.post(`/users`, (url, opts) => {
					const body = JSON.parse(opts.body);
					const success =
						opts.method === 'POST' &&
						body.name === valid.name &&
						body.email === valid.email &&
						body.password === valid.password;

					return success ? EMPTY_VALID_RESPONSE : NOT_FOUND_RESPONSE;

				}, { name: "register-fetch" });

				const result = await api.register(valid.name, valid.email, valid.password);
				expect(result.success).toBe(true);
				expect(fetchMock.called("register-fetch")).toBe(true);
			});

			it('on fail returns error messages specifying what failed', async () => {
				fetchMock.post(`/users`, { status: 300, body: {
					email: ["is too short", "can't be blank"],
					password: ["is too short"]
				}});

				const result = await api.register(invalid.name, invalid.email, invalid.password);
				expect(result.success).toBe(false);
				expect(result.error.messages.length).toBe(3);
				expect(result.error.messages).toContain("email can't be blank");
			});

			it('returns default error if fetch fails', async () => {
				fetchMock.post(`/users`, () => { throw new Error() });

				const result = await api.register(invalid.name, invalid.email, invalid.password);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});
		});

		describe('signin', () => {
			const valid = { name: "Jii Jaa", email: "some@thing.com", password: "password1234" };
			const invalid = { name: "Plaa", email: "ploo@plaa.com", password: "short" };

			// async register(name, email, password) {
			it('calls fetch', async () => {
				fetchMock.post(`/authenticate`,
					{ status: 200, body: { user: mocks.user, auth_token: "valid" } },
					{ name: "signin-fetch" }
				);

				const result = await api.signin(valid.name, valid.password);
				expect(result.success).toBe(true);
				expect(fetchMock.called("signin-fetch")).toBe(true);
			});

			it('calls fetch with correct parameters', async () => {
				fetchMock.post(`/authenticate`, (url, opts) => {
					const body = JSON.parse(opts.body);
					const success =
						opts.method === 'POST' &&
						body.email === valid.email &&
						body.password === valid.password;

					return success ? EMPTY_VALID_RESPONSE : NOT_FOUND_RESPONSE;
				});

				const result = await api.signin(valid.email, valid.password);
				expect(result.success).toBe(true);
			});

			it('sets cookies', async () => {
				fetchMock.post(`/authenticate`, { status: 200, body: {
					user: mocks.user,
					auth_token: "valid"
				}});

				const result = await api.signin(valid.email, valid.password);
				expect(result.success).toBe(true);
				expect(session.getUser()).toEqual(mocks.user);
				expect(session.getAuthToken()).toEqual("valid");
			});

			it('returns invalid credentials if signin fails', async () => {
				fetchMock.post(`/authenticate`, NOT_FOUND_RESPONSE);

				const result = await api.signin(valid.email, valid.password);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.INVALID_CREDENTIALS_MESSAGE);
			});

			it('returns default error if fetch fails', async () => {
				fetchMock.post(`/authenticate`, () => { throw new Error() });

				const result = await api.signin(valid.email, valid.password);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns specific error if back-end returns specific error', async () => {
				fetchMock.post(`/authenticate`, { status: 300, body: { message: "Specific error" } });

				const result = await api.signin(valid.email, valid.password);
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("Specific error");
			});
		});

		describe('getAuthenticationStatus', () => {
			it('calls fetch if cookies are set', async () => {
				fetchMock.get(`/authentication`,
					{ status: 200, body: { authenticated: true } },
					{ name: "auth-fetch" }
				);

				cookies.set({ user: mocks.user, auth_token: "valid "});

				const result = await api.getAuthenticationStatus();
				expect(result.success).toBe(true);
				expect(fetchMock.called("auth-fetch")).toBe(true);
			});

			it('doesn\'t call fetch if cookies aren\'t set', async () => {
				fetchMock.get(`/authentication`,
					{ status: 200, body: { authenticated: true } },
					{ name: "auth-fetch" }
				);

				const result = await api.getAuthenticationStatus();
				expect(result.success).toBe(true);
				expect(fetchMock.called("auth-fetch")).toBe(false);
			});

			it('resets cookies if not authenticateds', async () => {
				fetchMock.get(`/authentication`,
					{ status: 200, body: { authenticated: false } }
				);

				cookies.set({ user: mocks.user, auth_token: "valid "});

				const result = await api.getAuthenticationStatus();
				expect(result.success).toBe(true);
				expect(session.getUser()).toBe(null);
				expect(session.getAuthToken()).toBe(null);
			});

			it('returns default error if fetch fails', async () => {
				fetchMock.get(`/authentication`, () => { throw new Error() });
				cookies.set({ user: mocks.user, auth_token: "valid "});

				const result = await api.getAuthenticationStatus();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual(api.DEFAULT_ERROR_MESSAGE);
			});

			it('returns specific error if back-end returns specific error', async () => {
				fetchMock.get(`/authentication`, { status: 300, body: { message: "Specific error" } });
				cookies.set({ user: mocks.user, auth_token: "valid "});

				const result = await api.getAuthenticationStatus();
				expect(result.success).toBe(false);
				expect(result.error.message).toEqual("Specific error");
			});
		});
	});

	describe('session.js', () => {
		it('returns auth header if user is logged in', async () => {
			cookies.set(DEFAULT_COOKIES);
			expect(session.getAuthHeader().Authorization).toEqual(DEFAULT_COOKIES.auth_token);
		});

		it('does not return auth header if user is not logged in', async () => {
			expect(session.getAuthHeader().Authorization).toBe(undefined);
		});

		it('returns user and auth_token if user is logged in', async () => {
			cookies.set(DEFAULT_COOKIES);

			expect(session.getUser()).toEqual(DEFAULT_COOKIES.user);
			expect(session.getAuthToken()).toEqual(DEFAULT_COOKIES.auth_token);
		});

		it('does not return user or auth_token if user is not logged in', async () => {
			expect(session.getUser()).toBeFalsy();
			expect(session.getAuthToken()).toBeFalsy();
		});

		it('returns isLoggedIn correctly', async () => {
			expect(session.isLoggedIn()).toBe(false);
			cookies.set(DEFAULT_COOKIES);
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
			fetchMock.get(`${config.ServerURL}/test`, { });

			config.apply();
			const response = await fetch('/test');
			expect(response.ok).toBe(true);
		});

		it("sets default headers", async () => {
			fetchMock.get(`${config.ServerURL}/test`, (url, opts) =>
				JSON.stringify(
					opts.headers &&
					opts.headers["Content-Type"] === 'application/json' &&
					opts.headers["Access-Control-Allow-Origin"] === '*')
			);

			config.apply(); // config applied after fetch-mock, so will override fetch-mock
			const response = await fetch('/test');
			const result = await response.json();
			expect(result).toBe(true);
		});

		it("sets auth headers", async () => {
			cookies.set(DEFAULT_COOKIES);

			fetchMock.get(`${config.ServerURL}/test`, (url, opts) =>
				JSON.stringify(
					opts.headers &&
					opts.headers["Authorization"] === DEFAULT_COOKIES.auth_token)
			);

			config.apply();
			const response = await fetch('/test');
			const result = await response.json();
			expect(result).toBe(true);
		});
	});
});
