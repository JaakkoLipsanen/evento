import Cookie from 'js-cookie';
import session from './session';

const NOT_LOGGED_IN_MESSAGE = "You must be logged in";
const INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";
const DEFAULT_ERROR_MESSAGE = "Something went wrong";

const _createErrorResult = async (err) => {
	return { success: false, error: {
		type: err.type || "unknown",
		message: err.message || DEFAULT_ERROR_MESSAGE }
	};
}

// TODO: lots of duplicate code here!
export default {
	NOT_LOGGED_IN_MESSAGE: NOT_LOGGED_IN_MESSAGE,
	INVALID_CREDENTIALS_MESSAGE: INVALID_CREDENTIALS_MESSAGE,
	DEFAULT_ERROR_MESSAGE: DEFAULT_ERROR_MESSAGE,
	
	async getEvent(eventId) {
		try {
			const response = await fetch(`/events/${eventId}`);
			if(!response.ok) {
				throw response;
			}

			const event = await response.json();
			return { success: true, payload: { event: event } };
		}
		catch(err) {
			return await _createErrorResult(await err.json());
		}
	},

	async getEvents() {
		try {
			const response = await fetch('/events');
			if(!response.ok) {
				throw response;
			}

			const events = await response.json();
			return { success: true, payload: { events: events } };
		}
		catch(err) {
			return _createErrorResult(await err.json());
		}
	},

	async getAttendees(eventId) {
		try {
			const response = await fetch(`/events/${eventId}/attendees`);
			if(!response.ok) {
				throw response;
			}

			const attendees = await response.json();
			return { success: true, payload: { attendees: attendees } };
		}
		catch(err) {
			return _createErrorResult(await err.json());
		}
	},

	// TODO: check session.isLoggedIn() ?
	async getUserEvents() {
		if(!session.getUser()) {
			return { success: false, error: { type: "auth", message: NOT_LOGGED_IN_MESSAGE } };
		}

		try {
			const response = await fetch(`/users/${session.getUser().id}/events`);
			if(!response.ok) {
				throw response;
			}

			const events = await response.json();
			return { success: true, payload: { events: events } };
		}
		catch(err) {
			return _createErrorResult(await err.json());
		}
	},

	async updateIsAttending(eventId, isAttending) {
		if(!session.getUser()) {
			return { success: false, error: { type: "auth", message: NOT_LOGGED_IN_MESSAGE } };
		}

		try {
			const response = await fetch(`/events/${eventId}/attendees`, {
				method: isAttending ? 'POST' : 'DELETE'
			});

			if (!response.ok) {
				throw response;
			}

			return { success: true, payload: { } };
		}
		catch(err) {
			return _createErrorResult(await err.json());
		}
	},

	async register(name, email, password) {
		try {
			const response = await fetch('/users', {
				method: 'POST',
				body: JSON.stringify({
					name: name,
					email: email,
					password: password,
				})
			});

			if(!response.ok) {
				throw response;
			}

			// TODO: should the register API return the created user object?
			return { success: true, payload: { } };
		}
		catch(err) {
			const error = await err.json();
			const errorMessages = Object.keys(error).map(e => `${e} ${error[e]}`);

			return { success: false, error: { type: "unknown", messages: errorMessages } };
		}
	},

	async signin(email, password) {
		try {
			const response = await fetch('/authenticate', {
				method: 'POST',
				body: JSON.stringify({
					email: email,
					password: password,
				})
			});

			if(!response.ok) {
				return { success: false, error: { type: "auth", message: INVALID_CREDENTIALS_MESSAGE } };
			}

			const json = await response.json();
			Cookie.set('auth_token', JSON.stringify(json.auth_token));
			Cookie.set('user', JSON.stringify(json.user));

			return { success: true, payload: { user: json.user, auth_token: json.auth_token } };
		}
		catch(err) {
			return _createErrorResult(await err.json());
		}
	}
}
